import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Files allowed to construct `matchMedia("(hover: hover)")` /
 * `matchMedia("(pointer: fine)")` directly. Everywhere else must go through
 * `usePointerCapability` (or `useFinePointer`, which now just re-exports it)
 * — one judgment source, so a future hover effect cannot quietly grow a
 * second, divergent definition of "touch."
 */
const CAPABILITY_SOURCE_FILES = new Set([
  "packages/primitives/src/internal/use-pointer-capability.ts",
  // Kept as a thin, intentional re-export of the hook above; its own
  // implementation legitimately calls usePointerCapability(), not matchMedia.
  "packages/effects/src/internal/pointer-motion.ts",
]);

const SCAN_DIRS = ["apps/website/src", "packages"].map((dir) => path.join(root, dir));
const CODE_EXT = new Set([".ts", ".tsx"]);
const STYLE_EXT = new Set([".css"]);
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

/** True if `index` falls inside a `@media (hover: hover) { ... }` block, by brace depth. */
function isInsideHoverMediaGuard(css, index) {
  const before = css.slice(0, index);
  const mediaStarts = [...before.matchAll(/@media[^{]*\{/g)];
  let depth = 0;
  let guarded = false;
  const guardDepths = [];

  for (const match of mediaStarts) {
    // Count unmatched closing braces between this @media and the next one to
    // know whether we've already exited it by the time we reach `index`.
    const isHoverGuard = /\(hover:\s*hover\)/.test(match[0]);
    const afterMatch = before.slice(match.index + match[0].length);
    let localDepth = 1;
    for (const char of afterMatch) {
      if (char === "{") localDepth += 1;
      else if (char === "}") localDepth -= 1;
      if (localDepth === 0) break;
    }
    if (localDepth > 0) {
      // Still open at `index`.
      if (isHoverGuard) guarded = true;
    }
  }

  void depth;
  void guardDepths;
  return guarded;
}

async function checkStyles(files) {
  const violations = [];
  for (const file of files) {
    const content = await fs.readFile(file, "utf8");
    for (const match of content.matchAll(/:hover\b/g)) {
      if (!isInsideHoverMediaGuard(content, match.index)) {
        const line = content.slice(0, match.index).split("\n").length;
        violations.push({ file: path.relative(root, file), line, kind: "unguarded-css-hover" });
      }
    }
  }
  return violations;
}

/** Every `matchMedia("...")` call site, with its full query string and line. */
function findMatchMediaCalls(content) {
  const calls = [];
  const pattern = /matchMedia\(\s*(["'`])((?:(?!\1).)*)\1/g;
  for (const match of content.matchAll(pattern)) {
    calls.push({ query: match[2], index: match.index });
  }
  return calls;
}

async function checkCapabilitySources(files) {
  const violations = [];
  const capabilityFeature = /(?:hover:\s*hover|pointer:\s*fine|pointer:\s*coarse|any-hover|any-pointer)/;
  const widthFeature = /(?:max-width|min-width)/;

  for (const file of files) {
    const relative = path.relative(root, file);
    if (CAPABILITY_SOURCE_FILES.has(relative)) continue;
    const content = await fs.readFile(file, "utf8");

    for (const call of findMatchMediaCalls(content)) {
      const line = content.slice(0, call.index).split("\n").length;
      const hasCapability = capabilityFeature.test(call.query);
      const hasWidth = widthFeature.test(call.query);

      if (hasCapability && hasWidth) {
        // The exact bug this check exists for: `(max-width: 767px), (pointer: coarse)`
        // treats a narrow desktop window as touch. Input capability and available
        // screen space are two different questions; a single query answering both
        // gives the wrong answer to at least one of them.
        violations.push({ file: relative, line, kind: "conflated-capability-and-layout", detail: call.query });
      } else if (hasCapability) {
        violations.push({ file: relative, line, kind: "duplicate-capability-check", detail: call.query });
      }
    }
  }
  return violations;
}

async function main() {
  const files = (await Promise.all(SCAN_DIRS.map((dir) => walk(dir)))).flat();
  const styleFiles = files.filter((file) => STYLE_EXT.has(path.extname(file)));
  const codeFiles = files.filter((file) => CODE_EXT.has(path.extname(file)) && !/\.test\.tsx?$/.test(file));

  const [styleViolations, capabilityViolations] = await Promise.all([
    checkStyles(styleFiles),
    checkCapabilitySources(codeFiles),
  ]);

  const violations = [...styleViolations, ...capabilityViolations];

  if (violations.length === 0) {
    console.log(`[hover-coverage] PASS: ${styleFiles.length} CSS files, ${codeFiles.length} code files scanned, no violations`);
    return;
  }

  console.error(`[hover-coverage] FAIL: ${violations.length} violation(s)\n`);
  for (const violation of violations) {
    if (violation.kind === "unguarded-css-hover") {
      console.error(`  ${violation.file}:${violation.line} — raw ":hover" not wrapped in @media (hover: hover)`);
    } else if (violation.kind === "conflated-capability-and-layout") {
      console.error(`  ${violation.file}:${violation.line} — matchMedia("${violation.detail}") mixes a width feature with a hover/pointer feature: a narrow window with a mouse and a wide touchscreen resolve to the same value. Split into a width query (layout) and usePointerCapability() (input) instead.`);
    } else {
      console.error(`  ${violation.file}:${violation.line} — constructs matchMedia("${violation.detail}") directly; use usePointerCapability() instead`);
    }
  }
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
