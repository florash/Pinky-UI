import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 4175;
const BASE_URL = `http://localhost:${PORT}`;
const CYCLES = 10;

// Two routes chosen for the heaviest concentration of rAF/pointer-listener
// effects in the registry — cursor family, spotlight, tilt, scroll-linked
// motion — so a leak has the best chance of showing up in ten round trips.
const ROUTE_A = "/effects";
const ROUTE_B = "/";

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

/**
 * Injected before any page script runs. Wraps `addEventListener` on `window`
 * and `document` (where a component that forgets to clean up on unmount
 * most commonly leaves a listener behind) to track a running net count, and
 * wraps `requestAnimationFrame`/`cancelAnimationFrame` the same way. Net
 * counts that climb monotonically across identical navigation cycles — not
 * just fluctuate — are the leak signal; a healthy component's listener count
 * returns to roughly the same baseline each time it mounts.
 */
const TRACKER_SCRIPT = `
(() => {
  window.__pinkyLeakTracker = { listeners: 0, rafPending: 0 };
  for (const target of [window, document]) {
    const originalAdd = target.addEventListener.bind(target);
    const originalRemove = target.removeEventListener.bind(target);
    target.addEventListener = function (...args) {
      window.__pinkyLeakTracker.listeners += 1;
      return originalAdd(...args);
    };
    target.removeEventListener = function (...args) {
      window.__pinkyLeakTracker.listeners -= 1;
      return originalRemove(...args);
    };
  }
  const originalRaf = window.requestAnimationFrame.bind(window);
  const originalCancel = window.cancelAnimationFrame.bind(window);
  window.requestAnimationFrame = function (callback) {
    window.__pinkyLeakTracker.rafPending += 1;
    return originalRaf((time) => {
      window.__pinkyLeakTracker.rafPending -= 1;
      callback(time);
    });
  };
  window.cancelAnimationFrame = function (handle) {
    window.__pinkyLeakTracker.rafPending -= 1;
    return originalCancel(handle);
  };
})();
`;

async function main() {
  console.log("[leak-check] starting production server...");
  const server = spawn("npm", ["run", "start", "--", "-p", String(PORT)], {
    cwd: root,
    env: { ...process.env, NEXT_PUBLIC_SITE_URL: BASE_URL },
    stdio: "ignore",
  });
  const cleanup = () => server.kill("SIGTERM");
  process.on("exit", cleanup);

  try {
    await waitForServer(BASE_URL);
    console.log("[leak-check] server ready");

    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.addInitScript(TRACKER_SCRIPT);

    await page.goto(`${BASE_URL}${ROUTE_A}`, { waitUntil: "networkidle" });

    const samples = [];
    for (let cycle = 0; cycle < CYCLES; cycle += 1) {
      // Client-side navigation via the app's own <Link>s, not page.goto —
      // page.goto is a full reload and would never exercise React unmount
      // cleanup at all, which is exactly the path a leak hides in.
      await page.evaluate((href) => {
        const link = [...document.querySelectorAll("a[href]")].find((a) => new URL(a.href).pathname === href);
        if (link) link.click();
      }, ROUTE_B);
      await page.waitForURL((url) => url.pathname === ROUTE_B, { timeout: 10_000 }).catch(() => {});
      await page.waitForTimeout(400);

      await page.evaluate((href) => {
        const link = [...document.querySelectorAll("a[href]")].find((a) => new URL(a.href).pathname === href);
        if (link) link.click();
      }, ROUTE_A);
      await page.waitForURL((url) => url.pathname === ROUTE_A, { timeout: 10_000 }).catch(() => {});
      await page.waitForTimeout(400);

      const sample = await page.evaluate(() => {
        const tracker = window.__pinkyLeakTracker ?? { listeners: 0, rafPending: 0 };
        const memory = performance.memory ? { usedJSHeapSize: performance.memory.usedJSHeapSize } : null;
        return { ...tracker, memory };
      });
      const currentPath = new URL(page.url()).pathname;
      samples.push({ cycle: cycle + 1, path: currentPath, ...sample });
      console.log(`[leak-check] cycle ${cycle + 1}/${CYCLES} (at ${currentPath}): net listeners=${sample.listeners}, pending rAF=${sample.rafPending}${sample.memory ? `, heap=${(sample.memory.usedJSHeapSize / 1_048_576).toFixed(1)}MB` : ""}`);
      if (currentPath !== ROUTE_A) {
        console.log(`  WARNING: expected to be back at ${ROUTE_A}, navigation may have silently failed`);
      }
    }

    await browser.close();

    const first = samples[0];
    const last = samples[samples.length - 1];
    const listenerGrowth = last.listeners - first.listeners;
    const rafGrowth = last.rafPending - first.rafPending;
    const heapGrowth = first.memory && last.memory ? (last.memory.usedJSHeapSize - first.memory.usedJSHeapSize) / 1_048_576 : null;

    console.log(`\n[leak-check] summary over ${CYCLES} cycles (${ROUTE_A} <-> ${ROUTE_B}):`);
    console.log(`  net listener count: ${first.listeners} -> ${last.listeners} (${listenerGrowth >= 0 ? "+" : ""}${listenerGrowth})`);
    console.log(`  pending rAF count:  ${first.rafPending} -> ${last.rafPending} (${rafGrowth >= 0 ? "+" : ""}${rafGrowth})`);
    if (heapGrowth !== null) console.log(`  JS heap:            ${(first.memory.usedJSHeapSize / 1_048_576).toFixed(1)}MB -> ${(last.memory.usedJSHeapSize / 1_048_576).toFixed(1)}MB (${heapGrowth >= 0 ? "+" : ""}${heapGrowth.toFixed(1)}MB)`);
    else console.log("  JS heap:            unavailable (run Chromium with --enable-precise-memory-info to capture this)");

    if (listenerGrowth > CYCLES) {
      console.log(`\n  FLAG: net listener count grew by more than one per cycle (${listenerGrowth} over ${CYCLES}) — a component in the ${ROUTE_A} <-> ${ROUTE_B} pair is likely not cleaning up on unmount.`);
      process.exitCode = 1;
    } else {
      console.log("\n  PASS: listener count did not grow monotonically beyond noise.");
    }
  } finally {
    cleanup();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
