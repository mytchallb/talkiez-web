import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueDevTools from "vite-plugin-vue-devtools"
import terser from "@rollup/plugin-terser"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    terser({
      compress: {
        defaults: false,
        drop_console: true,
      },
      mangle: {
        eval: true,
        module: true,
        toplevel: true,
        safari10: true,
        properties: false,
      },
      output: {
        comments: false,
        ecma: "2020",
      },
    }),
  ],
  publicDir: "static",
  build: {
    outDir: "public",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
