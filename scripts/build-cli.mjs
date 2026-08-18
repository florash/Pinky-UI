import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { build } from "esbuild";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cliDir = path.join(root, "packages/cli");

const manifestPath = path.join(cliDir, "src/manifest.json");
try {
  await fs.access(manifestPath);
} catch {
  throw new Error("packages/cli/src/manifest.json is missing. Run scripts/build-cli-manifest.mjs first.");
}

await fs.rm(path.join(cliDir, "dist"), { recursive: true, force: true });
await fs.mkdir(path.join(cliDir, "dist"), { recursive: true });

await build({
  entryPoints: [path.join(cliDir, "src/index.ts")],
  outfile: path.join(cliDir, "dist/index.js"),
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node18",
  treeShaking: true,
  minify: false,
  sourcemap: false,
  legalComments: "none",
});

await fs.chmod(path.join(cliDir, "dist/index.js"), 0o755);

const stat = await fs.stat(path.join(cliDir, "dist/index.js"));
console.log(`Built pinky-ui CLI: ${stat.size} B`);
