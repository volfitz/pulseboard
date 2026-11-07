import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    // Vitest, Vite config'ini otomatik birleştirmez, alias'ları burada da tanımlamalıyız
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@protocol": path.resolve(__dirname, "src/protocol"),
      "@shared": path.resolve(__dirname, "src/shared"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}", "server/**/*.{test,spec}.ts"],
    passWithNoTests: true,
  },
});
