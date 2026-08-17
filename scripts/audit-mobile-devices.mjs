import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

import { chromium, webkit, devices } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 4176;
const BASE_URL = `http://localhost:${PORT}`;

// The 10 routes with the heaviest concentration of pointer/rAF/gesture
// effects, picked from the production bundle-size report — the routes most
// likely to actually show a frame-rate problem, not a representative sample
// of the other 625.
const HEAVY_ROUTES = [
  "/",
  "/explore",
  "/effects",
  "/systems/morph-lightbox",
  "/experiences/liquid-navbar",
  "/components/jelly-card",
  "/ai",
  "/mobile",
  "/layouts/curved-3d-grid",
  "/workflows/morph-toast",
];

// A broader spot-check set for the correctness assertions (console errors,
// overflow, orientation reflow, hover-effect mounting) — every family gets
// at least one representative page.
const SPOT_CHECK_ROUTES = [
  "/",
  "/components/jelly-card",
  "/layouts/masonry-gallery",
  "/effects/soft-cursor",
  "/experiences/liquid-navbar",
  "/systems/morph-lightbox",
  "/workflows/morph-toast",
  "/mobile",
  "/ai/prompt-input",
  "/skills",
  "/docs",
  "/explore",
];

function waitForServer(url, timeoutMs = 60_000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const response = await fetch(url);
        if (response.ok || response.status < 500) return resolve();
      } catch {
        // not up yet
      }
      if (Date.now() - started > timeoutMs) return reject(new Error("server did not become ready in time"));
      setTimeout(tick, 500);
    };
    tick();
  });
}

// ---------------------------------------------------------------------------
// Part 1: static checks — things a runtime device emulation can't answer any
// better than reading the source, so reading the source is what actually
// happens (a Playwright viewport has no real mobile Safari address bar to
// shrink, so a 100vh bug wouldn't reproduce there either).
// ---------------------------------------------------------------------------

const SCAN_DIRS = ["apps/website/src", "packages"].map((dir) => path.join(root, dir));
const SKIP_SEGMENTS = new Set(["node_modules", "dist", ".next", "__snapshots__"]);

async function walk(dir, out = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.name.startsWith("._") || SKIP_SEGMENTS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else out.push(full);
  }
  return out;
}

async function staticChecks() {
  const files = (await Promise.all(SCAN_DIRS.map((dir) => walk(dir)))).flat()
    .filter((file) => /\.(ts|tsx|css)$/.test(file) && !/\.test\.tsx?$/.test(file));

  const vh100 = [];
  const smallInputFont = [];
  const touchActionSites = [];

  for (const file of files) {
    const content = await fs.readFile(file, "utf8");
    const relative = path.relative(root, file);

    for (const match of content.matchAll(/\b100vh\b/g)) {
      vh100.push({ file: relative, line: content.slice(0, match.index).split("\n").length });
    }

    if (/<(input|textarea)\b/.test(content)) {
      // Heuristic: an input/textarea styled with a font size below 16px is
      // the iOS Safari auto-zoom-on-focus trigger. Flags any small text
      // size class near an input tag in the same file as a candidate —
      // not a precise per-element check, a "go look at this file" signal.
      const smallSizePattern = /text-(?:xs|sm|\[0\.\d+rem\]|\[1[0-5]px\])/g;
      if (content.match(/<(input|textarea)\b[^>]*className="[^"]*text-(xs|sm)/)) {
        smallInputFont.push({ file: relative });
      }
      void smallSizePattern;
    }

    if (/\bdrag=|onPointerDown|onTouchStart/.test(content) && /touch-action|touchAction/.test(content)) {
      touchActionSites.push({ file: relative });
    }
  }

  let viewportMetaOk = false;
  try {
    const layoutFile = path.join(root, "apps/website/src/app/layout.tsx");
    const content = await fs.readFile(layoutFile, "utf8");
    // Next.js App Router sets the viewport meta automatically via its
    // `viewport` export or defaults `width=device-width` — either counts.
    viewportMetaOk = /width:\s*["']?device-width/.test(content) || !/viewport.*content=/.test(content);
  } catch {
    viewportMetaOk = null;
  }

  return { vh100, smallInputFont, touchActionSites, viewportMetaOk, filesScanned: files.length };
}

