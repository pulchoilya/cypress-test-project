const { defineConfig } = require('cypress');
const fs = require('fs-extra');
const path = require('path');

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve('cypress', 'config', `${file}.json`);
  return fs.readJsonSync(pathToConfigFile);
}

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    setupNodeEvents(on, config) {
      const file = config.env.configFile || 'qauto1';
      const fileConfig = getConfigurationByFile(file);
      return { ...config, ...fileConfig };
    },
    viewportHeight: 768,
    viewportWidth: 1366,
    video: true,
    screenshotOnRunFailure: true,
    pageLoadTimeout: 60000,
    defaultCommandTimeout: 4000,
    retries: { runMode: 1, openMode: 0 },
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true,
    },
  },
});
