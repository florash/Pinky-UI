import path from "node:path";
import { fileURLToPath } from "node:url";

const websiteDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(websiteDir, "..", "..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The website compiles `packages/*` straight from TypeScript source via the
  // path aliases in tsconfig.json, so tracing has to start at the repo root.
  outputFileTracingRoot: repoRoot,
  turbopack: {
    root: repoRoot,
  },
};

export default nextConfig;
