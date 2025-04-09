const { defineConfig } = require("cypress");
const { startDevServer } = require("@cypress/vite-dev-server");

module.exports = defineConfig({
  component: {
    specPattern: "**/*.cy.{js,jsx,ts,tsx}",
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
  e2e: {
    baseUrl: "http://localhost:8080", // Default Vite dev server port
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/e2e/**/*.cy.js",
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 3000,
    video: true,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      on("dev-server:start", (options) => {
        return startDevServer({
          options,
          viteConfig: {
            configFile: "vite.config.js", // Path to your Vite config file
          },
        });
      });

      return config;
    },
  },
});
