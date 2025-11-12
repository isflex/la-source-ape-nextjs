// Basic test for newsletter form functionality

describe('Newsletter Form - Basic Functionality', () => {
  beforeEach(() => {
    cy.visit('/newsletter/creer/', { timeout: 30000 })
    // Set admin authentication
    cy.window().then((win) => {
      win.sessionStorage.setItem('admin_authenticated', 'true')
    })
    cy.reload()
  })

  it('should show newsletter creation form when admin clicks create button', () => {
    // Click create newsletter button
    cy.contains('Créer un nouveau newsletter', { timeout: 10000 }).click()

    // Form should be visible
    cy.contains('Formulaire de création de newsletter', { timeout: 5000 }).should('be.visible')

    // Check for basic form fields
    cy.get('input[id="newsletter-subject"]', { timeout: 5000 }).should('be.visible')
    cy.get('input[id="newsletter-event-date"]', { timeout: 5000 }).should('be.visible')
    cy.get('input[id="newsletter-publication-date"]', { timeout: 5000 }).should('be.visible')
  })

  it('should show content blocks management', () => {
    cy.contains('Créer un nouveau newsletter').click()

    // Content blocks section should be present
    cy.contains('Blocs de contenu', { timeout: 5000 }).should('be.visible')

    // Should have add button
    cy.get('button').contains('Ajouter un bloc').should('be.visible')
  })

  it('should be able to add a content block', () => {
    cy.contains('Créer un nouveau newsletter').click()

    // Add a content block
    cy.get('button').contains('Ajouter un bloc').click()

    // Should show content block form
    cy.contains('Bloc de contenu #1', { timeout: 5000 }).should('be.visible')
  })

  afterEach(() => {
    cy.cleanupTestData()
  })
})