import { defineConfig } from 'cypress'
import fs from 'fs-extra'
import path from 'path'

export default defineConfig({
  chromeWebSecurity: false,
  projectId: 'z5frnt',
  viewportWidth: 1536,
  viewportHeight: 960,
  watchForFileChanges: false,
  pageLoadTimeout: 180000,
  defaultCommandTimeout: 5000,
  blockHosts: [
    '*ic0.app/api/v2/canister/vgqnj-miaaa-aaaal-qaapa-cai/query',
    '*//ic0.app/api/v2/*'
  ],
  env: {
    sonicAnalytics: 'https://teghx-cyaaa-aaaad-qbyfa-cai.ic.fleek.co/',
    sonicAnalyticsProd: 'https://data.sonic.ooo/',
    plugTextButton: 'Connect'
  },
  e2e: {

    setupNodeEvents(on, config) {
      const file = config.env.configFile
      function getConfigurationByFile(filePath) {
        if (filePath) {
          const pathToConfigFile = path.resolve('cypress', 'config', `${filePath}.json`)
          return fs.readJson(pathToConfigFile)
        }
      }
      return getConfigurationByFile(file)
    },
    baseUrl: 'https://2aoj2-aaaaa-aaaad-qa4qq-cai.ic.fleek.co/',
    excludeSpecPattern: '**/*.plug.spec.js',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
