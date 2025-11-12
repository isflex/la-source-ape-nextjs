// Manual verification test for newsletter form

describe('Newsletter Form - Manual Check', () => {
  it('should visit newsletter creation page and log basic info', () => {
    cy.visit('/newsletter/creer/', { timeout: 30000 })

    // Set admin authentication
    cy.window().then((win) => {
      win.sessionStorage.setItem('admin_authenticated', 'true')
    })

    cy.reload()

    // Log page title
    cy.title().should('include', 'Gateway')

    // Check page loads
    cy.get('body').should('be.visible')

    // Log what's on the page
    cy.get('body').then(($body) => {
      cy.log('Page loaded successfully')
      cy.log('Page contains newsletter text:', $body.text().includes('Newsletter'))
    })

    // Try to find admin button
    cy.get('body').then(($body) => {
      if ($body.text().includes('Créer un nouveau newsletter')) {
        cy.log('✓ Create newsletter button found')
        cy.contains('Créer un nouveau newsletter').should('be.visible')
      } else {
        cy.log('✗ Create newsletter button not found')
      }
    })
  })
})