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
// Comma-separated route prefixes, e.g. "/ai,/mobile" — for auditing a
// specific route tree (a newly added package's pages, say) without paying
// for a full-site crawl.
const routePrefixFilter = process.env.AUDIT_ROUTE_PREFIX?.split(",").map((value) => value.trim());

const INTERACTIVE_SELECTOR =
  'button, a[href], input:not([type="hidden"]), select, textarea, [role="button"], [role="link"], summary';

// Menus, drawers, popovers, accordions and dropdowns only render their real
// content once opened — a crawl that only ever looks at the initial state
// (the bug that shipped the broken mobile nav panel) never sees any of it.
// This selector finds the trigger, not the content, so it works for both
// aria-driven disclosures and native <details>/<summary>.
const EXPAND_TRIGGER_SELECTOR =
  '[aria-expanded="false"], [aria-haspopup]:not([aria-expanded="true"]), summary:not([data-audit-open="true"])';

// Shared with the expanded-state pass below so "no horizontal overflow" and
// "touch targets are big enough" mean the same thing whether or not a panel
// happens to be open — a check that only ran at rest was exactly the gap
// that let the broken mobile nav panel through.
function collectOverflowAndTargetMetrics(minSize) {
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
}

// Finds one not-yet-tried disclosure trigger — menu, drawer, popover,
// accordion, dropdown — by the state it exposes rather than by component
// name, so it works for any implementation: aria-expanded toggles,
// aria-haspopup menus, and native <details>/<summary>. Tags candidates as
// visited permanently rather than tagging every trigger up front in one
// pass: on a component-heavy page, opening/closing one trigger can cause
// React to re-render siblings and replace their DOM nodes, which would
// silently drop an upfront marker before its turn came up. Re-querying
// fresh each call, and only ever taking the first untried match, means a
// replaced node is just seen as "new" again rather than losing its turn.
function findNextTrigger() {
  const nodes = document.querySelectorAll(
    '[aria-expanded="false"]:not([data-audit-visited]), [aria-haspopup]:not([aria-expanded="true"]):not([data-audit-visited]), summary:not([open]):not([data-audit-visited])',
  );
  for (const element of nodes) {
    if (element.closest("[aria-hidden='true'], [inert]")) continue;
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    element.setAttribute("data-audit-visited", "true");
    element.setAttribute("data-audit-trigger", "current");
    return {
      tag: element.tagName.toLowerCase(),
      label: (element.textContent || element.getAttribute("aria-label") || "").trim().slice(0, 60),
      controls: element.getAttribute("aria-controls") || null,
    };
  }
  return null;
}

// Runs entirely inside the page (page.evaluate only ships a function's own
// source, not the Node-side helpers it might reference) — combines the same
// overflow/touch-target check used at rest with a check specific to the
// just-opened region: its own box sitting outside the viewport (the
// "shifted left off-screen" failure) and any of its text being clipped by
// an ancestor with hidden overflow rather than wrapping or scrolling.
function measureExpandedState({ marker, controlsId, minSize }) {
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

  const trigger = document.querySelector(`[data-audit-trigger="${marker}"]`);
  // aria-controls and "next sibling" both miss a portal-rendered dialog/sheet
  // (rendered elsewhere in the tree, not adjacent to its trigger) — which is
  // exactly the case that let the broken mobile nav panel through: its own
  // button has neither. Falling back to "the interactive dialog/menu/listbox
  // that's actually visible right now" catches that case too.
  const region =
    (controlsId && document.getElementById(controlsId)) ||
    trigger?.nextElementSibling ||
    [...document.querySelectorAll('[role="dialog"], [role="menu"], [role="listbox"], [aria-modal="true"]')].find((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    }) ||
    null;
  if (!region) return { overflowPx, small, regionFound: false };

  const rect = region.getBoundingClientRect();
  const viewportWidth = doc.clientWidth;
  const offScreenLeft = rect.left < -1;
  const offScreenRight = rect.right > viewportWidth + 1;

  let clippedText = false;
  for (const node of region.querySelectorAll("*")) {
    const style = window.getComputedStyle(node);
    if (style.overflow !== "hidden" && style.overflowX !== "hidden") continue;
    if (node.scrollWidth > node.clientWidth + 1) {
      clippedText = true;
      break;
    }
  }

  return {
    overflowPx,
    small,
    regionFound: true,
    regionRect: { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) },
    offScreenLeft,
    offScreenRight,
    clippedText,
  };
}

// Best-effort close of every trigger this pass opened, innermost first —
// the mobile nav is exactly a case of one disclosure (the sheet) containing
// another (each group's accordion), and unwinding outside-in would try to
// close an ancestor while a still-open descendant is attached to it. Uses
// in-page .click() rather than a Playwright locator: closing is cleanup, not
// something worth failing the check over, and a native .click() still fires
// the React onClick a real interaction would.
async function closeAllOpen(page) {
  await page.evaluate(() => {
    const opened = [...document.querySelectorAll('[data-audit-open="true"]')].reverse();
    for (const el of opened) {
      el.click();
      el.removeAttribute("data-audit-open");
    }
  });
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForFunction(() => document.getAnimations().length === 0, null, { timeout: 1_000 }).catch(() => {});
  await page.waitForTimeout(100);
}

