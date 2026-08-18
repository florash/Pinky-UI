import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCAN_DIR = path.join(root, "apps/website/src");
const SKIP_SEGMENTS = new Set(["node_modules", "dist", ".next", "out", "__snapshots__"]);

/**
 * Internal navigation must go through next/link's <Link> (or next/
 * navigation's router.push/replace) — both automatically get Next's
 * configured `basePath` prefixed on. A raw <a href="/..."> or
 * `window.location.href = "/..."` doesn't, so it 404s under any base path
 * (as several already were, silently, under the current /Pinky-UI
 * deployment — found by this exact scan, not by anyone clicking them).
 *
 * A same-page hash (`href="#section"`, no leading slash) is fine as a
 * plain <a> — it resolves against the current, already-correctly-prefixed
 * URL and doesn't need Next's router at all.
 */
function isInternalRootPath(value) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//");
}

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
    else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) out.push(full);
  }
  return out;
}

function lineOf(sourceFile, node) {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
}

function stringLiteralValue(node) {
  if (!node) return null;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return null;
}

function checkFile(sourceFile) {
  const hits = [];

  function jsxAttrValue(attrs, name) {
    for (const attr of attrs) {
      if (!ts.isJsxAttribute(attr) || attr.name.getText() !== name) continue;
      if (!attr.initializer) return true; // bare boolean attribute
      if (ts.isJsxExpression(attr.initializer)) return stringLiteralValue(attr.initializer.expression);
      return stringLiteralValue(attr.initializer);
    }
    return undefined;
  }

  function visit(node) {
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const opening = ts.isJsxElement(node) ? node.openingElement : node;
      const tag = opening.tagName.getText();
      const attrs = opening.attributes.properties;
      const href = jsxAttrValue(attrs, "href");
      const asValue = jsxAttrValue(attrs, "as");

      if (tag === "a" && isInternalRootPath(href)) {
        hits.push({ line: lineOf(sourceFile, node), message: `<a href="${href}"> — use next/link's <Link> instead` });
      }
      if (asValue === "a" && isInternalRootPath(href)) {
        hits.push({ line: lineOf(sourceFile, node), message: `<${tag} as="a" href="${href}"> — pass as={Link} (from next/link) instead of as="a"` });
      }
    }

    // window.location.href = "/..." — also window.location.assign(...) / .replace(...)
    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
      const target = node.left.getText();
      if (target === "window.location.href") {
        const value = stringLiteralValue(node.right);
        if (isInternalRootPath(value)) {
          hits.push({ line: lineOf(sourceFile, node), message: `window.location.href = "${value}" — use useRouter().push(...) from next/navigation instead` });
        }
      }
    }
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
      const callee = node.expression.getText();
      if (callee === "window.location.assign" || callee === "window.location.replace") {
        const value = stringLiteralValue(node.arguments[0]);
        if (isInternalRootPath(value)) {
          hits.push({ line: lineOf(sourceFile, node), message: `${callee}("${value}") — use useRouter().push(...)/.replace(...) from next/navigation instead` });
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return hits;
}

async function main() {
  const files = await walk(SCAN_DIR);
  let errorCount = 0;

  for (const file of files) {
    const text = await fs.readFile(file, "utf8");
    const sourceFile = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const hits = checkFile(sourceFile);
    const relative = path.relative(root, file);
    for (const hit of hits) {
      errorCount += 1;
      console.error(`[internal-links] ERROR ${relative}:${hit.line} — ${hit.message}`);
    }
  }

  console.log(`[internal-links] ${files.length} files scanned — ${errorCount} error(s).`);
  if (errorCount > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
