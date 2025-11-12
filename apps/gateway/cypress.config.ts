import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      on('task', {
        resetAmplifyData() {
          // For now, return null to indicate task completion
          // This will be implemented when we have Amplify properly configured
          return null
        },
      })
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    supportFile: 'cypress/support/component.ts',
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
  },
  video: false,
  screenshotOnRunFailure: false,
  viewportWidth: 1280,
  viewportHeight: 720,
})