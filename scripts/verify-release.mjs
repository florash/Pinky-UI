import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile as execFileCallback, spawn } from "node:child_process";
import { promisify } from "node:util";

const execFile = promisify(execFileCallback);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const EXPECTED = {
  publicSkillRoutes: 284,
  canonicalRecipes: 283,
  legacyAliases: 1,
  minimumProductPages: 567,
  releaseVersion: "0.1.0",
};
const RELEASE_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://pinky-ui.example.test";
const RELEASE_ENV = {
  ...process.env,
  NEXT_PUBLIC_SITE_URL: RELEASE_SITE_URL,
  npm_config_cache: path.join(os.tmpdir(), "pinky-ui-release-npm-cache"),
};

const PUBLIC_PACKAGE_LAYERS = [
  ["@pinky/primitives", "@pinky/registry"],
  ["@pinky/components", "@pinky/layouts", "@pinky/effects", "@pinky/systems"],
  ["@pinky/experiences"],
];
const PUBLIC_PACKAGES = PUBLIC_PACKAGE_LAYERS.flatMap((layer) => layer.map((packageName) => packageName.replace("@pinky/", "")));
const PUBLIC_PACKAGE_NAMES = new Set(PUBLIC_PACKAGES.map((name) => `@pinky/${name}`));

function packageDirectory(name) {
  return path.join(root, "packages", name);
}

function fail(message) {
  throw new Error(`[release] ${message}`);
}

function stripAnsi(value) {
  return value.replace(/\u001b\[[0-?]*[ -\/]*[@-~]/g, "");
}

function run(command, args, { cwd = root, env = process.env } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env,
      stdio: "inherit",
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`[release] ${command} ${args.join(" ")} failed (${code ?? signal})`));
    });
  });
}

async function capture(command, args, { cwd = root, env = process.env } = {}) {
  try {
    return await execFile(command, args, {
      cwd,
      env,
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch (error) {
    const output = [error.stdout, error.stderr].filter(Boolean).join("\n");
    if (output) process.stderr.write(output);
    throw new Error(`[release] ${command} ${args.join(" ")} failed`);
  }
}

async function runCaptured(command, args, { cwd = root, env = process.env } = {}) {
  const result = await capture(command, args, { cwd, env });
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  return result.stdout;
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, "utf8"));
}

async function walk(directory) {
  const result = [];
  const entries = await fs.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith("._")) continue;
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...(await walk(entryPath)));
    else if (entry.isFile()) result.push(entryPath);
  }

  return result;
}

async function assertTrackedHygiene() {
  const { stdout } = await capture("git", ["ls-files", "-z"]);
  const tracked = stdout.split("\0").filter(Boolean);
  const forbidden = tracked.filter((file) => {
    const basename = path.basename(file);
    if (basename.startsWith("._") || basename === ".DS_Store") return true;
    if (/\.(?:log|tgz|tar|gz|zip)$/i.test(basename)) return true;
    return /^\.env(?:\.|$)/i.test(basename) && basename !== ".env.example";
  });

  if (forbidden.length > 0) fail(`tracked release junk found: ${forbidden.join(", ")}`);
  console.log("[release] tracked hygiene: PASS");
}

