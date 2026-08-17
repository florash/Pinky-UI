import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCAN_DIRS = ["apps/website/src", "packages"].map((dir) => path.join(root, dir));
const SKIP_SEGMENTS = new Set(["node_modules", "dist", ".next", "out", "__snapshots__"]);

/**
 * "Interactive content" by the HTML spec's own name for the constraint this
 * checks: an <a> (or next/link's <Link>, which renders one) or a <button>
 * cannot contain another element from this set as a descendant. React lets
 * you build the tree that way with no complaint at author time — the
 * failure only shows up as a hydration mismatch in the browser, because the
 * server-rendered HTML gets silently restructured by the parser before
 * React ever sees it. This is exactly the bug the Pill Nav gallery preview
 * shipped with: caught by eye on the dev overlay, not by any check here.
 */
const INTERACTIVE_TAGS = new Set(["a", "Link", "NextLink", "button"]);

/** Preview components are the actual risk surface: real product components
 * embedded live inside a documentation card, which may render their own
 * real <a>/<button> without the card author necessarily reading their
 * source. Matched by name pattern rather than a hardcoded list so a new
 * `*Preview` component is covered automatically. */
const PREVIEW_NAME_PATTERN = /Preview$/;

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
    else if (entry.name.endsWith(".tsx")) out.push(full);
  }
  return out;
}

function jsxTagName(node) {
  const tagNode = ts.isJsxElement(node) ? node.openingElement.tagName : node.tagName;
  return tagNode.getText();
}

function lineOf(sourceFile, node) {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
}

/**
 * Walks one file's AST twice in one pass: tracks a stack of currently-open
 * interactive elements to catch same-file nesting directly (a definite
 * bug), and separately notes every <Link>/<a> that has a *Preview element
 * anywhere among its descendants (a cross-file risk this static pass can't
 * fully resolve — the preview's own file might render a real anchor/button
 * without it being visible here — so this is reported as a thing to verify
 * by hand or let the crawler's hydration check catch at runtime, not a
 * hard failure).
 */
function checkFile(sourceFile) {
  const nestedInteractive = [];
  const linkWrapsPreview = [];
  const interactiveStack = [];

  function visit(node) {
    const isJsx = ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node);
    let tag = null;
    let pushed = false;

    if (isJsx) {
      tag = jsxTagName(node);
      if (INTERACTIVE_TAGS.has(tag)) {
        if (interactiveStack.length > 0) {
          nestedInteractive.push({
            line: lineOf(sourceFile, node),
            outer: interactiveStack[interactiveStack.length - 1],
            inner: tag,
          });
        }
        interactiveStack.push(tag);
        pushed = true;
      }
      if ((tag === "Link" || tag === "NextLink" || tag === "a") && interactiveStack.length === 1) {
        // Only check descendants for the outermost Link in a chain — an
        // inner one is already reported above as nested-interactive.
        let foundPreview = null;
        const scanForPreview = (inner) => {
          if (foundPreview) return;
          if ((ts.isJsxElement(inner) || ts.isJsxSelfClosingElement(inner)) && inner !== node) {
            const innerTag = jsxTagName(inner);
            if (PREVIEW_NAME_PATTERN.test(innerTag)) {
              foundPreview = innerTag;
              return;
            }
          }
          ts.forEachChild(inner, scanForPreview);
        };
        ts.forEachChild(node, scanForPreview);
        if (foundPreview) linkWrapsPreview.push({ line: lineOf(sourceFile, node), preview: foundPreview });
      }
    }

    ts.forEachChild(node, visit);
    if (pushed) interactiveStack.pop();
  }

  visit(sourceFile);
  return { nestedInteractive, linkWrapsPreview };
}

async function main() {
  const files = (await Promise.all(SCAN_DIRS.map((dir) => walk(dir)))).flat();
  let errorCount = 0;
  let warningCount = 0;

  for (const file of files) {
    const text = await fs.readFile(file, "utf8");
    const sourceFile = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const { nestedInteractive, linkWrapsPreview } = checkFile(sourceFile);
    const relative = path.relative(root, file);

    for (const hit of nestedInteractive) {
      errorCount += 1;
      console.error(`[nested-anchors] ERROR ${relative}:${hit.line} — <${hit.inner}> nested inside <${hit.outer}> (invalid HTML, will fail hydration)`);
    }
    for (const hit of linkWrapsPreview) {
      warningCount += 1;
      console.warn(`[nested-anchors] WARN  ${relative}:${hit.line} — <Link>/<a> wraps <${hit.preview}>; if that preview ever renders a real <a>/<Link>/<button>, this nests an interactive element inside the card link. Verify by hand or via the crawler's hydrationErrors check.`);
    }
  }

  console.log(`[nested-anchors] ${files.length} files scanned — ${errorCount} error(s), ${warningCount} warning(s) to review.`);
  if (errorCount > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
