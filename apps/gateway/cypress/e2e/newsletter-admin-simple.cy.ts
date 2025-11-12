// Simple test to debug newsletter admin interface

describe('Newsletter Admin Interface - Debug', () => {
  it('should visit newsletter creation page', () => {
    cy.visit('/newsletter/creer/', { timeout: 30000 })

    // Basic check that page loads
    cy.get('body').should('be.visible')

    // Check for basic page content
    cy.contains('Newsletter', { timeout: 10000 }).should('be.visible')
  })

  it('should have basic page structure', () => {
    cy.visit('/newsletter/creer/', { timeout: 30000 })

    // Check for main container
    cy.get('[class*="container"]', { timeout: 10000 }).should('be.visible')

    // Log what's actually on the page
    cy.get('body').then(($body) => {
      cy.log('Page body content:', $body.text().substring(0, 200))
    })
  })
})