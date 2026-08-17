import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Layout-triggering CSS properties: animating any of these forces the
 * browser to recompute layout (and usually paint) every frame, instead of
 * running on the compositor thread the way `transform`/`opacity` do.
 */
const LAYOUT_PROPERTIES = [
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  "margin",
  "marginTop",
  "marginLeft",
  "marginRight",
  "marginBottom",
  "padding",
  "paddingTop",
  "paddingLeft",
  "paddingRight",
  "paddingBottom",
  "fontSize",
];

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

function lineOf(content, index) {
  return content.slice(0, index).split("\n").length;
}

/**
 * Finds Motion `animate={{ ... }}` / `initial={{ ... }}` / `whileHover={{ ... }}`
 * object literals and flags any layout property used as an *animated* key —
 * `width: [10, 40]` or `width: 40` inside one of these props, not a static
 * `style={{ width: 40 }}` that never changes.
 */
function scanMotionProps(content, file, findings) {
  const propPattern = /\b(animate|initial|exit|whileHover|whileTap|whileFocus|whileInView)\s*=\s*\{\{/g;
  for (const match of content.matchAll(propPattern)) {
    const start = match.index + match[0].length - 1; // at the inner `{`
    let depth = 1;
    let i = start + 1;
    while (i < content.length && depth > 0) {
      if (content[i] === "{") depth += 1;
      else if (content[i] === "}") depth -= 1;
      i += 1;
    }
    const body = content.slice(start, i);
    for (const property of LAYOUT_PROPERTIES) {
      const keyPattern = new RegExp(`(?:^|[\\s,{])${property}\\s*:`);
      if (keyPattern.test(body)) {
        findings.push({ file, line: lineOf(content, match.index), kind: "motion-prop", detail: `${match[1]} animates "${property}"` });
      }
    }
  }
}

/** Raw CSS/inline `transition: <property> ...` naming a layout property. */
function scanCssTransitions(content, file, findings, isCss) {
  const pattern = isCss ? /transition(?:-property)?\s*:\s*([^;]+);/g : /transition(?:Property)?\s*:\s*["'`]([^"'`]+)["'`]/g;
  for (const match of content.matchAll(pattern)) {
    const declared = match[1].toLowerCase();
    for (const property of LAYOUT_PROPERTIES) {
      const cssName = property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      if (declared.includes(cssName)) {
        findings.push({ file, line: lineOf(content, match.index), kind: isCss ? "css-transition" : "inline-transition", detail: `transitions "${cssName}"` });
      }
    }
  }
}

async function main() {
  const files = (await Promise.all(SCAN_DIRS.map((dir) => walk(dir)))).flat();
  const findings = [];

  for (const file of files) {
    const ext = path.extname(file);
    if (!CODE_EXT.has(ext) && !STYLE_EXT.has(ext)) continue;
    if (/\.test\.tsx?$/.test(file)) continue;
    const content = await fs.readFile(file, "utf8");
    const relative = path.relative(root, file);

    if (STYLE_EXT.has(ext)) {
      scanCssTransitions(content, relative, findings, true);
    } else {
      scanMotionProps(content, relative, findings);
      scanCssTransitions(content, relative, findings, false);
    }
  }

  console.log(`[layout-animations] scanned ${files.length} files, ${findings.length} layout-triggering animation site(s)\n`);
  for (const finding of findings) {
    console.log(`  ${finding.file}:${finding.line} — ${finding.kind} — ${finding.detail}`);
  }
  if (findings.length === 0) console.log("  none found");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
