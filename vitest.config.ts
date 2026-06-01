import { defineConfig } from "vitest/config";
import dotenv from "dotenv";

export default defineConfig({
  test: {
    globals: true, // Allows using describe, it, expect globally without explicit imports
    environment: "node",
    // Looks for any .test.ts or .spec.ts files specifically inside the root test/ directory
    include: ["test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", "dist"],
    typecheck: {
      // Directs Vitest to use our custom testing tsconfig for static type analysis
      tsconfig: "./tsconfig.test.json",
    },
    coverage: {
      provider: "v8",

      reporter: ["text", "html"],
    },
    setupFiles: ["test/setup.ts"],
  },
  resolve: {
    tsconfigPaths: true,
  },
});
