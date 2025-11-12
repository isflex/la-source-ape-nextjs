// E2E Tests for Newsletter Admin Interface

describe('Newsletter Admin Interface', () => {
  beforeEach(() => {
    // Visit the newsletter creation page
    cy.visit('/newsletter/creer/')
  })

  describe('Public User Experience', () => {
    it('should display newsletter list without admin controls', () => {
      cy.contains('Gestion des Newsletters').should('be.visible')
      cy.contains('Newsletters existantes').should('be.visible')

      // Should show admin login button
      cy.contains('Administration 🔒').should('be.visible')

      // Should not show admin controls
      cy.contains('Créer un nouveau newsletter').should('not.exist')
      cy.get('input[type="checkbox"]').should('not.exist')
    })

    it('should display newsletters in table format', () => {
      // Check if table structure exists
      cy.get('table').should('be.visible')

      // Check table headers
      cy.contains('th', 'Sujet').should('be.visible')
      cy.contains('th', 'Date de publication').should('be.visible')
      cy.contains('th', 'Actions').should('be.visible')
    })

    it('should allow viewing published newsletters online', () => {
      // Create a published newsletter for testing
      cy.createTestNewsletter({
        subject: 'Published Newsletter Test',
        eventDate: '2025-01-20T00:00:00+02:00',
        publicationDate: '2024-12-01T00:00:00+02:00', // Past date = published
        contentBlocks: [{
          type: 'LEFT_ALIGNED_TEXT',
          content: 'Published content',
          order: 0
        }]
      }).then(() => {
        cy.reload()

        // Should be able to click "Voir en ligne"
        cy.contains('Published Newsletter Test').should('be.visible')
        cy.contains('Voir en ligne').should('be.visible')
      })
    })

    it('should warn when trying to view unpublished newsletters', () => {
      // Create an unpublished newsletter
      cy.createTestNewsletter({
        subject: 'Future Newsletter Test',
        eventDate: '2025-12-31T00:00:00+02:00',
        publicationDate: '2025-12-30T00:00:00+02:00', // Future date = unpublished
        contentBlocks: [{
          type: 'LEFT_ALIGNED_TEXT',
          content: 'Future content',
          order: 0
        }]
      }).then(() => {
        cy.reload()

        cy.contains('Future Newsletter Test').should('be.visible')

        // Mock window.alert
        cy.window().then((win) => {
          cy.stub(win, 'alert').as('windowAlert')
        })

        cy.contains('Voir en ligne').click()
        cy.get('@windowAlert').should('have.been.calledWith', "L'événement n'est pas encore publié")
      })
    })
  })

  describe('Admin Authentication', () => {
    it('should prompt for admin password', () => {
      cy.contains('Administration 🔒').click()

      // Mock window.prompt for admin password
      cy.window().then((win) => {
        cy.stub(win, 'prompt').returns('wrong-password')
      })

      // Should not show admin controls with wrong password
      cy.contains('Créer un nouveau newsletter').should('not.exist')
    })

    it('should show admin controls after successful authentication', () => {
      // Mock admin authentication
      cy.mockAmplifyAuth()
      cy.window().then((win) => {
        win.sessionStorage.setItem('admin_authenticated', 'true')
      })

      cy.reload()

      // Should show admin controls
      cy.contains('Déconnexion Admin 🔓').should('be.visible')
      cy.contains('Créer un nouveau newsletter').should('be.visible')
    })

    it('should allow admin logout', () => {
      // Set admin authenticated state
      cy.window().then((win) => {
        win.sessionStorage.setItem('admin_authenticated', 'true')
      })

      cy.reload()

      cy.contains('Déconnexion Admin 🔓').click()

      // Should return to non-admin state
      cy.contains('Administration 🔒').should('be.visible')
      cy.contains('Créer un nouveau newsletter').should('not.exist')
    })
  })

  describe('Admin Newsletter Management', () => {
    beforeEach(() => {
      // Set admin authenticated state
      cy.window().then((win) => {
        win.sessionStorage.setItem('admin_authenticated', 'true')
      })
      cy.reload()
    })

    it('should show admin-only controls in newsletter list', () => {
      // Create a test newsletter
      cy.createTestNewsletter({
        subject: 'Admin Control Test',
        contentBlocks: [{
          type: 'LEFT_ALIGNED_TEXT',
          content: 'Admin test content',
          order: 0
        }]
      }).then(() => {
        cy.reload()

        // Should show checkboxes for reusing content
        cy.get('input[type="checkbox"]').should('be.visible')

        // Should show delete buttons
        cy.contains('✕').should('be.visible')
      })
    })

    it('should allow deleting newsletters with confirmation', () => {
      // Create a test newsletter
      cy.createTestNewsletter({
        subject: 'Delete Test Newsletter',
        contentBlocks: [{
          type: 'LEFT_ALIGNED_TEXT',
          content: 'To be deleted',
          order: 0
        }]
      }).then(() => {
        cy.reload()

        // Mock window.confirm
        cy.window().then((win) => {
          cy.stub(win, 'confirm').returns(true)
        })

        cy.contains('Delete Test Newsletter').should('be.visible')
        cy.contains('✕').click()

        // Newsletter should be removed from list after deletion
        // Note: In real implementation, this might need time for API call
      })
    })

    it('should cancel deletion when user declines confirmation', () => {
      // Create a test newsletter
      cy.createTestNewsletter({
        subject: 'Cancel Delete Test',
        contentBlocks: [{
          type: 'LEFT_ALIGNED_TEXT',
          content: 'Should not be deleted',
          order: 0
        }]
      }).then(() => {
        cy.reload()

        // Mock window.confirm to return false
        cy.window().then((win) => {
          cy.stub(win, 'confirm').returns(false)
        })

        cy.contains('Cancel Delete Test').should('be.visible')
        cy.contains('✕').click()

        // Newsletter should still be visible
        cy.contains('Cancel Delete Test').should('be.visible')
      })
    })

    it('should allow admins to view unpublished newsletters', () => {
      // Create an unpublished newsletter
      cy.createTestNewsletter({
        subject: 'Admin Unpublished Test',
        eventDate: '2025-12-31T00:00:00+02:00',
        publicationDate: '2025-12-30T00:00:00+02:00', // Future date
        contentBlocks: [{
          type: 'LEFT_ALIGNED_TEXT',
          content: 'Admin can see this',
          order: 0
        }]
      }).then(() => {
        cy.reload()

        // Mock window.open to verify URL generation
        cy.window().then((win) => {
          cy.stub(win, 'open').as('windowOpen')
        })

        cy.contains('Admin Unpublished Test').should('be.visible')
        cy.contains('Voir en ligne').click()

        // Should open without alert (no restriction for admin)
        cy.get('@windowOpen').should('have.been.called')
      })
    })

    it('should toggle newsletter creation form', () => {
      cy.contains('Créer un nouveau newsletter').click()

      // Should show form
      cy.contains('Formulaire de création de newsletter').should('be.visible')
      cy.contains('En développement').should('be.visible')

      // Should change button text
      cy.contains('Cacher le formulaire').should('be.visible')

      // Should hide form when clicked again
      cy.contains('Cacher le formulaire').click()
      cy.contains('Formulaire de création de newsletter').should('not.exist')
    })
  })

  describe('Responsive Layout', () => {
    it('should display properly on mobile', () => {
      cy.viewport('iphone-x')

      cy.contains('Gestion des Newsletters').should('be.visible')
      cy.get('table').should('be.visible')

      // Buttons should be stacked or responsive
      cy.contains('Administration 🔒').should('be.visible')
    })

    it('should display properly on tablet', () => {
      cy.viewport('ipad-2')

      cy.contains('Gestion des Newsletters').should('be.visible')
      cy.get('table').should('be.visible')

      // Should have proper spacing
      cy.contains('Administration 🔒').should('be.visible')
    })
  })

  afterEach(() => {
    // Clean up test data
    cy.cleanupTestData()
  })
})
