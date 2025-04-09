import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      node_modules: path.resolve(__dirname, "node_modules"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: [path.join(__dirname, "node_modules")],
        additionalData:
          '@import "node_modules/bulma/sass/utilities/initial-variables.sass";',
      },
    },
  },
  build: {
    outDir: "./build",
  },
  plugins: [vue()],
  server: {
    port: 8080,
  },
});
