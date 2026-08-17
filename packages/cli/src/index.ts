#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import manifest from "./manifest.json" with { type: "json" };

type ManifestEntry = {
  name: string;
  package: string;
  symbol: string;
  entryFile: string;
  files: Record<string, string>;
};

const entries = manifest as Record<string, ManifestEntry>;

const EXTERNAL_DEP_PATTERNS: Array<[RegExp, string]> = [
  [/@pinky-ui\/primitives/, "@pinky-ui/primitives"],
  [/["']motion(\/react)?["']/, "motion"],
];

function usage() {
  console.log(`pinky-ui — add Pinky UI component source into your project

Usage:
  pinky-ui add <slug> [<slug> ...]   Copy one or more components into ./pinky-ui/<slug>/
  pinky-ui list                      List every available component slug
  pinky-ui help                      Show this message

Examples:
  npx pinky-ui add jelly-card
  npx pinky-ui add jelly-card magnetic-button liquid-toggle
`);
}

function targetRoot() {
  const cwd = process.cwd();
  const base = existsSync(path.join(cwd, "src")) ? path.join(cwd, "src", "components") : path.join(cwd, "components");
  return path.join(base, "pinky-ui");
}

function addComponent(slug: string) {
  const entry = entries[slug];
  if (!entry) {
    console.error(`✗ Unknown component "${slug}". Run "pinky-ui list" to see available slugs.`);
    return false;
  }

  const destDir = path.join(targetRoot(), slug);
  const deps = new Set<string>();

  for (const [relativePath, content] of Object.entries(entry.files)) {
    const destPath = path.join(destDir, relativePath);
    mkdirSync(path.dirname(destPath), { recursive: true });
    writeFileSync(destPath, content, "utf8");

    for (const [pattern, dep] of EXTERNAL_DEP_PATTERNS) {
      if (pattern.test(content)) deps.add(dep);
    }
  }

  const relDest = path.relative(process.cwd(), destDir);
  console.log(`✓ Added ${entry.symbol} → ${relDest}/`);
  return deps;
}

function commandAdd(slugs: string[]) {
  if (slugs.length === 0) {
    console.error("Specify at least one component slug. Example: pinky-ui add jelly-card");
    process.exitCode = 1;
    return;
  }

  const allDeps = new Set<string>(["react"]);
  let failed = false;

  for (const slug of slugs) {
    const deps = addComponent(slug);
    if (!deps) {
      failed = true;
      continue;
    }
    for (const dep of deps) allDeps.add(dep);
  }

  if (failed) process.exitCode = 1;

  const depList = [...allDeps].join(" ");
  console.log(`\nInstall peer dependencies if you don't have them yet:\n  npm install ${depList}`);
}

function commandList() {
  const bySlug = Object.entries(entries).sort(([a], [b]) => a.localeCompare(b));
  for (const [slug, entry] of bySlug) {
    console.log(`  ${slug.padEnd(32)} ${entry.symbol} (${entry.package})`);
  }
  console.log(`\n${bySlug.length} components available.`);
}

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case "add":
    commandAdd(args);
    break;
  case "list":
    commandList();
    break;
  case "help":
  case "--help":
  case "-h":
  case undefined:
    usage();
    break;
  default:
    console.error(`Unknown command "${command}".\n`);
    usage();
    process.exitCode = 1;
}
