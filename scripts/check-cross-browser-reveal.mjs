import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

import { chromium, firefox, webkit } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 4177;
const BASE_URL = `http://localhost:${PORT}`;

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

async function checkInBrowser(browserType, label) {
  const browser = await browserType.launch();
  const page = await browser.newPage();
  const results = [];

  await page.goto(`${BASE_URL}/ai/thinking-panel`, { waitUntil: "networkidle", timeout: 20_000 });

  const trigger = page.locator("button[aria-controls]").first();
  const readState = () =>
    trigger.evaluate((el) => {
      const targetId = el.getAttribute("aria-controls");
      const target = targetId ? document.getElementById(targetId) : null;
      const wrapper = target?.parentElement;
      if (!target || !wrapper) return null;
      return {
        gridTemplateRows: getComputedStyle(wrapper).gridTemplateRows,
        contentHeight: Math.round(target.getBoundingClientRect().height * 100) / 100,
        scrollHeight: target.scrollHeight,
        inert: target.hasAttribute("inert"),
        expanded: el.getAttribute("aria-expanded"),
      };
    });

  // The demo starts `defaultOpen`, so the first click closes it and the
  // second re-opens it — checking both directions catches an asymmetric
  // bug a single click could miss.
  const initial = await readState();
  await trigger.click();
  await page.waitForTimeout(450); // past the 300ms transition
  const afterFirstClick = await readState();
  await trigger.click();
  await page.waitForTimeout(450);
  const afterSecondClick = await readState();

  results.push({ label, route: "/ai/thinking-panel", initial, afterFirstClick, afterSecondClick });

  await browser.close();
  return results;
}

async function main() {
  console.log("[cross-browser-reveal] starting production server...");
  const server = spawn("npm", ["run", "start", "--", "-p", String(PORT)], {
    cwd: root,
    env: { ...process.env, NEXT_PUBLIC_SITE_URL: BASE_URL },
    stdio: "ignore",
  });
  const cleanup = () => server.kill("SIGTERM");
  process.on("exit", cleanup);

  try {
    await waitForServer(BASE_URL);
    console.log("[cross-browser-reveal] server ready");

    const all = [];
    for (const [browserType, label] of [
      [chromium, "Chromium"],
      [firefox, "Firefox"],
      [webkit, "WebKit (Safari engine)"],
    ]) {
      console.log(`[cross-browser-reveal] checking in ${label}...`);
      all.push(...(await checkInBrowser(browserType, label)));
    }

    console.log(JSON.stringify(all, null, 2));

    // Cross-browser parity: for each of the three states (initial/after
    // first click/after second click), every browser's contentHeight and
    // inert flag should match. gridTemplateRows resolves to a pixel value
    // once computed (never the literal "1fr"/"0fr" from the stylesheet), so
    // comparing across browsers — not against a hardcoded string — is the
    // correct check.
    const states = ["initial", "afterFirstClick", "afterSecondClick"];
    const byBrowser = Object.fromEntries(all.map((r) => [r.label, r]));
    const browsers = Object.keys(byBrowser);
    const parityFailures = [];
    const clipFailures = [];

    for (const state of states) {
      const reference = byBrowser[browsers[0]]?.[state];
      if (!reference) continue;
      for (const label of browsers) {
        const value = byBrowser[label]?.[state];
        if (!value) continue;
        if (value.inert !== reference.inert || Math.abs(value.contentHeight - reference.contentHeight) > 1) {
          parityFailures.push({ state, label, reference, value });
        }
        // A collapsed panel (contentHeight ~0) legitimately has
        // scrollHeight > contentHeight — that is what "collapsed" means.
        // Only an *open* panel whose visible height doesn't reach its
        // content's real height is an actual clipping bug.
        if (value.contentHeight > 4 && value.scrollHeight > value.contentHeight + 2) {
          clipFailures.push({ state, label, value });
        }
      }
    }

    if (parityFailures.length || clipFailures.length) {
      console.error(`[cross-browser-reveal] FAIL: ${parityFailures.length} cross-browser parity mismatch(es), ${clipFailures.length} real clipping issue(s) (open panel not reaching full content height)`);
      process.exitCode = 1;
    } else {
      console.log(`[cross-browser-reveal] PASS: identical contentHeight and inert state across ${browsers.join(", ")} at every toggle state; open panels always reach their full content height`);
    }
  } finally {
    cleanup();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
