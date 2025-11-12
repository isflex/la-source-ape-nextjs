// TDD Tests for Newsletter Creation Form - Phase 3

describe('Newsletter Creation Form - TDD', () => {
  beforeEach(() => {
    cy.visit('/newsletter/creer/', { timeout: 30000 })
    // Set admin authentication
    cy.window().then((win) => {
      win.sessionStorage.setItem('admin_authenticated', 'true')
    })
    cy.reload()
  })

  describe('Form Display and Basic Interaction', () => {
    it('should show newsletter creation form when admin clicks create button', () => {
      // Click create newsletter button
      cy.contains('Créer un nouveau newsletter').click()

      // Form should be visible
      cy.contains('Formulaire de création de newsletter').should('be.visible')

      // Basic form fields should be present
      cy.get('#newsletter-subject').should('be.visible')
      cy.get('#newsletter-event-date').should('be.visible')
      cy.get('#newsletter-publication-date').should('be.visible')
      cy.get('#newsletter-title').should('be.visible')
      cy.get('#newsletter-greetings').should('be.visible')
    })

    it('should show content blocks section', () => {
      cy.contains('Créer un nouveau newsletter').click()

      // Content blocks section should be present
      cy.contains('Blocs de contenu').should('be.visible')
      cy.get('#content-blocks-container').should('be.visible')

      // Should have initial add button
      cy.contains('Ajouter un bloc').should('be.visible')
    })
  })

  describe('Form Validation', () => {
    beforeEach(() => {
      cy.contains('Créer un nouveau newsletter').click()
    })

    it('should validate required fields', () => {
      // Try to submit empty form
      cy.get('#create-newsletter-btn').click()

      // Should show validation errors
      cy.contains('Le sujet est requis').should('be.visible')
      cy.contains('La date d\'événement est requise').should('be.visible')
      cy.contains('La date de publication est requise').should('be.visible')
    })

    it('should validate date constraints', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 30)
      const futureDateStr = futureDate.toISOString().split('T')[0]

      // Set past event date
      cy.get('#newsletter-event-date').type(yesterdayStr)
      cy.get('#newsletter-publication-date').type(futureDateStr)
      cy.get('#create-newsletter-btn').click()

      // Should show validation error
      cy.contains('La date d\'événement ne peut pas être dans le passé').should('be.visible')
    })

    it('should validate publication date is before event date', () => {
      const eventDate = new Date()
      eventDate.setDate(eventDate.getDate() + 7)
      const eventDateStr = eventDate.toISOString().split('T')[0]

      const publicationDate = new Date()
      publicationDate.setDate(publicationDate.getDate() + 14)
      const publicationDateStr = publicationDate.toISOString().split('T')[0]

      cy.get('#newsletter-event-date').type(eventDateStr)
      cy.get('#newsletter-publication-date').type(publicationDateStr)
      cy.get('#create-newsletter-btn').click()

      cy.contains('La date de publication doit être antérieure à la date d\'événement').should('be.visible')
    })
  })

  describe('Content Block Management', () => {
    beforeEach(() => {
      cy.contains('Créer un nouveau newsletter').click()
    })

    it('should add a new content block', () => {
      // Add first content block
      cy.get('#add-content-block-btn').click()

      // Should show content block form
      cy.get('[data-testid="content-block-0"]').should('be.visible')
      cy.get('[data-testid="content-block-type-0"]').should('be.visible')
      cy.get('[data-testid="content-block-content-0"]').should('be.visible')
      cy.get('[data-testid="remove-block-0"]').should('be.visible')
    })

    it('should handle multiple content blocks', () => {
      // Add multiple blocks
      cy.get('#add-content-block-btn').click()
      cy.get('#add-content-block-btn').click()
      cy.get('#add-content-block-btn').click()

      // Should show all blocks
      cy.get('[data-testid="content-block-0"]').should('be.visible')
      cy.get('[data-testid="content-block-1"]').should('be.visible')
      cy.get('[data-testid="content-block-2"]').should('be.visible')
    })

    it('should remove content blocks', () => {
      // Add blocks
      cy.get('#add-content-block-btn').click()
      cy.get('#add-content-block-btn').click()

      // Remove first block
      cy.get('[data-testid="remove-block-0"]').click()

      // First block should be gone, second should still exist
      cy.get('[data-testid="content-block-0"]').should('not.exist')
      cy.get('[data-testid="content-block-1"]').should('be.visible')
    })

    it('should reorder content blocks', () => {
      // Add multiple blocks with content
      cy.get('#add-content-block-btn').click()
      cy.get('[data-testid="content-block-content-0"]').type('First block')

      cy.get('#add-content-block-btn').click()
      cy.get('[data-testid="content-block-content-1"]').type('Second block')

      // Move second block up
      cy.get('[data-testid="move-up-1"]').click()

      // Order should be swapped
      cy.get('[data-testid="content-block-0"] textarea').should('have.value', 'Second block')
      cy.get('[data-testid="content-block-1"] textarea').should('have.value', 'First block')
    })

    it('should validate content block types and content', () => {
      cy.get('#add-content-block-btn').click()

      // Set content block type and content
      cy.get('[data-testid="content-block-type-0"]').select('LEFT_ALIGNED_TEXT')
      cy.get('[data-testid="content-block-content-0"]').type('Test content')

      // Should be valid
      cy.get('[data-testid="content-block-0"]').should('not.have.class', 'error')

      // Clear content
      cy.get('[data-testid="content-block-content-0"]').clear()
      cy.get('#create-newsletter-btn').click()

      // Should show validation error
      cy.contains('Le contenu du bloc est requis').should('be.visible')
    })
  })

  describe('Newsletter Creation', () => {
    beforeEach(() => {
      cy.contains('Créer un nouveau newsletter').click()
    })

    it('should successfully create newsletter with complete data', () => {
      const eventDate = new Date()
      eventDate.setDate(eventDate.getDate() + 7)
      const eventDateStr = eventDate.toISOString().split('T')[0]

      const publicationDate = new Date()
      publicationDate.setDate(publicationDate.getDate() + 5)
      const publicationDateStr = publicationDate.toISOString().split('T')[0]

      // Fill form
      cy.get('#newsletter-subject').type('Test Newsletter Subject')
      cy.get('#newsletter-event-date').type(eventDateStr)
      cy.get('#newsletter-publication-date').type(publicationDateStr)
      cy.get('#newsletter-title').type('Welcome Test')
      cy.get('#newsletter-greetings').type('Bonjour et bienvenue!')

      // Add content block
      cy.get('#add-content-block-btn').click()
      cy.get('[data-testid="content-block-type-0"]').select('LEFT_ALIGNED_TEXT')
      cy.get('[data-testid="content-block-content-0"]').type('This is test content for the newsletter.')

      // Submit form
      cy.get('#create-newsletter-btn').click()

      // Should show success message
      cy.contains('Newsletter créé avec succès').should('be.visible')

      // Should redirect to newsletter list or clear form
      cy.contains('Test Newsletter Subject').should('be.visible')
    })

    it('should generate unique slug from subject', () => {
      // Create newsletter with subject that needs slug generation
      const eventDate = new Date()
      eventDate.setDate(eventDate.getDate() + 7)
      const eventDateStr = eventDate.toISOString().split('T')[0]

      const publicationDate = new Date()
      publicationDate.setDate(publicationDate.getDate() + 5)
      const publicationDateStr = publicationDate.toISOString().split('T')[0]

      cy.get('#newsletter-subject').type('Test Newsletter With Special Characters & Accents')
      cy.get('#newsletter-event-date').type(eventDateStr)
      cy.get('#newsletter-publication-date').type(publicationDateStr)

      cy.get('#add-content-block-btn').click()
      cy.get('[data-testid="content-block-type-0"]').select('LEFT_ALIGNED_TEXT')
      cy.get('[data-testid="content-block-content-0"]').type('Test content')

      cy.get('#create-newsletter-btn').click()

      // Should successfully create with clean slug
      cy.contains('Newsletter créé avec succès').should('be.visible')
    })
  })

  describe('Form Reset and Cancel', () => {
    beforeEach(() => {
      cy.contains('Créer un nouveau newsletter').click()
    })

    it('should reset form when cancel is clicked', () => {
      // Fill some form data
      cy.get('#newsletter-subject').type('Test Subject')
      cy.get('#add-content-block-btn').click()
      cy.get('[data-testid="content-block-content-0"]').type('Test content')

      // Click cancel
      cy.get('#cancel-form-btn').click()

      // Form should be hidden
      cy.contains('Formulaire de création de newsletter').should('not.be.visible')
    })

    it('should reset form after successful creation', () => {
      const eventDate = new Date()
      eventDate.setDate(eventDate.getDate() + 7)
      const eventDateStr = eventDate.toISOString().split('T')[0]

      const publicationDate = new Date()
      publicationDate.setDate(publicationDate.getDate() + 5)
      const publicationDateStr = publicationDate.toISOString().split('T')[0]

      // Fill and submit form
      cy.get('#newsletter-subject').type('Reset Test Newsletter')
      cy.get('#newsletter-event-date').type(eventDateStr)
      cy.get('#newsletter-publication-date').type(publicationDateStr)
      cy.get('#add-content-block-btn').click()
      cy.get('[data-testid="content-block-type-0"]').select('LEFT_ALIGNED_TEXT')
      cy.get('[data-testid="content-block-content-0"]').type('Test content')

      cy.get('#create-newsletter-btn').click()
      cy.contains('Newsletter créé avec succès').should('be.visible')

      // Show form again
      cy.contains('Créer un nouveau newsletter').click()

      // Form should be empty
      cy.get('#newsletter-subject').should('have.value', '')
      cy.get('#newsletter-event-date').should('have.value', '')
      cy.get('#newsletter-publication-date').should('have.value', '')
      cy.get('[data-testid="content-block-0"]').should('not.exist')
    })
  })

  afterEach(() => {
    cy.cleanupTestData()
  })
})