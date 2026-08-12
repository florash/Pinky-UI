import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  // The website's tsconfig uses jsx: "preserve" for Next, so the transform
  // needs telling explicitly that this is the automatic runtime.
  esbuild: { jsx: "automatic" },
  resolve: {
    // Mirrors the path aliases in apps/website/tsconfig.json.
    alias: {
      "@pinky/primitives": path.join(root, "packages/primitives/src/index.ts"),
      "@pinky/components": path.join(root, "packages/components/src/index.ts"),
      "@pinky/layouts": path.join(root, "packages/layouts/src/index.ts"),
      "@pinky/registry": path.join(root, "packages/registry/src/index.ts"),
      "@pinky/effects/internal": path.join(root, "packages/effects/src/internal"),
      "@pinky/effects": path.join(root, "packages/effects/src/index.ts"),
      "@pinky/experiences": path.join(root, "packages/experiences/src/index.ts"),
      "@pinky/systems": path.join(root, "packages/systems/src/index.ts"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["packages/**/*.test.{ts,tsx}"],
    // The workspace lives on an exFAT volume that can leave macOS resource
    // fork sidecars beside touched files. They are binary AppleDouble files,
    // not tests, even though their names match the include glob.
    exclude: ["**/._*"],
  },
});