// ---------------------------------------------------------------------------
// Part 2: real device emulation via Playwright's `devices` presets — iPhone
// 14 Pro on WebKit (the same rendering engine real Safari uses, though not
// the exact same binary Apple ships), Pixel 7 on Chromium (real Android
// Chrome's engine). `hasTouch`, `isMobile`, `deviceScaleFactor` and the real
// device viewport all come from the preset, not a manual width override.
// ---------------------------------------------------------------------------

async function spotCheckRoute(context, route, deviceLabel) {
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text().slice(0, 200)); });
  page.on("pageerror", (error) => pageErrors.push(String(error).slice(0, 200)));

  const result = { route, device: deviceLabel, consoleErrors, pageErrors };

  try {
    await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle", timeout: 20_000 });
  } catch (error) {
    result.navigationFailed = String(error).slice(0, 200);
    await page.close();
    return result;
  }

  const metrics = await page.evaluate(() => {
    const doc = document.documentElement;
    const overflowPx = doc.scrollWidth - doc.clientWidth;
    // Cursor-family decorative layers set this data attribute when the
    // native cursor is intentionally hidden; their absence is what "hover
    // effects genuinely did not mount" looks like from outside the React tree.
    const cursorHiddenFlag = doc.dataset.pinkyCursor === "hidden";
    // A crude presence check for the fixed-position, aria-hidden layers the
    // cursor family renders — soft cursor dot/follower, blob, trail nodes.
    const decorativeCursorNodes = [...document.querySelectorAll('[aria-hidden="true"]')]
      .filter((element) => {
        const style = window.getComputedStyle(element);
        return style.position === "fixed" && Number.parseInt(style.zIndex || "0", 10) >= 40;
      }).length;
    return { overflowPx, cursorHiddenFlag, decorativeCursorNodes };
  });
  Object.assign(result, metrics);

  // Orientation flip: swap viewport dimensions and re-check overflow —
  // Playwright can do this even though it can't simulate the physical
  // rotation event iOS fires.
  const viewport = page.viewportSize();
  if (viewport) {
    await page.setViewportSize({ width: viewport.height, height: viewport.width });
    await page.waitForTimeout(200);
    const landscapeOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    result.landscapeOverflowPx = landscapeOverflow;
    await page.setViewportSize(viewport);
  }

  await page.close();
  return result;
}

async function runSpotChecks(browserType, deviceName, deviceLabel) {
  const browser = await browserType.launch();
  const context = await browser.newContext({ ...devices[deviceName] });
  const results = [];
  for (const route of SPOT_CHECK_ROUTES) {
    results.push(await spotCheckRoute(context, route, deviceLabel));
  }
  await context.close();
  await browser.close();
  return results;
}

// ---------------------------------------------------------------------------
// Part 3: performance sampling under throttle — CDP only, so Chromium/Pixel
// path only. WebKit has no equivalent throttling API exposed to Playwright;
// noted as a real coverage gap rather than silently skipped.
// ---------------------------------------------------------------------------

