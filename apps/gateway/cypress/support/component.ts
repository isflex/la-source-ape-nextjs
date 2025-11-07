// Import commands.js using ES2015 syntax:
import './commands'

// Import global styles
import '../../src/styles/scss/flex/all.module.scss'

// Configure component testing
import { mount } from 'cypress/react18'

// Augment the Cypress namespace to include type definitions for custom mount command
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

Cypress.Commands.add('mount', mount)

// Mock Amplify for component tests
beforeEach(() => {
  cy.window().then((win) => {
    // Mock Amplify client for component tests
    win.mockAmplifyClient = {
      models: {
        Newsletter: {
          list: cy.stub().resolves({ data: [] }),
          create: cy.stub().resolves({ data: {} }),
          update: cy.stub().resolves({ data: {} }),
          delete: cy.stub().resolves({ data: {} }),
        },
        ContentBlock: {
          list: cy.stub().resolves({ data: [] }),
          create: cy.stub().resolves({ data: {} }),
          update: cy.stub().resolves({ data: {} }),
          delete: cy.stub().resolves({ data: {} }),
        }
      }
    }
  })
})