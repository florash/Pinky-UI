import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DRY_RUN = process.argv.includes("--dry-run");

/**
 * One-shot pinkyui.com migration.
 *
 * Deliberately small: apps/website/src/lib/site.ts already reads the site
 * origin and base path from NEXT_PUBLIC_SITE_URL / NEXT_PUBLIC_BASE_PATH at
 * build time (see normalizeSiteUrl/normalizeBasePath there), and every
 * absolute-URL call site (metadataBase, sitemap.ts, robots.ts, canonical,
 * og:url) already funnels through SITE.url / absoluteSiteUrl() instead of
 * hardcoding an origin. Internal navigation uses next/link's <Link>, which
 * Next.js prefixes with basePath automatically. None of that needs editing
 * — only the two places that currently *supply* the old values, plus the
 * one documentation link, need to change.
 *
 * Explicitly NOT touched by this script (see docs/domain-migration-checklist.md):
 * - next.config.mjs / apps/website/src/lib/site.ts — already env-driven, no
 *   hardcoded values to replace
 * - sitemap.xml — generated at build time from SITE.url; a rebuild after
 *   the env change regenerates it correctly, nothing to hand-edit
 * - package.json "repository"/"bugs" fields and every git-clone snippet in
 *   the docs pages — these point at the GitHub repo (github.com/florash/
 *   Pinky-UI), which does not rename when a custom domain is added
 * - the handful of raw <a href="/..."> internal links found during the
 *   audit (featured-interaction-wall.tsx, effects-showcase.tsx,
 *   workflow-showcase.tsx) that bypass next/link and so never got the
 *   /Pinky-UI prefix even today — a pre-existing bug, not a migration step;
 *   flagged in the checklist instead of silently fixed here
 */
const EDITS = [
  {
    file: ".github/workflows/pages.yml",
    changes: [
      {
        description: "site URL -> pinkyui.com",
        from: "      NEXT_PUBLIC_SITE_URL: https://florash.github.io\n",
        to: "      NEXT_PUBLIC_SITE_URL: https://pinkyui.com\n",
      },
      {
        description: "remove NEXT_PUBLIC_BASE_PATH entirely (custom domain serves from /)",
        from: "      NEXT_PUBLIC_BASE_PATH: /Pinky-UI\n",
        to: "",
      },
    ],
  },
  {
    file: "scripts/verify-release.mjs",
    changes: [
      {
        description: "static-export verification fallback site URL",
        from: '"https://florash.github.io"',
        to: '"https://pinkyui.com"',
      },
      {
        description: "static-export verification fallback base path (empty for a custom domain)",
        from: '"/Pinky-UI"',
        to: '""',
      },
    ],
  },
  {
    file: "README.md",
    changes: [
      {
        description: "live-demo badge",
        from: "[![Live Demo](https://img.shields.io/badge/live%20demo-florash.github.io%2FPinky--UI-f4c7d7?style=flat-square)](https://florash.github.io/Pinky-UI)",
        to: "[![Live Demo](https://img.shields.io/badge/live%20demo-pinkyui.com-f4c7d7?style=flat-square)](https://pinkyui.com)",
      },
    ],
  },
];

async function applyFile({ file, changes }) {
  const fullPath = path.join(root, file);
  const original = await fs.readFile(fullPath, "utf8");
  let next = original;
  const applied = [];
  const missing = [];

  for (const change of changes) {
    if (!next.includes(change.from)) {
      missing.push(change);
      continue;
    }
    next = next.replace(change.from, change.to);
    applied.push(change);
  }

  return { file, fullPath, original, next, applied, missing, changed: next !== original };
}

async function main() {
  console.log(DRY_RUN ? "[migrate-domain] DRY RUN — no files will be written\n" : "[migrate-domain] applying changes\n");

  const results = await Promise.all(EDITS.map(applyFile));
  let hadMissing = false;

  for (const result of results) {
    console.log(`${result.file}`);
    for (const change of result.applied) console.log(`  ✓ ${change.description}`);
    for (const change of result.missing) {
      hadMissing = true;
      console.log(`  ✗ NOT FOUND — "${change.description}" (expected text not present; file may have already been migrated, or changed since this script was written)`);
    }
    if (!result.changed) console.log("  (no changes)");
    console.log("");
  }

  if (!DRY_RUN) {
    for (const result of results) {
      if (result.changed) await fs.writeFile(result.fullPath, result.next);
    }
    console.log("[migrate-domain] written. Next steps:");
    console.log("  1. npm run build   (plain build — confirms nothing else broke)");
    console.log("  2. NEXT_PUBLIC_STATIC_EXPORT=true npm run build   (matches the real deploy; verify out/CNAME)");
    console.log("  3. Walk docs/domain-migration-checklist.md before pushing");
  } else {
    console.log("[migrate-domain] dry run complete. Re-run without --dry-run to write these changes.");
  }

  if (hadMissing) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
