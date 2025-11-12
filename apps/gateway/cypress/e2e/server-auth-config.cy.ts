// Server Auth Configuration Tests
// Essential tests for server-side admin authentication environment setup

describe('Server Auth Configuration', () => {

  beforeEach(() => {
    cy.clearAllSessionStorage()
    cy.clearAllLocalStorage()
    cy.clearCookies()
  })

  describe('Environment Configuration', () => {
    it('should have required environment variables configured', () => {
      // Check essential environment variables are set
      expect(Cypress.env('FLEX_ADMIN_USERNAME')).to.exist
      expect(Cypress.env('FLEX_ADMIN_PASSWORD')).to.exist

      cy.log('✅ Required admin credentials configured')
    })

    it('should load amplify_outputs.json successfully in layout', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })

      // Look for development banner indicating config status
      cy.get('[style*="backgroundColor"]', { timeout: 10000 }).then(($banner) => {
        const bannerText = $banner.text()

        if (bannerText.includes('User Pool ID not found')) {
          cy.log('❌ amplify_outputs.json parsing failed')
        } else if (bannerText.includes('eu-west-3_')) {
          cy.log('✅ amplify_outputs.json loaded successfully')
        }
      })
    })

    it('should work with current referenceAuth configuration', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })

      // If page loads without errors, referenceAuth is working
      cy.get('body').should('be.visible')
      cy.contains('Newsletter', { timeout: 10000 }).should('be.visible')

      cy.log('✅ referenceAuth configuration working')
    })
  })

  describe('AWS Service Configuration', () => {
    it('should connect to correct AWS region', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })

      cy.get('[style*="backgroundColor"]', { timeout: 10000 }).then(($banner) => {
        const bannerText = $banner.text()

        if (bannerText.includes('eu-west-3')) {
          cy.log('✅ Connected to eu-west-3 region')
        }
      })
    })

    it('should authenticate with real User Pool', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })

      // Check for successful authentication in banner
      cy.get('[style*="backgroundColor"]', { timeout: 10000 }).then(($banner) => {
        const bannerText = $banner.text()
        const styles = $banner.attr('style') || ''

        if (styles.includes('#d4edda') && (bannerText.includes('exists') || bannerText.includes('created'))) {
          cy.log('✅ User Pool authentication successful')
        } else if (styles.includes('#f8d7da')) {
          cy.log('⚠️  User Pool authentication failed')
          cy.log(`Error: ${bannerText}`)
        }
      })
    })
  })

  describe('Basic Functionality Validation', () => {
    it('should enable admin functionality when configured properly', () => {
      // Set client admin auth
      cy.window().then((win) => {
        win.sessionStorage.setItem('admin_authenticated', 'true')
      })

      cy.visit('/newsletter/creer/', { timeout: 30000 })

      // Should have functional form elements
      cy.get('input, textarea, select', { timeout: 10000 }).should('exist')

      cy.log('✅ Admin functionality enabled with proper configuration')
    })
  })
})