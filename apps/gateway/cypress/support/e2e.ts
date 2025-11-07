// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Configure global test settings
beforeEach(() => {
  // Reset Amplify state before each test
  cy.task('resetAmplifyData', { timeout: 10000 })
})

// Amplify authentication helper
Cypress.Commands.add('mockAmplifyAuth', () => {
  cy.window().then((win) => {
    // Mock admin authentication for tests
    win.localStorage.setItem('admin-authenticated', 'true')
  })
})

declare global {
  namespace Cypress {
    interface Chainable {
      mockAmplifyAuth(): Chainable<void>
    }
  }
}