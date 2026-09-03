import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawn } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

/**
 * The one build sequence that produces a deployable static export of the
 * website: build:packages (dist output the CLI manifest and the website's
 * typecheck both read from) -> build:cli-manifest (writes the gitignored
 * manifest.json that packages/cli/src/index.ts statically imports, which
 * the website's tsconfig pulls in during `next build`'s typecheck) -> the
 * static export build itself. Skipping the first two steps on a fresh
 * checkout fails with "Cannot find module './manifest.json'" even though
 * it works on any machine that's built before and still has the file lying
 * around.
 *
 * .github/workflows/pages.yml and scripts/verify-release.mjs both need this
 * exact sequence — the former to deploy, the latter to catch static-export-only
 * failures (`output: "export"` breaks a route that `next build` alone would
 * pass) — so it lives here once instead of twice.
 */
export async function buildStaticSite({ env = process.env } = {}) {
  const buildEnv = {
    ...env,
    NEXT_PUBLIC_STATIC_EXPORT: env.NEXT_PUBLIC_STATIC_EXPORT?.trim() || "true",
    NEXT_PUBLIC_SITE_URL: env.NEXT_PUBLIC_SITE_URL?.trim() || "https://pinkyui.com",
    NEXT_PUBLIC_BASE_PATH: env.NEXT_PUBLIC_BASE_PATH?.trim() || "",
  };

  await run(npmCommand, ["run", "build:packages"], buildEnv);
  await run(npmCommand, ["run", "build:cli-manifest"], buildEnv);
  await run(npmCommand, ["run", "build"], buildEnv);
}

function run(command, args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, env, stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`[build-static-site] ${command} ${args.join(" ")} failed (${code ?? signal})`));
    });
  });
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  try {
    await buildStaticSite();
    console.log("[build-static-site] static export build: PASS");
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