async function auditExpandedStates(page, minSize) {
  const states = [];
  const MAX_TRIGGERS_PER_ROUTE = 60; // guards against a pathological page, not a real expectation
  // Tracked by tag+label rather than the DOM node itself, because two
  // different failure modes both replace the node: a reload (the recovery
  // path below) wipes data-audit-visited along with the rest of the DOM, and
  // a component that remounts its own trigger on interaction (an inline-edit
  // "Edit" button swapping to a save/cancel state and back, for example)
  // produces a fresh node with no marker even without a reload — both would
  // otherwise be seen as "new" indefinitely and burn the whole per-route
  // budget on one element. Worst case a different trigger with an identical
  // label gets skipped too, which is a missed check, not a false pass.
  const processedIdentities = new Set();

  for (let i = 0; i < MAX_TRIGGERS_PER_ROUTE; i += 1) {
    const trigger = await page.evaluate(findNextTrigger);
    if (!trigger) break;

    const identity = `${trigger.tag}:${trigger.label}`;
    if (processedIdentities.has(identity)) {
      await page.evaluate(() => {
        const el = document.querySelector('[data-audit-trigger="current"]');
        el?.removeAttribute("data-audit-trigger");
      });
      continue;
    }

    // Deliberately does not close previously-opened triggers before this
    // one: a portal-rendered sheet/dialog (the mobile nav's own BottomSheet,
    // for example) isn't a DOM descendant of its trigger button, so "is the
    // new trigger nested inside an open one" can't be answered by DOM
    // containment — and closing on a wrong guess is exactly the bug this
    // whole pass exists to catch, applied to the crawler itself. Openers
    // accumulate for the rest of the route instead; closeAllOpen() below
    // unwinds all of them together once nothing new is left to find, and the
    // per-route page.goto() in auditRoute is the real reset between routes.
    try {
      const target = page.locator('[data-audit-trigger="current"]');
      await target.scrollIntoViewIfNeeded({ timeout: 3_000 });
      await target.click({ timeout: 3_000 }).catch(() => target.click({ timeout: 3_000, force: true }));
      await page.waitForTimeout(350); // let open transitions settle before measuring
      // A spring-physics open (a Motion .animate() driving inline style
      // frame by frame, not a CSS transition) can still be moving well past
      // a fixed wait — long enough that Playwright's own "is this element's
      // position stable yet" actionability check on a *nested* trigger
      // found on the next loop iteration can time out entirely. Bound it
      // rather than wait forever: a spring that's still going after 1.5s
      // either settles slowly by design or isn't going to settle, and
      // either way the next step should proceed rather than hang.
      await page.waitForFunction(() => document.getAnimations().length === 0, null, { timeout: 1_500 }).catch(() => {});

      const state = await page.evaluate(measureExpandedState, {
        marker: "current",
        controlsId: trigger.controls,
        minSize,
      });

      states.push({ trigger: { tag: trigger.tag, label: trigger.label }, ...state });
      processedIdentities.add(identity);

      // Left open on purpose — see the nesting check above and
      // closeAllOpen(). data-audit-open marks it so both can find it later;
      // data-audit-trigger is cleared now since only one element may ever
      // carry that marker at a time (findNextTrigger() re-tags "current"
      // on the next call, and two matches is a Playwright locator error).
      await page.evaluate(() => {
        const el = document.querySelector('[data-audit-trigger="current"]');
        el?.setAttribute("data-audit-open", "true");
        el?.removeAttribute("data-audit-trigger");
      });
    } catch (error) {
      states.push({ trigger: { tag: trigger.tag, label: trigger.label }, error: String(error).slice(0, 200) });
      processedIdentities.add(identity);
      // A failed click/measure can't be trusted to have left the page in a
      // clean state either — reload rather than risk bleeding into the rest.
      await page.reload({ waitUntil: "networkidle", timeout: 15_000 }).catch(() => {});
    }
  }

  await closeAllOpen(page);
  return states;
}

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
  let expandedStates = [];

  if (!timedOut) {
    try {
      const metrics = await page.evaluate(collectOverflowAndTargetMetrics, 44);

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

      // The gap that let the broken mobile nav panel through production: a
      // crawl that only ever looked at rest never rendered its content.
      // Every collapsed menu/drawer/popover/accordion/dropdown on the route
      // gets opened and checked the same way the at-rest state just was.
      expandedStates = await auditExpandedStates(page, 44);
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
    expandedStates,
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
    const prefixed = routePrefixFilter
      ? allRoutes.filter((route) => routePrefixFilter.some((prefix) => route === prefix || route.startsWith(`${prefix}/`) || route.startsWith(`${prefix}?`)))
      : allRoutes;
    const routes = Number.isFinite(MAX_ROUTES) ? prefixed.slice(0, MAX_ROUTES) : prefixed;
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
