// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Configure global test settings
beforeEach(() => {
  // Reset Amplify state before each test
  cy.task('resetAmplifyData', { timeout: 10000 })
})

// Handle uncaught exceptions (like hydration errors) in development
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignore hydration errors in development
  if (err.message.includes('Hydration failed') || err.message.includes('hydration')) {
    return false
  }
  // Let other errors fail the test
  return true
})

// Amplify authentication helper
Cypress.Commands.add('mockAmplifyAuth', () => {
  cy.window().then((win) => {
    // Mock admin authentication for tests
    win.localStorage.setItem('admin-authenticated', 'true')
  })
})