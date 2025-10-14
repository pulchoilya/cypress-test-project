const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://qauto.forstudy.space',
    env: {
      authUser: 'guest',
      authPass: 'welcome2qauto',
    },
    viewportHeight: 768,
    viewportWidth: 1366,
    video: true,
    screenshotOnRunFailure: true,
    pageLoadTimeout: 60000,
    defaultCommandTimeout: 4000,
    retries: { runMode: 1, openMode: 0 },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
