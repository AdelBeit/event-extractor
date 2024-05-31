import { defineConfig } from "vite";

export default defineConfig({
  publicDir: "public",
  root: "./",
  server: {
    open: "/main.html",
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
