// Test to verify newsletter admin interface content

describe('Newsletter Admin Interface - Content Check', () => {
  beforeEach(() => {
    cy.visit('/newsletter/creer/', { timeout: 30000 })
  })

  it('should display main page elements', () => {
    // Check for main title
    cy.contains('Gestion des Newsletters', { timeout: 10000 }).should('be.visible')

    // Check for newsletter list section
    cy.contains('Newsletters existantes').should('be.visible')

    // Check for admin button
    cy.contains('Administration').should('be.visible')
  })

  it('should display table when newsletters exist', () => {
    // Create a test newsletter first
    cy.createTestNewsletter({
      subject: 'Interface Test Newsletter',
      contentBlocks: [{
        type: 'LEFT_ALIGNED_TEXT',
        content: 'Test content for interface',
        order: 0
      }]
    }).then(() => {
      cy.reload()

      // Check for table
      cy.get('table', { timeout: 10000 }).should('be.visible')

      // Check for table headers
      cy.contains('th', 'Sujet').should('be.visible')
      cy.contains('th', 'Date de publication').should('be.visible')
      cy.contains('th', 'Actions').should('be.visible')

      // Check for newsletter in table
      cy.contains('Interface Test Newsletter').should('be.visible')
    })
  })

  it('should show admin controls when authenticated', () => {
    // Mock admin authentication
    cy.window().then((win) => {
      win.sessionStorage.setItem('admin_authenticated', 'true')
    })

    cy.reload()

    // Should show admin logout button
    cy.contains('Déconnexion Admin', { timeout: 10000 }).should('be.visible')

    // Should show create newsletter button
    cy.contains('Créer un nouveau newsletter').should('be.visible')
  })

  it('should toggle newsletter creation form', () => {
    // Set admin state
    cy.window().then((win) => {
      win.sessionStorage.setItem('admin_authenticated', 'true')
    })

    cy.reload()

    // Click create newsletter button
    cy.contains('Créer un nouveau newsletter').click()

    // Should show form placeholder
    cy.contains('Formulaire de création de newsletter').should('be.visible')
    cy.contains('En développement').should('be.visible')

    // Should show hide button
    cy.contains('Cacher le formulaire').should('be.visible')

    // Click hide button
    cy.contains('Cacher le formulaire').click()

    // Form should be hidden
    cy.contains('Formulaire de création de newsletter').should('not.exist')
  })

  afterEach(() => {
    // Clean up test data
    cy.cleanupTestData()
  })
})