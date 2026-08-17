import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;
const OUT_DIR = path.join(root, ".audit");

const ALL_VIEWPORTS = [
  { name: "320", width: 320, height: 700 },
  { name: "375", width: 375, height: 812 },
  { name: "390", width: 390, height: 844 },
  { name: "414", width: 414, height: 896 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1920", width: 1920, height: 1080 },
];

const viewportFilter = process.env.AUDIT_VIEWPORTS?.split(",").map((value) => value.trim());
const VIEWPORTS = viewportFilter ? ALL_VIEWPORTS.filter((viewport) => viewportFilter.includes(viewport.name)) : ALL_VIEWPORTS;
const MAX_ROUTES = process.env.AUDIT_MAX_ROUTES ? Number(process.env.AUDIT_MAX_ROUTES) : Infinity;

const INTERACTIVE_SELECTOR =
  'button, a[href], input:not([type="hidden"]), select, textarea, [role="button"], [role="link"], summary';

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

async function getRoutes() {
  const response = await fetch(`${BASE_URL}/sitemap.xml`);
  const xml = await response.text();
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  return matches
    .map((url) => new URL(url).pathname)
    .filter((pathname, index, all) => all.indexOf(pathname) === index);
}

async function auditRoute(page, route, viewport) {
  const consoleErrors = [];
  const pageErrors = [];

  const onConsole = (message) => {
    if (message.type() === "error") consoleErrors.push(message.text().slice(0, 300));
  };
  const onPageError = (error) => pageErrors.push(String(error).slice(0, 300));

  page.on("console", onConsole);
  page.on("pageerror", onPageError);

  let httpStatus = null;
  let timedOut = false;
  try {
    const response = await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle", timeout: 15_000 });
    httpStatus = response?.status() ?? null;
  } catch (error) {
    timedOut = true;
    pageErrors.push(`navigation failed: ${String(error).slice(0, 200)}`);
  }

  let overflow = null;
  let smallTargets = [];
  let fixedElements = [];
  let concurrentAnimations = null;

  if (!timedOut) {
    try {
      const metrics = await page.evaluate((minSize) => {
        const doc = document.documentElement;
        const overflowPx = doc.scrollWidth - doc.clientWidth;

        const targets = [...document.querySelectorAll(
          'button, a[href], input:not([type="hidden"]), select, textarea, [role="button"], [role="link"], summary',
        )];
        const small = [];
        for (const element of targets) {
          const style = window.getComputedStyle(element);
          if (style.display === "none" || style.visibility === "hidden") continue;
          const rect = element.getBoundingClientRect();
          if (rect.width === 0 && rect.height === 0) continue;
          // sr-only pattern: 1px clipped box is a deliberate accessible-but-invisible target, not a tap target.
          if (rect.width <= 1 && rect.height <= 1) continue;
          if (rect.width < minSize || rect.height < minSize) {
            small.push({
              tag: element.tagName.toLowerCase(),
              text: (element.textContent || element.getAttribute("aria-label") || "").trim().slice(0, 40),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
            });
          }
        }

        const fixed = [];
        for (const element of document.querySelectorAll("body *")) {
          const style = window.getComputedStyle(element);
          if (style.position !== "fixed") continue;
          const rect = element.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          fixed.push({
            tag: element.tagName.toLowerCase(),
            className: (element.className || "").toString().slice(0, 60),
            top: Math.round(rect.top),
            bottom: Math.round(rect.bottom),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
          });
        }

        return { overflowPx, small, fixed };
      }, 44);

      overflow = metrics.overflowPx;
      smallTargets = metrics.small;
      fixedElements = metrics.fixed;

      // A snapshot immediately after `networkidle` mostly catches mount/inView
      // entrances; jiggling the pointer and scrolling a little first also
      // wakes hover- and scroll-triggered effects, so the count is closer to
      // what a real visit would run concurrently, not just a cold-load floor.
      await page.mouse.move(viewport.width / 2, viewport.height / 2);
      await page.mouse.move(viewport.width / 2 - 40, viewport.height / 2 + 40);
      await page.mouse.wheel(0, 300);
      await page.waitForTimeout(150);
      concurrentAnimations = await page.evaluate(() => document.getAnimations().length);
    } catch (error) {
      pageErrors.push(`evaluate failed: ${String(error).slice(0, 200)}`);
    }
  }

  page.off("console", onConsole);
  page.off("pageerror", onPageError);

  return {
    route,
    viewport: viewport.name,
    httpStatus,
    timedOut,
    overflowPx: overflow,
    consoleErrors,
    pageErrors,
    smallTargets,
    fixedElements,
    concurrentAnimations,
  };
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  console.log("[audit] starting production server...");
  const server = spawn("npm", ["run", "start", "--", "-p", String(PORT)], {
    cwd: root,
    env: { ...process.env, NEXT_PUBLIC_SITE_URL: BASE_URL },
    stdio: "ignore",
  });

  const cleanup = () => {
    server.kill("SIGTERM");
  };
  process.on("exit", cleanup);

  try {
    await waitForServer(BASE_URL);
    console.log("[audit] server ready");

    const allRoutes = await getRoutes();
    const routes = Number.isFinite(MAX_ROUTES) ? allRoutes.slice(0, MAX_ROUTES) : allRoutes;
    console.log(`[audit] ${routes.length}/${allRoutes.length} routes, ${VIEWPORTS.length} viewports`);

    const browser = await chromium.launch();
    const results = [];
    let done = 0;
    const total = routes.length * VIEWPORTS.length;

    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
      const page = await context.newPage();

      for (const route of routes) {
        const result = await auditRoute(page, route, viewport);
        results.push(result);
        done += 1;
        if (done % 50 === 0) {
          console.log(`[audit] ${done}/${total} (${((done / total) * 100).toFixed(1)}%)`);
          await fs.writeFile(path.join(OUT_DIR, "results.partial.json"), JSON.stringify(results, null, 2));
        }
      }

      await context.close();
    }

    await browser.close();
    await fs.writeFile(path.join(OUT_DIR, "results.json"), JSON.stringify(results, null, 2));
    console.log(`[audit] done. ${results.length} checks written to .audit/results.json`);
  } finally {
    cleanup();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
