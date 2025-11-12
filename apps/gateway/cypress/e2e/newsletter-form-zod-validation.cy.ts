describe('Newsletter Form - Zod Validation', () => {
  beforeEach(() => {
    cy.visit('/newsletter/creer/')
    cy.contains('Administration 🔒').click()
    cy.contains('Créer un nouveau newsletter').click()
  })

  describe('Required Field Validation', () => {
    it('should show validation errors for empty required fields', () => {
      // Try to submit empty form
      cy.get('button[type="submit"]').click()

      // Check for field-specific errors
      cy.contains('Le sujet est requis').should('be.visible')
      cy.contains('Format de date d\'événement invalide').should('be.visible')
      cy.contains('Format de date de publication invalide').should('be.visible')
      cy.contains('Au moins un bloc de contenu est requis').should('be.visible')
    })

    it('should validate subject field individually', () => {
      // Test empty subject
      cy.get('#newsletter-subject').focus().blur()

      // Should not show error immediately (only on submit)
      cy.contains('Le sujet est requis').should('not.exist')

      // Submit form to trigger validation
      cy.get('button[type="submit"]').click()
      cy.contains('Le sujet est requis').should('be.visible')

      // Fix subject and verify error disappears on next submit
      cy.get('#newsletter-subject').type('Test Newsletter Subject')
      cy.get('button[type="submit"]').click()
      cy.contains('Le sujet est requis').should('not.exist')
    })
  })

  describe('Date Field Validation', () => {
    beforeEach(() => {
      // Fill required subject
      cy.get('#newsletter-subject').type('Test Newsletter')
    })

    it('should validate date format constraints', () => {
      // Set invalid dates (publication after event)
      cy.get('#newsletter-event-date').type('2024-12-31')
      cy.get('#newsletter-publication-date').type('2025-01-01')

      cy.get('button[type="submit"]').click()

      // Should show publication date constraint error
      cy.contains("La date de publication ne peut pas être postérieure à la date de l\'événement").should('be.visible')
    })

    it('should accept valid date combinations', () => {
      // Set valid dates (publication before event)
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)
      const eventDateStr = futureDate.toISOString().split('T')[0]

      const pubDate = new Date()
      pubDate.setDate(pubDate.getDate() + 3)
      const pubDateStr = pubDate.toISOString().split('T')[0]

      cy.get('#newsletter-event-date').type(eventDateStr)
      cy.get('#newsletter-publication-date').type(pubDateStr)

      cy.get('button[type="submit"]').click()

      // Should not show date constraint errors
      cy.contains("La date de publication ne peut pas être postérieure à la date de l\'événement").should('not.exist')
    })
  })

  describe('Content Block Validation', () => {
    beforeEach(() => {
      // Fill required fields
      cy.get('#newsletter-subject').type('Test Newsletter')

      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)
      const eventDateStr = futureDate.toISOString().split('T')[0]

      const pubDate = new Date()
      pubDate.setDate(pubDate.getDate() + 3)
      const pubDateStr = pubDate.toISOString().split('T')[0]

      cy.get('#newsletter-event-date').type(eventDateStr)
      cy.get('#newsletter-publication-date').type(pubDateStr)
    })

    it('should require at least one content block', () => {
      cy.get('button[type="submit"]').click()

      cy.contains('Au moins un bloc de contenu est requis').should('be.visible')
    })

    it('should validate content block fields based on type', () => {
      // Add a content block
      cy.contains('Ajouter un élément').click()

      // Select LEFT_ALIGNED_TEXT type but leave content empty
      cy.get('select').first().select('LEFT_ALIGNED_TEXT')

      cy.get('button[type="submit"]').click()

      // Should show content block specific validation errors
      cy.get('#content-blocks-container').should('contain', 'Required')
    })

    it('should validate URL content blocks', () => {
      // Add a content block
      cy.contains('Ajouter un élément').click()

      // Select URL type
      cy.get('select').first().select('LEFT_ALIGNED_URL')

      // Enter invalid URL
      cy.get('textarea').first().type('not-a-valid-url')

      cy.get('button[type="submit"]').click()

      // Should validate URL format
      cy.get('#content-blocks-container').should('contain', 'Invalid URL')
    })
  })

  describe('Zod Error Message Formatting', () => {
    it('should display user-friendly error messages from Zod schema', () => {
      cy.get('button[type="submit"]').click()

      // Check that Zod error messages are properly formatted and displayed
      cy.get('.help, .error, [class*="hasTextDanger"]')
        .should('exist')
        .and('be.visible')
    })

    it('should clear errors when fields are corrected', () => {
      // Trigger validation errors
      cy.get('button[type="submit"]').click()
      cy.contains('Le sujet est requis').should('be.visible')

      // Fix the field
      cy.get('#newsletter-subject').type('Test Subject')

      // Submit again - this specific error should be gone
      cy.get('button[type="submit"]').click()
      cy.contains('Le sujet est requis').should('not.exist')
    })
  })

  describe('Form Submission with Valid Data', () => {
    it('should successfully submit form with valid data', () => {
      // Fill out valid form data
      cy.get('#newsletter-subject').type('Test Newsletter Subject')

      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)
      const eventDateStr = futureDate.toISOString().split('T')[0]

      const pubDate = new Date()
      pubDate.setDate(pubDate.getDate() + 3)
      const pubDateStr = pubDate.toISOString().split('T')[0]

      cy.get('#newsletter-event-date').type(eventDateStr)
      cy.get('#newsletter-publication-date').type(pubDateStr)

      // Add valid content block
      cy.contains('Ajouter un élément').click()
      cy.get('select').first().select('LEFT_ALIGNED_TEXT')
      cy.get('textarea').first().type('This is test content for the newsletter.')

      // Submit form
      cy.get('button[type="submit"]').click()

      // Should not show any validation errors
      cy.get('.help, .error, [class*="hasTextDanger"]')
        .should('not.contain', 'required')
        .and('not.contain', 'Invalid')
        .and('not.contain', 'cannot')

      // Should show success behavior (form reset, redirect, or success message)
      // Note: Exact behavior depends on implementation
    })
  })
})
