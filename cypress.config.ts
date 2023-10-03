import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000", // ADDED
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  video: false, // ADDED
  experimentalStudio: true, // ADDED for Cypress Studio (icon appears to right of test names in Command Log when hovered over)
});