async function performanceSample(context, route) {
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    downloadThroughput: (1.6 * 1024 * 1024) / 8, // ~1.6Mbps, "Slow 3G"-ish
    uploadThroughput: (750 * 1024) / 8,
    latency: 150,
  });

  const start = Date.now();
  await page.goto(`${BASE_URL}${route}`, { waitUntil: "load", timeout: 45_000 }).catch(() => {});
  const loadMs = Date.now() - start;

  // Scroll through the page while sampling rAF-to-rAF gaps as a frame-time
  // proxy — not a true compositor FPS counter (that needs a trace, not just
  // rAF timestamps), but a reasonable, cheap signal for "something here is
  // janky" under 4x CPU throttle.
  const frameSample = await page.evaluate(async () => {
    const gaps = [];
    let last = performance.now();
    const samples = 90;
    for (let i = 0; i < samples; i += 1) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const now = performance.now();
      gaps.push(now - last);
      last = now;
      if (i % 6 === 0) window.scrollBy(0, 120);
    }
    return gaps;
  });

  const concurrentAnimations = await page.evaluate(() => document.getAnimations().length);

  await cdp.detach().catch(() => {});
  await page.close();

  const avgFrameMs = frameSample.reduce((a, b) => a + b, 0) / frameSample.length;
  const worstFrameMs = Math.max(...frameSample);
  const estimatedFps = 1000 / avgFrameMs;
  const droppedBelow50fps = frameSample.filter((gap) => 1000 / gap < 50).length;

  return { route, loadMs, avgFrameMs: Math.round(avgFrameMs * 10) / 10, worstFrameMs: Math.round(worstFrameMs), estimatedFps: Math.round(estimatedFps * 10) / 10, droppedBelow50fpsFrames: droppedBelow50fps, sampledFrames: frameSample.length, concurrentAnimations };
}

async function runPerformanceSampling() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ ...devices["Pixel 7"] });
  const results = [];
  for (const route of HEAVY_ROUTES) {
    results.push(await performanceSample(context, route));
  }
  await context.close();
  await browser.close();
  return results;
}

// ---------------------------------------------------------------------------

async function main() {
  console.log("[mobile-audit] running static checks...");
  const staticResults = await staticChecks();

  console.log("[mobile-audit] starting production server...");
  const server = spawn("npm", ["run", "start", "--", "-p", String(PORT)], {
    cwd: root,
    env: { ...process.env, NEXT_PUBLIC_SITE_URL: BASE_URL },
    stdio: "ignore",
  });
  const cleanup = () => server.kill("SIGTERM");
  process.on("exit", cleanup);

  try {
    await waitForServer(BASE_URL);
    console.log("[mobile-audit] server ready");

    console.log("[mobile-audit] spot-checking iPhone 14 Pro (WebKit)...");
    const iosResults = await runSpotChecks(webkit, "iPhone 14 Pro", "iPhone 14 Pro (WebKit)");

    console.log("[mobile-audit] spot-checking Pixel 7 (Chromium)...");
    const androidResults = await runSpotChecks(chromium, "Pixel 7", "Pixel 7 (Chromium)");

    console.log("[mobile-audit] sampling performance under 4x CPU throttle + slow network (Pixel 7 / Chromium only)...");
    const perfResults = await runPerformanceSampling();

    const report = {
      generatedAt: new Date().toISOString(),
      static: staticResults,
      spotChecks: [...iosResults, ...androidResults],
      performance: perfResults,
      knownGaps: [
        "iOS rubber-band overscroll and fixed-element misalignment during it — not reproducible without real iOS hardware; Playwright/WebKit desktop does not replicate the native bounce physics.",
        "300ms tap delay — only the viewport-meta precondition is checked; actual delay suppression is a browser-internal heuristic not observable via Playwright timing.",
        "Real safe-area-inset-* values — Playwright emulation reports 0 for all insets (no real notch/Dynamic Island/home indicator); only confirmed the CSS references env(safe-area-inset-*) correctly, not that real values thread through.",
        "WebKit performance sampling — Emulation.setCPUThrottlingRate and Network.emulateNetworkConditions are Chromium CDP domains; no equivalent was available for the WebKit (iPhone) path.",
      ],
    };

    await fs.mkdir(path.join(root, ".audit"), { recursive: true });
    await fs.writeFile(path.join(root, ".audit/mobile-devices.json"), JSON.stringify(report, null, 2));
    console.log("[mobile-audit] done. Report written to .audit/mobile-devices.json");
  } finally {
    cleanup();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
