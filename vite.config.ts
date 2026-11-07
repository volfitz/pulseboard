import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const BASE = process.env.VITE_BASE ?? "/";

export default defineConfig({
  plugins: [react()],
  base: BASE,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@protocol": path.resolve(__dirname, "src/protocol"),
      "@shared": path.resolve(__dirname, "src/shared"),
    },
  },
});