async function assertSkillInvariants() {
  const skillsRoot = path.join(root, "packages", "skills");
  const skillsSource = await fs.readFile(path.join(root, "apps/website/src/lib/skills.ts"), "utf8");
  const kindsBlock = skillsSource.match(/export const SKILL_KINDS = \[(.*?)\] as const/s)?.[1];
  if (!kindsBlock) fail("could not read SKILL_KINDS source manifest");
  const kinds = new Set([...kindsBlock.matchAll(/"([^"]+)"/g)].map((match) => match[1]));

  const markdownFiles = (await walk(skillsRoot)).filter(
    (file) => path.extname(file) === ".md" && path.basename(file) !== "README.md",
  );
  const canonicalRoutes = new Set();

  for (const file of markdownFiles) {
    const relative = path.relative(skillsRoot, file).split(path.sep).join("/");
    const [kind, filename] = relative.split("/");
    const slug = filename?.replace(/\.md$/, "");
    if (!kind || !slug || !kinds.has(kind)) fail(`recipe is not in SKILL_KINDS: ${relative}`);
    const route = `/skills/${kind}/${slug}`;
    if (canonicalRoutes.has(route)) fail(`duplicate canonical Skill route: ${route}`);
    canonicalRoutes.add(route);
  }

  const aliases = [...skillsSource.matchAll(/from:\s*"([^"]+)"\s*,\s*to:\s*"([^"]+)"/g)].map(
    (match) => ({ from: match[1], to: match[2] }),
  );
  for (const alias of aliases) {
    if (canonicalRoutes.has(alias.from)) fail(`alias shadows a canonical route: ${alias.from}`);
    if (!canonicalRoutes.has(alias.to)) fail(`alias target is not a canonical route: ${alias.to}`);
  }

  if (canonicalRoutes.size !== EXPECTED.canonicalRecipes) {
    fail(`canonical recipe count changed: expected ${EXPECTED.canonicalRecipes}, found ${canonicalRoutes.size}`);
  }
  if (aliases.length !== EXPECTED.legacyAliases) {
    fail(`legacy alias count changed: expected ${EXPECTED.legacyAliases}, found ${aliases.length}`);
  }
  if (canonicalRoutes.size + aliases.length !== EXPECTED.publicSkillRoutes) {
    fail(`public Skill route count changed: expected ${EXPECTED.publicSkillRoutes}, found ${canonicalRoutes.size + aliases.length}`);
  }

  console.log(
    `[release] Skill invariants: ${canonicalRoutes.size} canonical recipes + ${aliases.length} legacy alias = ${canonicalRoutes.size + aliases.length} public routes`,
  );
}

async function packageInfos() {
  return Promise.all(
    PUBLIC_PACKAGES.map(async (name) => ({
      name,
      packageName: `@pinky/${name}`,
      directory: packageDirectory(name),
      source: path.join(packageDirectory(name), "src"),
      dist: path.join(packageDirectory(name), "dist"),
      packageJson: await readJson(path.join(packageDirectory(name), "package.json")),
    })),
  );
}

function publicPackageBase(specifier) {
  const parts = specifier.split("/");
  return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : specifier;
}

async function assertPackageMetadata(infos) {
  const versions = new Set();

  for (const info of infos) {
    const manifest = info.packageJson;
    if (manifest.name !== info.packageName) fail(`${info.packageName} manifest name is ${manifest.name ?? "missing"}`);
    if (manifest.private === true) fail(`${info.packageName} is still private`);
    if (!manifest.version) fail(`${info.packageName} has no version`);
    versions.add(manifest.version);
    if (manifest.version !== EXPECTED.releaseVersion) {
      fail(`${info.packageName} must remain on release version ${EXPECTED.releaseVersion}, found ${manifest.version}`);
    }
    if (manifest.license !== "MIT") fail(`${info.packageName} must declare MIT license`);
    if (!manifest.description?.trim()) fail(`${info.packageName} has no publication description`);
    if (!manifest.repository?.url) fail(`${info.packageName} has no repository metadata`);
    if (/localhost|example\.test|workspace:|file:/i.test(manifest.repository.url)) {
      fail(`${info.packageName} has placeholder repository metadata`);
    }
    if (!Array.isArray(manifest.keywords) || manifest.keywords.length === 0) {
      fail(`${info.packageName} must declare a concise keyword list`);
    }
    if (manifest.publishConfig?.access !== "public") {
      fail(`${info.packageName} must declare publishConfig.access=public for its scoped release`);
    }
    if (!Array.isArray(manifest.files) || manifest.files.length !== 1 || manifest.files[0] !== "dist") {
      fail(`${info.packageName} must restrict files to dist`);
    }
    try {
      await fs.access(path.join(info.directory, "README.md"));
    } catch {
      fail(`${info.packageName} is missing its package README`);
    }

    for (const field of ["main", "module", "types"]) {
      if (typeof manifest[field] !== "string") fail(`${info.packageName} has no ${field} entry`);
      try {
        await fs.access(path.join(info.directory, manifest[field]));
      } catch {
        fail(`${info.packageName} ${field} target is missing: ${manifest[field]}`);
      }
    }

    if (!manifest.exports || typeof manifest.exports !== "object" || !manifest.exports["."]) {
      fail(`${info.packageName} must expose a root export map`);
    }
    const exportText = JSON.stringify(manifest.exports);
    if (exportText.includes("*") || exportText.includes("internal")) {
      fail(`${info.packageName} exposes an unsupported wildcard/internal export`);
    }
    const rootExport = manifest.exports["."];
    for (const condition of ["types", "import", "default"]) {
      if (typeof rootExport?.[condition] !== "string") fail(`${info.packageName} is missing exports[.].${condition}`);
      try {
        await fs.access(path.join(info.directory, rootExport[condition]));
      } catch {
        fail(`${info.packageName} export target is missing: ${rootExport[condition]}`);
      }
    }

    const sourceFiles = (await walk(info.source)).filter((file) => !/\.test\./.test(file));
    const importedPackages = new Set();
    for (const file of sourceFiles) {
      if (!/\.(?:ts|tsx)$/.test(file)) continue;
      const source = await fs.readFile(file, "utf8");
      // Only inspect actual top-level import declarations. Registry metadata contains
      // generated importPath strings such as `from "@pinky/components"` that are
      // documentation, not runtime package dependencies.
      const importSpecifiers = [
        ...source.matchAll(/^\s*(?:import|export)\s+(?:[^;\n]*?\s+from\s+)?["'](@pinky\/[^"']+)["']/gm),
        ...source.matchAll(/^\s*import\s*\(\s*["'](@pinky\/[^"']+)["']/gm),
      ];
      for (const match of importSpecifiers) {
        const specifier = match[1];
        if (specifier.includes("/internal")) fail(`${info.packageName} reaches a private import: ${specifier}`);
        const base = publicPackageBase(specifier);
        if (PUBLIC_PACKAGE_NAMES.has(base) && base !== info.packageName) importedPackages.add(base);
      }
    }

    for (const dependency of importedPackages) {
      if (!manifest.dependencies?.[dependency]) {
        fail(`${info.packageName} imports ${dependency} without declaring it in dependencies`);
      }
      if (manifest.dependencies[dependency] !== EXPECTED.releaseVersion) {
        fail(`${info.packageName} must use ${EXPECTED.releaseVersion} for ${dependency}, found ${manifest.dependencies[dependency]}`);
      }
    }
    for (const dependency of Object.keys(manifest.dependencies ?? {})) {
      if (PUBLIC_PACKAGE_NAMES.has(dependency) && dependency === info.packageName) {
        fail(`${info.packageName} declares itself as a dependency`);
      }
      if (PUBLIC_PACKAGE_NAMES.has(dependency) && manifest.dependencies[dependency] !== EXPECTED.releaseVersion) {
        fail(`${info.packageName} has a non-coherent internal dependency range for ${dependency}`);
      }
    }

    if (info.name !== "registry") {
      for (const peer of ["react", "motion"]) {
        if (!manifest.peerDependencies?.[peer]) fail(`${info.packageName} must declare ${peer} as a peer dependency`);
      }
    }
  }
  if (versions.size !== 1 || !versions.has(EXPECTED.releaseVersion)) {
    fail(`public packages do not share release version ${EXPECTED.releaseVersion}`);
  }
  console.log(`[release] package publication metadata and import boundaries: PASS (${EXPECTED.releaseVersion})`);
}

function assertPublicationOrder(infos) {
  const byName = new Map(infos.map((info) => [info.packageName, info.packageJson]));
  const layerByPackage = new Map(PUBLIC_PACKAGE_LAYERS.flatMap((layer, index) => layer.map((name) => [name, index])));

  for (const info of infos) {
    const currentLayer = layerByPackage.get(info.packageName);
    for (const dependency of Object.keys(info.packageJson.dependencies ?? {})) {
      if (!PUBLIC_PACKAGE_NAMES.has(dependency)) continue;
      const dependencyLayer = layerByPackage.get(dependency);
      if (dependencyLayer === undefined || dependencyLayer >= currentLayer) {
        fail(`${info.packageName} cannot be published in layer ${currentLayer}: dependency ${dependency} is not available earlier`);
      }
      if (!byName.has(dependency)) fail(`${info.packageName} publication graph is missing ${dependency}`);
    }
  }

  console.log(`[release] publication order: ${PUBLIC_PACKAGE_LAYERS.map((layer) => layer.join(", ")).join(" -> ")}`);
}

async function verifyPublishDryRuns(infos) {
  for (const info of infos) {
    const result = await capture(
      npmCommand,
      ["publish", "--dry-run", "--ignore-scripts", "--access", "public", "--json"],
      { cwd: info.directory, env: RELEASE_ENV },
    );
    process.stdout.write(result.stdout);
    process.stderr.write(result.stderr);
    const jsonStart = result.stdout.search(/[\[{]/);
    if (jsonStart === -1) fail(`${info.packageName} publish dry-run returned no JSON metadata`);
    let payload;
    try {
      const parsed = JSON.parse(result.stdout.slice(jsonStart));
      payload = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch {
      fail(`could not parse ${info.packageName} publish dry-run metadata`);
    }
    if (payload?.id !== `${info.packageName}@${EXPECTED.releaseVersion}`) {
      fail(`${info.packageName} publish dry-run identity mismatch`);
    }
    if (!Array.isArray(payload.files) || payload.files.length === 0) {
      fail(`${info.packageName} publish dry-run returned no files`);
    }
    for (const file of payload.files) {
      const relative = file.path.replace(/^package\//, "");
      if (relative !== "package.json" && relative !== "README.md" && !relative.startsWith("dist/")) {
        fail(`${info.packageName} publish dry-run contains an unexpected file: ${file.path}`);
      }
    }
    console.log(`[release] ${info.packageName} publish dry-run: PASS (${payload.size} bytes, ${payload.files.length} files)`);
  }
  console.log("[release] npm publish dry-runs: PASS");
}

async function packPackages(infos, tempRoot) {
  const result = await capture(
    npmCommand,
    [
      "pack",
      "--json",
      "--ignore-scripts",
      "--pack-destination",
      tempRoot,
      ...infos.map((info) => `./packages/${info.name}`),
    ],
  );
  const jsonStart = result.stdout.indexOf("[");
  if (jsonStart === -1) fail("npm pack did not return JSON metadata");
  let packed;
  try {
    packed = JSON.parse(result.stdout.slice(jsonStart));
  } catch {
    fail("could not parse npm pack metadata");
  }
  if (!Array.isArray(packed) || packed.length !== infos.length) fail("npm pack returned an incomplete package set");

  for (const item of packed) {
    const files = item.files ?? [];
    for (const file of files) {
      const relative = file.path.replace(/^package\//, "");
      if (relative !== "package.json" && relative !== "README.md" && !relative.startsWith("dist/")) {
        fail(`${item.name} tarball contains an unexpected file: ${file.path}`);
      }
      if (/(^|\/)(?:src|tests?|fixtures|snapshots|node_modules)\//.test(file.path) || /(^|\/)\._|\.DS_Store|\.test\./.test(file.path)) {
        fail(`${item.name} tarball contains forbidden development content: ${file.path}`);
      }
    }

    const archive = path.join(tempRoot, item.filename);
    try {
      await fs.access(archive);
    } catch {
      fail(`npm pack did not create ${item.filename}`);
    }

    const info = infos.find((candidate) => candidate.packageName === item.name);
    if (!info) fail(`npm pack returned an unknown package: ${item.name}`);
    const packedManifest = JSON.parse((await capture("tar", ["-xOf", archive, "package/package.json"])).stdout);
    if (packedManifest.name !== info.packageName || packedManifest.version !== EXPECTED.releaseVersion) {
      fail(`${item.name} packed package identity does not match ${EXPECTED.releaseVersion}`);
    }
    if (packedManifest.private === true || packedManifest.publishConfig?.access !== "public") {
      fail(`${item.name} packed package is not publication-ready`);
    }
    for (const [dependency, range] of Object.entries(packedManifest.dependencies ?? {})) {
      if (!PUBLIC_PACKAGE_NAMES.has(dependency)) continue;
      if (range !== EXPECTED.releaseVersion || /workspace:|file:|\/packages\//.test(range)) {
        fail(`${item.name} packed dependency ${dependency} is not registry-resolvable: ${range}`);
      }
    }
    const distFiles = await walk(info.dist);
    for (const file of distFiles) {
      const contents = await fs.readFile(file, "utf8").catch(() => "");
      if (contents.includes(root) || contents.includes("/Volumes/PortableSSD/") || contents.includes("/Users/")) {
        fail(`${item.name} distribution leaks an absolute monorepo path: ${path.relative(root, file)}`);
      }
    }

    console.log(`[release] ${item.name}: ${item.size} bytes, ${files.length} files`);
  }
  console.log("[release] tarball hygiene: PASS");
  return packed;
}

function consumerSource() {
  return `import { useState } from "react";
import { createRoot } from "react-dom/client";

import { FluidTabs, JellyCard, MagneticButton } from "@pinky/components";
import { CursorSpotlight } from "@pinky/effects";
import { BubbleField, FloatingIslandNav, HoverExpandNavigation, MorphMenu, MorphingHero } from "@pinky/experiences";
import { CardFan } from "@pinky/layouts";
import { Magnetic } from "@pinky/primitives";
import { getComponent } from "@pinky/registry";
import { InteractiveLineChart, SwipeActionRow, ValidationField } from "@pinky/systems";

const data = [
  { id: "mon", label: "Mon", value: 18 },
  { id: "tue", label: "Tue", value: 24 },
  { id: "wed", label: "Wed", value: 21 },
  { id: "thu", label: "Thu", value: 31 },
];
const navItems = [
  { id: "home", label: "Home", href: "/" },
  { id: "library", label: "Library", href: "/library" },
];

function ConsumerApp() {
  const [saved, setSaved] = useState(false);
  return (
    <CursorSpotlight>
      <BubbleField disabled><span>Ambient surface</span></BubbleField>
      <main>
        <h1>Pinky UI package consumer</h1>
        <Magnetic><span>Primitive</span></Magnetic>
        <MagneticButton onClick={() => setSaved((value) => !value)}>{saved ? "Saved" : "Save"}</MagneticButton>
        <JellyCard><p>Public package surface</p></JellyCard>
        <FluidTabs items={[{ id: "overview", label: "Overview", content: "Overview content" }, { id: "details", label: "Details", content: "Details content" }]} />
        <CardFan><article>One</article><article>Two</article></CardFan>
        <HoverExpandNavigation items={navItems} />
        <FloatingIslandNav items={navItems} fixed={false} />
        <MorphMenu items={navItems} />
        <MorphingHero title="Hero" media={<div>Media</div>} disabled />
        <ValidationField label="Email" defaultValue="hello@example.com" />
        <SwipeActionRow actions={[{ label: "Archive", onAction: () => undefined }]}><span>Row</span></SwipeActionRow>
        <InteractiveLineChart data={data} label="Weekly activity" />
        <p>Registry entry: {getComponent("jelly-card")?.name ?? "missing"}</p>
      </main>
    </CursorSpotlight>
  );
}

createRoot(document.getElementById("root")!).render(<ConsumerApp />);
`;
}

function consumerPackageJson(tarballs, viteVersion) {
  const dependencies = {
    motion: "^12.23.12",
    react: "^19.1.1",
    "react-dom": "^19.1.1",
  };
  for (const item of tarballs) dependencies[item.name] = `file:../${item.filename}`;

  return {
    name: "pinky-ui-release-consumer",
    private: true,
    type: "module",
    scripts: { typecheck: "tsc --noEmit", build: "vite build" },
    dependencies,
    devDependencies: {
      "@types/react": "^19.1.9",
      "@types/react-dom": "^19.1.7",
      typescript: "^5.9.2",
      vite: `^${viteVersion}`,
    },
  };
}

async function verifyExternalConsumer(infos, tarballs, tempRoot) {
  const consumer = path.join(tempRoot, "consumer");
  await fs.mkdir(path.join(consumer, "src"), { recursive: true });
  const viteManifest = await readJson(path.join(root, "node_modules/vite/package.json")).catch(() => ({ version: "8.0.0" }));
  await fs.writeFile(path.join(consumer, "package.json"), `${JSON.stringify(consumerPackageJson(tarballs, viteManifest.version), null, 2)}\n`);
  await fs.writeFile(path.join(consumer, "tsconfig.json"), `${JSON.stringify({
    compilerOptions: {
      target: "ES2022",
      lib: ["DOM", "DOM.Iterable", "ES2022"],
      module: "ESNext",
      moduleResolution: "Bundler",
      jsx: "react-jsx",
      strict: true,
      noEmit: true,
      skipLibCheck: false,
      verbatimModuleSyntax: true,
      types: ["vite/client"],
    },
    include: ["src/**/*.ts", "src/**/*.tsx"],
  }, null, 2)}\n`);
  await fs.writeFile(path.join(consumer, "index.html"), `<!doctype html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Pinky UI release consumer</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>
`);
  await fs.writeFile(path.join(consumer, "src/main.tsx"), consumerSource());

  await run(npmCommand, ["install", "--ignore-scripts", "--no-audit", "--no-fund"], { cwd: consumer });
  await run(npmCommand, ["run", "typecheck"], { cwd: consumer });
  await run(npmCommand, ["run", "build"], { cwd: consumer });
  console.log("[release] external consumer install/typecheck/build: PASS");
}

async function runReleaseVerification() {
  console.log("Pinky UI release verification");
  await run(npmCommand, ["run", "verify:security"]);
  await run(npmCommand, ["run", "typecheck"]);
  await run(npmCommand, ["run", "lint"]);
  await run(npmCommand, ["test"]);

  const websiteBuildOutput = await runCaptured(npmCommand, ["run", "build"], { env: RELEASE_ENV });
  const pageCount = Number(stripAnsi(websiteBuildOutput).match(/Generating static pages \(\d+\/(\d+)\)/)?.[1]);
  if (!Number.isInteger(pageCount) || pageCount < EXPECTED.minimumProductPages) {
    fail(`website build generated ${Number.isInteger(pageCount) ? pageCount : "an unknown number of"} pages; expected at least ${EXPECTED.minimumProductPages} product pages`);
  }
  console.log(`[release] website build: PASS (${pageCount} generated pages; metadata routes are not frozen)`);
  await run(npmCommand, ["run", "verify:metadata"], { env: RELEASE_ENV });
  await run("git", ["diff", "--check"]);
  await assertTrackedHygiene();
  await assertSkillInvariants();

  await run(npmCommand, ["run", "build:packages"]);
  const infos = await packageInfos();
  await assertPackageMetadata(infos);
  assertPublicationOrder(infos);

  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "pinky-ui-release-"));
  try {
    await verifyPublishDryRuns(infos);
    const tarballs = await packPackages(infos, tempRoot);
    await verifyExternalConsumer(infos, tarballs, tempRoot);
  } finally {
    if (process.env.PINKY_KEEP_RELEASE_TEMP === "1") {
      console.log(`[release] preserved temporary verification directory: ${tempRoot}`);
    } else {
      await fs.rm(tempRoot, { recursive: true, force: true });
    }
  }

  console.log("PINKY UI 3.0E — SECURITY LAUNCH GATE PASS");
}

try {
  await runReleaseVerification();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
