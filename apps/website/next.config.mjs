import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const websiteDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(websiteDir, "..", "..");
const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() || "";
const basePath = configuredBasePath
  ? `/${configuredBasePath.replace(/^\/+|\/+$/g, "")}`
  : "";
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath,
  ...(isStaticExport
    ? {
        output: "export",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  // The website compiles `packages/*` straight from TypeScript source via the
  // path aliases in tsconfig.json, so tracing has to start at the repo root.
  outputFileTracingRoot: repoRoot,
  turbopack: {
    root: repoRoot,
  },
};

export default nextConfig;
