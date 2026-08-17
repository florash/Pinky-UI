/**
 * Orphan-page check.
 *
 * Set A: every route the sitemap claims exists (already registry-driven —
 * see apps/website/src/app/sitemap.ts). Set B: every route reached by
 * actually crawling the built site from "/", following internal links —
 * the same path a real visitor or search engine would take. A ⊆ B is the
 * whole check: nothing in the sitemap may be unreachable by following
 * links from the homepage.
 *
 * Also asserts every crawled page carries at least two internal outbound
 * links, so no page is a dead end even if it is technically reachable.
 *
 * Requires a production build: run after `npm run build`, as
 * `npm run verify:release` already does.
 */
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const MIN_OUTBOUND_LINKS = 2;

function fail(message) {
  throw new Error(`[orphans] ${message}`);
}

async function freePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  await new Promise((resolve) => server.close(resolve));
  return port;
}

async function request(baseUrl, pathname) {
  return fetch(`${baseUrl}${pathname}`, { redirect: "manual" });
}

async function waitForServer(baseUrl, child, logs) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) fail(`production server exited early: ${logs.stderr || logs.stdout}`);
    try {
      const response = await request(baseUrl, "/");
      if (response.status > 0) return;
    } catch {
      // still starting
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  fail(`production server did not become ready: ${logs.stderr || logs.stdout}`);
}

async function stopServer(child) {
  if (child.exitCode !== null) return;
  child.kill("SIGTERM");
  await new Promise((resolve) => {
    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      resolve();
    }, 3_000);
    child.once("exit", () => {
      clearTimeout(timeout);
      resolve();
    });
  });
}

/** Internal hrefs only: no external origins, mailto/tel, or bare-fragment links. */
function internalLinksFrom(html) {
  const hrefs = [...html.matchAll(/<a\b[^>]*\shref=["']([^"']+)["']/gi)].map((match) => match[1]);
  const seen = new Set();
  for (const raw of hrefs) {
    if (!raw.startsWith("/")) continue; // external, mailto:, tel:, or fragment-only
    const pathname = raw.split(/[?#]/, 1)[0];
    if (!pathname || pathname === "/") continue;
    seen.add(pathname);
  }
  return seen;
}

async function crawl(baseUrl) {
  const visited = new Map(); // pathname -> outbound link count
  const queue = ["/"];
  const seen = new Set(["/"]);

  while (queue.length > 0) {
    const pathname = queue.shift();
    const response = await request(baseUrl, pathname);
    if (response.status !== 200) {
      // A broken link found while crawling is itself worth surfacing, but it
      // does not block the orphan check — that is verify-metadata's job.
      visited.set(pathname, 0);
      continue;
    }
    const html = await response.text();
    const links = internalLinksFrom(html);
    visited.set(pathname, links.size);
    for (const link of links) {
      if (seen.has(link)) continue;
      seen.add(link);
      queue.push(link);
    }
  }

  return visited;
}

async function loadSitemapRoutes(baseUrl) {
  const response = await request(baseUrl, "/sitemap.xml");
  if (response.status !== 200) fail(`sitemap returned HTTP ${response.status}`);
  const body = await response.text();
  const locations = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  return locations.map((location) => new URL(location).pathname);
}

async function runCheck() {
  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const logs = { stdout: "", stderr: "" };
  const child = spawn(process.execPath, [nextBin, "start", "apps/website", "--port", String(port)], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.on("data", (chunk) => { logs.stdout += chunk.toString(); });
  child.stderr.on("data", (chunk) => { logs.stderr += chunk.toString(); });

  try {
    await waitForServer(baseUrl, child, logs);

    const sitemapRoutes = await loadSitemapRoutes(baseUrl);
    console.log(`[orphans] sitemap: ${sitemapRoutes.length} routes`);

    const crawled = await crawl(baseUrl);
    console.log(`[orphans] crawl: ${crawled.size} pages reached from "/"`);

    const unreached = sitemapRoutes.filter((route) => !crawled.has(route));
    if (unreached.length > 0) {
      fail(
        `${unreached.length} sitemap route(s) are unreachable by following links from "/" — orphan pages:\n` +
        unreached.map((route) => `  - ${route}`).join("\n"),
      );
    }

    const deadEnds = [...crawled.entries()].filter(([, count]) => count < MIN_OUTBOUND_LINKS);
    if (deadEnds.length > 0) {
      fail(
        `${deadEnds.length} page(s) have fewer than ${MIN_OUTBOUND_LINKS} internal outbound links:\n` +
        deadEnds.map(([route, count]) => `  - ${route} (${count})`).join("\n"),
      );
    }

    console.log(`[orphans] PASS: every sitemap route is reachable from "/", every page has ≥${MIN_OUTBOUND_LINKS} outbound links`);
  } finally {
    await stopServer(child);
  }
}

try {
  await runCheck();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
