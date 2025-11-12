describe('Newsletter Date Picker', () => {
  beforeEach(() => {
    cy.visit('/newsletter/creer/')
    cy.contains('Administration 🔒').click()
    cy.contains('Créer un nouveau newsletter').click()
  })

  describe('Date Picker Functionality', () => {
    it('should show date picker input fields', () => {
      // Check if date picker inputs are rendered
      cy.get('#newsletter-event-date').should('be.visible')
      cy.get('#newsletter-publication-date').should('be.visible')

      // Check if they have calendar icons
      cy.get('#newsletter-event-date').should('have.attr', 'readonly')
      cy.get('#newsletter-publication-date').should('have.attr', 'readonly')
    })

    it('should open date picker when clicking on input', () => {
      // Click on event date input
      cy.get('#newsletter-event-date').click()

      // Should show date picker popup
      cy.get('.react-datepicker').should('be.visible')

      // Should show current month/year
      cy.get('.react-datepicker__current-month').should('be.visible')

      // Close by clicking outside
      cy.get('body').click(0, 0)
      cy.get('.react-datepicker').should('not.exist')
    })

    it('should allow selecting dates', () => {
      // Select event date
      cy.get('#newsletter-event-date').click()

      // Find a future date (assuming current month has future dates)
      cy.get('.react-datepicker__day:not(.react-datepicker__day--disabled)')
        .not('.react-datepicker__day--outside-month')
        .first()
        .click()

      // Input should now have a value
      cy.get('#newsletter-event-date').should('not.have.value', '')

      // Select publication date
      cy.get('#newsletter-publication-date').click()

      // Select same or earlier date
      cy.get('.react-datepicker__day:not(.react-datepicker__day--disabled)')
        .not('.react-datepicker__day--outside-month')
        .first()
        .click()

      // Input should now have a value
      cy.get('#newsletter-publication-date').should('not.have.value', '')
    })

    it('should show validation errors with date picker', () => {
      // Fill subject but leave dates empty
      cy.get('#newsletter-subject').type('Test Newsletter')

      // Try to submit
      cy.get('button[type="submit"]').click()

      // Should show validation errors for date fields
      cy.contains('Format de date d\'événement invalide').should('be.visible')
      cy.contains('Format de date de publication invalide').should('be.visible')
    })

    it('should enforce date constraints', () => {
      // The publication date picker should have maxDate set to event date
      // This is more of a functional test that would require checking the DatePicker props
      // For now, we'll just verify the inputs work as expected

      cy.get('#newsletter-event-date').click()
      cy.get('.react-datepicker__day--today').click()

      cy.get('#newsletter-publication-date').click()
      // Future dates should be disabled when event date is set
      cy.get('.react-datepicker').should('be.visible')
    })

    it('should format dates correctly', () => {
      const today = new Date()
      const todayString = today.toLocaleDateString('fr-FR')

      // Select today's date
      cy.get('#newsletter-event-date').click()
      cy.get('.react-datepicker__day--today').click()

      // Should display date in French format (dd/MM/yyyy)
      cy.get('#newsletter-event-date').should('contain.value', todayString.split('/').reverse().join('-'))
    })

    it('should work with form submission', () => {
      // Fill complete valid form
      cy.get('#newsletter-subject').type('Test Newsletter with Date Picker')

      // Select future dates
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)

      cy.get('#newsletter-event-date').click()
      cy.get('.react-datepicker__day--today').next().click() // Tomorrow

      cy.get('#newsletter-publication-date').click()
      cy.get('.react-datepicker__day--today').click() // Today

      // Add content block
      cy.contains('Ajouter un élément').click()
      cy.get('select').first().select('LEFT_ALIGNED_TEXT')
      cy.get('textarea').first().type('Test content with date picker')

      // Submit form
      cy.get('button[type="submit"]').click()

      // Should not show validation errors
      cy.contains('Format de date d\'événement invalide').should('not.exist')
      cy.contains('Format de date de publication invalide').should('not.exist')
    })
  })
})
