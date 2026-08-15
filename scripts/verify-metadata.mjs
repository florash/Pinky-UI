import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const fallbackOrigin = "https://pinky-ui.example.test";

function fail(message) {
  throw new Error(`[metadata] ${message}`);
}

function normalizeOrigin(value) {
  const raw = value?.trim() || fallbackOrigin;
  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
  const url = new URL(candidate);
  if (url.protocol !== "http:" && url.protocol !== "https:") fail("site URL must use http or https");
  if (url.username || url.password) fail("site URL must not contain credentials");
  if (url.pathname !== "/" && url.pathname !== "") fail("site URL must be an origin without a path");
  if (url.search || url.hash) fail("site URL must be an origin without a query or fragment");
  if (["localhost", "127.0.0.1", "::1"].includes(url.hostname)) {
    fail("production metadata verification requires a non-local site URL");
  }
  return url.origin;
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

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([:\w-]+)=["']([^"']*)["']/g)].map((match) => [match[1], match[2]]),
  );
}

function metaValue(html, key, value) {
  const tag = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((candidate) => {
      const attrs = attributes(candidate);
      return attrs[key] === value;
    });
  return tag ? attributes(tag).content ?? null : null;
}

function linkValue(html, rel) {
  const tag = [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((candidate) => (attributes(candidate).rel ?? "").split(/\s+/).includes(rel));
  return tag ? attributes(tag).href ?? null : null;
}

function expectedUrl(origin, pathname) {
  return new URL(pathname, `${origin}/`).toString();
}

function canonicalComparable(value) {
  return value?.replace(/\/$/, "") || value;
}

async function request(baseUrl, pathname, options) {
  return fetch(`${baseUrl}${pathname}`, { redirect: "manual", ...options });
}

async function waitForServer(baseUrl, child, logs) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) fail(`production server exited early: ${logs.stderr || logs.stdout}`);
    try {
      const response = await request(baseUrl, "/");
      if (response.status > 0) return;
    } catch {
      // The server is still starting.
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

async function assertPage(baseUrl, origin, pathname, expectedTitle) {
  const response = await request(baseUrl, pathname);
  if (response.status !== 200) fail(`${pathname} returned HTTP ${response.status}`);
  const html = await response.text();
  const canonical = linkValue(html, "canonical");
  if (canonicalComparable(canonical) !== canonicalComparable(expectedUrl(origin, pathname.split("?")[0]))) {
    fail(`${pathname} canonical mismatch: ${canonical ?? "missing"}`);
  }
  if (!html.includes(`<title>${expectedTitle}`)) fail(`${pathname} title does not contain ${expectedTitle}`);
  if (!metaValue(html, "name", "description")) fail(`${pathname} is missing a description`);
  if (metaValue(html, "property", "og:url") !== canonical) fail(`${pathname} Open Graph URL does not match canonical`);
  if (!metaValue(html, "name", "twitter:title")?.includes(expectedTitle)) fail(`${pathname} Twitter title is not route-specific`);
  if (html.split("</head>", 1)[0].includes("http://localhost:3000")) {
    fail(`${pathname} head contains a localhost URL`);
  }
  return html;
}

async function verifyOutput() {
  const origin = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const logs = { stdout: "", stderr: "" };
  const child = spawn(process.execPath, [nextBin, "start", "apps/website", "--port", String(port)], {
    cwd: root,
    env: { ...process.env, NEXT_PUBLIC_SITE_URL: origin },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.on("data", (chunk) => { logs.stdout += chunk.toString(); });
  child.stderr.on("data", (chunk) => { logs.stderr += chunk.toString(); });

  try {
    await waitForServer(baseUrl, child, logs);
    await assertPage(baseUrl, origin, "/", "Pinky UI");
    await assertPage(baseUrl, origin, "/docs", "Docs");
    await assertPage(baseUrl, origin, "/collections", "Collections");
    await assertPage(baseUrl, origin, "/components/jelly-card", "Jelly Card");
    await assertPage(baseUrl, origin, "/skills/components/magnetic-button", "Magnetic Button");
    await assertPage(baseUrl, origin, "/layouts?family=collections", "Layouts");

    const alias = await request(baseUrl, "/skills/motion/shared-morph");
    if (alias.status !== 308) fail(`legacy Skill alias returned HTTP ${alias.status}, expected 308`);
    const aliasLocation = alias.headers.get("location");
    if (new URL(aliasLocation ?? "", baseUrl).pathname !== "/skills/patterns/shared-morph") {
      fail(`legacy Skill alias points to ${aliasLocation ?? "missing location"}`);
    }

    const notFound = await request(baseUrl, "/__pinky_ui_metadata_missing__");
    if (notFound.status !== 404) fail(`not-found route returned HTTP ${notFound.status}`);
    const notFoundHtml = await notFound.text();
    if (!metaValue(notFoundHtml, "name", "robots")?.includes("noindex")) fail("not-found output is not noindex");
    if (linkValue(notFoundHtml, "canonical")) fail("not-found output contains a canonical URL");

    const sitemap = await request(baseUrl, "/sitemap.xml");
    if (sitemap.status !== 200) fail(`sitemap returned HTTP ${sitemap.status}`);
    const sitemapBody = await sitemap.text();
    if (!sitemap.headers.get("content-type")?.includes("xml")) fail("sitemap content type is not XML");
    const locations = [...sitemapBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    if (locations.length === 0 || new Set(locations).size !== locations.length) fail("sitemap has no locations or duplicate locations");
    if (!locations.includes(expectedUrl(origin, "/"))) fail("sitemap is missing the homepage");
    if (!locations.includes(expectedUrl(origin, "/skills/components/magnetic-button"))) fail("sitemap is missing a representative Skill route");
    if (locations.some((location) => location.includes("/skills/motion/shared-morph") || location.includes("_not-found") || location.includes("?") || location.includes("#"))) {
      fail("sitemap contains an alias, system route, query URL or fragment URL");
    }
    if (sitemapBody.includes("localhost")) fail("sitemap contains a localhost URL");

    const robots = await request(baseUrl, "/robots.txt");
    if (robots.status !== 200) fail(`robots returned HTTP ${robots.status}`);
    const robotsBody = await robots.text();
    if (!/User-agent:\s*\*/i.test(robotsBody) || !robotsBody.includes("Allow: /")) {
      fail("robots policy is incomplete");
    }
    if (!robotsBody.includes(`Sitemap: ${expectedUrl(origin, "/sitemap.xml")}`)) fail("robots sitemap URL is incorrect");
    if (robotsBody.includes("localhost")) fail("robots contains a localhost URL");

    console.log(`[metadata] production output: PASS (${locations.length} sitemap URLs, origin ${origin})`);
  } finally {
    await stopServer(child);
  }
}

try {
  await verifyOutput();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
