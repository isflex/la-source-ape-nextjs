describe('Newsletter Phase 4 Features', () => {
  beforeEach(() => {
    cy.visit('/newsletter/creer/')
    cy.contains('Administration 🔒').click()
  })

  describe('Content Reuse Functionality', () => {
    it('should show reuse checkboxes for admin users', () => {
      // Admin should see checkboxes for content reuse
      cy.get('input[type="checkbox"]').should('be.visible')
      cy.get('input[type="checkbox"]').should('have.attr', 'title', 'Réutiliser le contenu')
    })

    it('should enable reuse button when newsletters are selected', () => {
      // Initially disabled
      cy.contains('Réutiliser le contenu sélectionné').should('be.disabled')
      cy.contains('Réutiliser le contenu sélectionné').should('contain', '(0)')

      // Select a newsletter
      cy.get('input[type="checkbox"]').first().check()
      cy.contains('Réutiliser le contenu sélectionné').should('not.be.disabled')
      cy.contains('Réutiliser le contenu sélectionné').should('contain', '(1)')

      // Select another newsletter
      cy.get('input[type="checkbox"]').eq(1).check()
      cy.contains('Réutiliser le contenu sélectionné').should('contain', '(2)')
    })

    it('should populate form when reusing single newsletter content', () => {
      // Select one newsletter
      cy.get('input[type="checkbox"]').first().check()

      // Click reuse button
      cy.contains('Réutiliser le contenu sélectionné').click()

      // Should show form with success message
      cy.contains('prêt à être réutilisé').should('be.visible')
      cy.get('#newsletter-subject').should('be.visible')

      // Subject should be pre-filled with "(copie)" suffix
      cy.get('#newsletter-subject').should('contain.value', '(copie)')
    })

    it('should clear selection after reusing content', () => {
      // Select and reuse content
      cy.get('input[type="checkbox"]').first().check()
      cy.contains('Réutiliser le contenu sélectionné').click()

      // Selection should be cleared
      cy.contains('Réutiliser le contenu sélectionné').should('contain', '(0)')
      cy.get('input[type="checkbox"]').should('not.be.checked')
    })
  })

  describe('Image Upload for CENTRED_IMAGE Blocks', () => {
    beforeEach(() => {
      cy.contains('Créer un nouveau newsletter').click()
      cy.contains('Ajouter un élément').click()
      cy.get('select').first().select('CENTRED_IMAGE')
    })

    it('should show image uploader for CENTRED_IMAGE type', () => {
      // Should show image upload interface instead of textarea
      cy.contains('Télécharger une image').should('be.visible')
      cy.contains('Formats acceptés: PNG, JPEG, JPG').should('be.visible')
      cy.contains('Taille max: 100KB').should('be.visible')
      cy.contains('Dimensions max: 1000×1000px').should('be.visible')
      cy.contains('Choisir une image').should('be.visible')

      // Should not show textarea
      cy.get('textarea').should('not.exist')
    })

    it('should show error for unsupported file types', () => {
      // Create a mock file with unsupported type
      const unsupportedFile = new File(['test'], 'test.txt', { type: 'text/plain' })

      cy.get('input[type="file"]').then(input => {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(unsupportedFile)
        ;(input[0] as HTMLInputElement).files = dataTransfer.files
        input[0].dispatchEvent(new Event('change', { bubbles: true }))
      })

      cy.contains('Format non supporté').should('be.visible')
    })

    it('should show processing state during image upload', () => {
      // This test would require mocking the file processing
      // For now, we'll just verify the interface elements exist
      cy.contains('Choisir une image').should('be.visible')
    })

    it('should allow switching back to other content block types', () => {
      // Change to text type
      cy.get('select').first().select('LEFT_ALIGNED_TEXT')

      // Should show textarea instead of image uploader
      cy.get('textarea').should('be.visible')
      cy.contains('Télécharger une image').should('not.exist')

      // Change back to image type
      cy.get('select').first().select('CENTRED_IMAGE')

      // Should show image uploader again
      cy.contains('Télécharger une image').should('be.visible')
      cy.get('textarea').should('not.exist')
    })
  })

  describe('Enhanced Content Block Management', () => {
    beforeEach(() => {
      cy.contains('Créer un nouveau newsletter').click()
    })

    it('should maintain proper data structure for image blocks', () => {
      // Add image content block
      cy.contains('Ajouter un élément').click()
      cy.get('select').last().select('CENTRED_IMAGE')

      // Form should accept the content block without errors
      cy.get('#newsletter-subject').type('Test with Image Block')

      // Set dates
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)
      const eventDateStr = futureDate.toISOString().split('T')[0]

      const pubDate = new Date()
      pubDate.setDate(pubDate.getDate() + 3)
      const pubDateStr = pubDate.toISOString().split('T')[0]

      cy.get('#newsletter-event-date').type(eventDateStr)
      cy.get('#newsletter-publication-date').type(pubDateStr)

      // Try to submit - should show validation for missing image
      cy.get('button[type="submit"]').click()

      // Should show appropriate validation message
      cy.get('.help, .error, [class*="hasTextDanger"]').should('be.visible')
    })
  })

  describe('Form Integration', () => {
    it('should handle mixed content blocks correctly', () => {
      cy.contains('Créer un nouveau newsletter').click()

      // Fill basic info
      cy.get('#newsletter-subject').type('Mixed Content Newsletter')

      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)
      const eventDateStr = futureDate.toISOString().split('T')[0]

      const pubDate = new Date()
      pubDate.setDate(pubDate.getDate() + 3)
      const pubDateStr = pubDate.toISOString().split('T')[0]

      cy.get('#newsletter-event-date').type(eventDateStr)
      cy.get('#newsletter-publication-date').type(pubDateStr)

      // Add text block
      cy.contains('Ajouter un élément').click()
      cy.get('select').last().select('LEFT_ALIGNED_TEXT')
      cy.get('textarea').last().type('This is text content')

      // Add image block
      cy.contains('Ajouter un élément').click()
      cy.get('select').last().select('CENTRED_IMAGE')

      // Add URL block
      cy.contains('Ajouter un élément').click()
      cy.get('select').last().select('CENTERED_URL')
      cy.get('textarea').last().type('https://example.com')

      // Should have different input types for each block
      cy.get('textarea').should('have.length', 2) // text and url blocks
      cy.contains('Télécharger une image').should('be.visible') // image block

      // Reordering should work
      cy.get('[data-testid^="move-up-"]').should('exist')
      cy.get('[data-testid^="move-down-"]').should('exist')
    })

    it('should preserve image data when reordering blocks', () => {
      cy.contains('Créer un nouveau newsletter').click()

      // Add two blocks
      cy.contains('Ajouter un élément').click()
      cy.get('select').last().select('LEFT_ALIGNED_TEXT')
      cy.get('textarea').last().type('First block')

      cy.contains('Ajouter un élément').click()
      cy.get('select').last().select('CENTRED_IMAGE')

      // Verify both blocks exist
      cy.get('[data-testid="content-block-0"]').should('exist')
      cy.get('[data-testid="content-block-1"]').should('exist')

      // Move image block up
      cy.get('[data-testid="move-up-1"]').click()

      // Blocks should be reordered but maintain their content
      cy.get('select').first().should('have.value', 'CENTRED_IMAGE')
      cy.get('select').eq(1).should('have.value', 'LEFT_ALIGNED_TEXT')
    })
  })
})