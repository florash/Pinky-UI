import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { execFile as execFileCallback } from "node:child_process";

import { build } from "esbuild";

const execFile = promisify(execFileCallback);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageNames = ["primitives", "components", "layouts", "effects", "experiences", "systems", "ai-ui", "mobile", "registry"];
const packageNamesByScope = new Set(packageNames.map((name) => `@pinky-ui/${name}`));

const compilerOptions = {
  target: "ES2022",
  lib: ["DOM", "DOM.Iterable", "ES2022"],
  module: "ESNext",
  moduleResolution: "Bundler",
  jsx: "react-jsx",
  strict: true,
  noUncheckedIndexedAccess: true,
  noUnusedLocals: true,
  noUnusedParameters: true,
  isolatedModules: true,
  verbatimModuleSyntax: true,
  esModuleInterop: true,
  resolveJsonModule: true,
  declaration: true,
  emitDeclarationOnly: true,
  noEmitOnError: true,
  forceConsistentCasingInFileNames: true,
};

function packagePath(name) {
  return path.join(root, "packages", name);
}

async function readPackage(name) {
  const directory = packagePath(name);
  const packageJson = JSON.parse(await fs.readFile(path.join(directory, "package.json"), "utf8"));
  return {
    name,
    directory,
    source: path.join(directory, "src"),
    dist: path.join(directory, "dist"),
    packageJson,
    dependencies: Object.keys(packageJson.dependencies ?? {})
      .filter((dependency) => packageNamesByScope.has(dependency))
      .map((dependency) => dependency.slice("@pinky-ui/".length)),
  };
}

function parseRequestedPackage() {
  const index = process.argv.indexOf("--package");
  if (index === -1) return null;

  const requested = process.argv[index + 1];
  if (!requested || !packageNames.includes(requested)) {
    throw new Error(`Unknown package. Use one of: ${packageNames.join(", ")}`);
  }
  return requested;
}

function collectBuildSet(packages, requested) {
  const selected = new Set();
  const visit = (name) => {
    if (selected.has(name)) return;
    selected.add(name);
    for (const dependency of packages.get(name).dependencies) visit(dependency);
  };

  if (requested) visit(requested);
  else packageNames.forEach(visit);
  return selected;
}

function pathsFor(packageInfo, packages) {
  const paths = {};
  for (const dependency of packageInfo.dependencies) {
    const dependencyInfo = packages.get(dependency);
    paths[`@pinky-ui/${dependency}`] = [path.join(dependencyInfo.dist, "index.d.ts")];
  }
  return paths;
}

async function runTypeScript(packageInfo, packages, tempRoot) {
  const configPath = path.join(tempRoot, `${packageInfo.name}.tsconfig.json`);
  const config = {
    compilerOptions: {
      ...compilerOptions,
      rootDir: packageInfo.source,
      outDir: packageInfo.dist,
      baseUrl: root,
      paths: pathsFor(packageInfo, packages),
    },
    include: [
      path.join(packageInfo.source, "**/*.ts"),
      path.join(packageInfo.source, "**/*.tsx"),
    ],
    exclude: [
      path.join(packageInfo.source, "**/*.test.ts"),
      path.join(packageInfo.source, "**/*.test.tsx"),
      path.join(packageInfo.source, "**/._*"),
    ],
  };

  await fs.writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`);

  try {
    await execFile(
      process.execPath,
      [path.join(root, "node_modules", "typescript", "bin", "tsc"), "--pretty", "false", "--project", configPath],
      { cwd: root, maxBuffer: 32 * 1024 * 1024 },
    );
  } catch (error) {
    const output = [error.stdout, error.stderr].filter(Boolean).join("\n");
    throw new Error(`TypeScript declaration build failed for @pinky-ui/${packageInfo.name}\n${output}`);
  }
}

async function runJavaScriptBuild(packageInfo) {
  await build({
    entryPoints: [path.join(packageInfo.source, "index.ts")],
    outfile: path.join(packageInfo.dist, "index.js"),
    bundle: true,
    format: "esm",
    platform: "browser",
    target: "es2022",
    jsx: "automatic",
    treeShaking: true,
    minify: false,
    sourcemap: false,
    legalComments: "none",
    external: ["react", "react/*", "react-dom", "react-dom/*", "motion", "motion/*", ...packageNamesByScope],
    banner: packageInfo.name === "registry" ? undefined : { js: '"use client";' },
  });
}

async function removeAppleDoubleFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.name.startsWith("._")) {
      await fs.rm(entryPath, { recursive: true, force: true });
    } else if (entry.isDirectory()) {
      await removeAppleDoubleFiles(entryPath);
    }
  }
}

async function buildPackage(packageInfo, packages, tempRoot) {
  await fs.rm(packageInfo.dist, { recursive: true, force: true });
  await fs.mkdir(packageInfo.dist, { recursive: true });
  await runTypeScript(packageInfo, packages, tempRoot);
  await removeAppleDoubleFiles(packageInfo.dist);
  await runJavaScriptBuild(packageInfo);
  await removeAppleDoubleFiles(packageInfo.dist);

  const declaration = path.join(packageInfo.dist, "index.d.ts");
  const javascript = path.join(packageInfo.dist, "index.js");
  await fs.access(declaration);
  await fs.access(javascript);
  const [declarationStat, javascriptStat] = await Promise.all([fs.stat(declaration), fs.stat(javascript)]);
  console.log(
    `Built @pinky-ui/${packageInfo.name}: ${javascriptStat.size} B JS, ${declarationStat.size} B declarations`,
  );
}

const packageInfoList = await Promise.all(packageNames.map(readPackage));
const packages = new Map(packageInfoList.map((info) => [info.name, info]));
const requested = parseRequestedPackage();
const selected = collectBuildSet(packages, requested);
const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "pinky-ui-package-build-"));

try {
  for (const name of packageNames) {
    if (selected.has(name)) await buildPackage(packages.get(name), packages, tempRoot);
  }
} finally {
  await fs.rm(tempRoot, { recursive: true, force: true });
}
