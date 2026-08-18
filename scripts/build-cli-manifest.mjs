import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryModule = await import(path.join(root, "packages/registry/dist/index.js"));

const ENTRY_ARRAYS = [
  "components",
  "layouts",
  "primitives",
  "allProductSystems",
  "allWorkflowSystems",
  "cursorEffects",
  "motionEffects",
  "textEffects",
  "scrollEffects",
  "heroExperiences",
  "navigationExperiences",
  "transitionExperiences",
  "backgroundExperiences",
  "spatialExperiences",
];

const IMPORT_RE = /import\s*\{\s*([^}]+?)\s*\}\s*from\s*["']@pinky-ui\/([\w-]+)["']/;
const PACKAGE_ONLY_RE = /^@pinky-ui\/([\w-]+)$/;
const LOCAL_IMPORT_RE = /from\s+["'](\.[^"']+)["']/g;

function pascalCase(slug) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function collectEntries() {
  const bySlug = new Map();
  for (const key of ENTRY_ARRAYS) {
    const list = registryModule[key];
    if (!Array.isArray(list)) continue;
    for (const entry of list) {
      if (!entry?.slug || !entry?.importPath) continue;
      if (bySlug.has(entry.slug)) continue;

      const destructured = entry.importPath.match(IMPORT_RE);
      if (destructured) {
        const [, symbolsRaw, pkg] = destructured;
        const symbol = symbolsRaw.split(",")[0].trim();
        bySlug.set(entry.slug, { slug: entry.slug, name: entry.name, pkg, symbol });
        continue;
      }

      const packageOnly = entry.importPath.match(PACKAGE_ONLY_RE);
      if (packageOnly) {
        bySlug.set(entry.slug, {
          slug: entry.slug,
          name: entry.name,
          pkg: packageOnly[1],
          symbol: pascalCase(entry.slug),
        });
      }
    }
  }
  return [...bySlug.values()];
}

async function walk(dir, out = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith("._")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (/\.(ts|tsx)$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

const DEFINITION_RE = (symbol) =>
  new RegExp(
    `(?:export\\s+function\\s+${symbol}\\b)|(?:export\\s+const\\s+${symbol}\\b)|(?:export\\s+class\\s+${symbol}\\b)|(?:function\\s+${symbol}\\b)`,
  );

async function findDefiningFile(pkg, symbol, fileCache) {
  const srcDir = path.join(root, "packages", pkg, "src");
  if (!fileCache.has(pkg)) fileCache.set(pkg, await walk(srcDir));
  const files = fileCache.get(pkg);
  const re = DEFINITION_RE(symbol);
  for (const file of files) {
    const content = await fs.readFile(file, "utf8");
    if (re.test(content)) return file;
  }
  return null;
}

async function resolveLocalDeps(entryFile, pkg, seen) {
  const srcDir = path.join(root, "packages", pkg, "src");
  const queue = [entryFile];
  const files = new Map();

  while (queue.length) {
    const file = queue.pop();
    if (seen.has(file)) continue;
    seen.add(file);
    const content = await fs.readFile(file, "utf8");
    files.set(path.relative(srcDir, file), content);

    for (const match of content.matchAll(LOCAL_IMPORT_RE)) {
      const spec = match[1];
      const baseDir = path.dirname(file);
      const candidates = [
        path.join(baseDir, `${spec}.ts`),
        path.join(baseDir, `${spec}.tsx`),
        path.join(baseDir, spec, "index.ts"),
        path.join(baseDir, spec, "index.tsx"),
      ];
      for (const candidate of candidates) {
        try {
          await fs.access(candidate);
          queue.push(candidate);
          break;
        } catch {
          // try next candidate
        }
      }
    }
  }
  return files;
}

const entries = collectEntries();
const fileCache = new Map();
const manifest = {};
const misses = [];

for (const entry of entries) {
  const definingFile = await findDefiningFile(entry.pkg, entry.symbol, fileCache);
  if (!definingFile) {
    misses.push(entry);
    continue;
  }
  const files = await resolveLocalDeps(definingFile, entry.pkg, new Set());
  manifest[entry.slug] = {
    name: entry.name,
    package: `@pinky-ui/${entry.pkg}`,
    symbol: entry.symbol,
    entryFile: path.relative(path.join(root, "packages", entry.pkg, "src"), definingFile),
    files: Object.fromEntries(files),
  };
}

const outPath = path.join(root, "packages/cli/src/manifest.json");
await fs.mkdir(path.dirname(outPath), { recursive: true });
await fs.writeFile(outPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`[cli-manifest] wrote ${Object.keys(manifest).length} entries to packages/cli/src/manifest.json`);
if (misses.length) {
  console.log(`[cli-manifest] could not locate source for ${misses.length} entries:`);
  for (const miss of misses.slice(0, 20)) console.log(`  - ${miss.slug} (${miss.symbol} in @pinky-ui/${miss.pkg})`);
  if (misses.length > 20) console.log(`  ...and ${misses.length - 20} more`);
}
