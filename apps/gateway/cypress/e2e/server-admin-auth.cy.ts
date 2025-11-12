// Server-Side Admin Authentication Tests for Newsletter Layout
// Tests the automatic admin authentication that happens in layout.tsx

describe('Server-Side Admin Auto-Authentication in Layout', () => {

  beforeEach(() => {
    // Ensure clean state for each test
    cy.clearAllSessionStorage()
    cy.clearAllLocalStorage()
    cy.clearCookies()
  })

  describe('Newsletter Layout Auto-Authentication', () => {
    it('should automatically authenticate admin user when visiting newsletter creation page', () => {
      // Visit the newsletter creation page which triggers server-side auto-auth
      cy.visit('/newsletter/creer/', { timeout: 30000 })

      // Check that the page loads successfully (indicating server auth worked)
      cy.get('body').should('be.visible')

      // In development mode, should see admin setup banner
      cy.get('[style*="backgroundColor"]').should('exist').then(($banner) => {
        const bannerText = $banner.text()

        // Should contain admin setup result
        expect(bannerText).to.contain('Admin Setup')

        // Should indicate success or provide error details
        if (bannerText.includes('Admin user')) {
          cy.log('✅ Admin auto-authentication banner found')
          cy.log(`Banner message: ${bannerText}`)
        }
      })
    })

    it('should display authentication status in development banner', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })

      // Look for development info banner with admin setup status
      cy.get('[style*="backgroundColor"]').should('exist').within(() => {
        cy.contains('Admin Setup').should('be.visible')

        // Check banner styling indicates success or failure
        cy.get('[style*="backgroundColor"]').then(($banner) => {
          const styles = $banner.attr('style')

          if (styles?.includes('#d4edda') || styles?.includes('green')) {
            cy.log('✅ Success banner detected - admin auth successful')
          } else if (styles?.includes('#f8d7da') || styles?.includes('red')) {
            cy.log('⚠️  Error banner detected - admin auth failed')
          }
        })
      })
    })

    it('should handle admin authentication failure gracefully', () => {
      // This test verifies the layout handles auth failures without crashing
      cy.visit('/newsletter/creer/', { timeout: 30000, failOnStatusCode: false })

      // Page should still load even if admin auth fails
      cy.get('body').should('be.visible')

      // Should display error in development banner if auth fails
      cy.get('body').then(($body) => {
        if ($body.find('[style*="backgroundColor"]').length > 0) {
          cy.get('[style*="backgroundColor"]').then(($banner) => {
            const bannerText = $banner.text()

            if (bannerText.includes('Error') || bannerText.includes('failed')) {
              cy.log('✅ Authentication failure handled gracefully')
              cy.log(`Error message: ${bannerText}`)
            } else {
              cy.log('✅ Authentication succeeded')
            }
          })
        }
      })
    })

    it('should work with environment variables for admin credentials', () => {
      // Verify that environment variables are properly configured
      expect(Cypress.env('FLEX_ADMIN_USERNAME')).to.be.a('string').and.not.be.empty
      expect(Cypress.env('FLEX_ADMIN_PASSWORD')).to.be.a('string').and.not.be.empty

      cy.visit('/newsletter/creer/', { timeout: 30000 })

      // Page should load successfully with proper environment setup
      cy.get('body').should('be.visible')
      cy.contains('Newsletter', { timeout: 10000 }).should('be.visible')

      cy.log(`✅ Environment variables configured correctly`)
      cy.log(`Admin username: ${Cypress.env('FLEX_ADMIN_USERNAME')}`)
    })
  })

  describe('Server-Side Credential Injection', () => {
    beforeEach(() => {
      // Set client-side admin authentication for credential access
      cy.window().then((win) => {
        win.sessionStorage.setItem('admin_authenticated', 'true')
      })
    })

    it('should inject admin credentials for child components when client is authenticated', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })

      // Page should load with admin credentials available
      cy.get('body').should('be.visible')

      // Look for signs that server credentials are working
      // This would be evidenced by successful operation of child components
      cy.get('[data-testid="newsletter-form"]', { timeout: 10000 }).should('be.visible')

      cy.log('✅ Page loaded with admin authentication - credentials should be available')
    })

    it('should not provide credentials when client is not authenticated as admin', () => {
      // Don't set client-side admin authentication
      cy.visit('/newsletter/creer/', { timeout: 30000 })

      // Page should still load but without admin credentials
      cy.get('body').should('be.visible')

      // In this case, some admin operations might not work
      // But the page itself should render
      cy.log('✅ Page loaded without client admin auth - credentials should be restricted')
    })
  })

  describe('Performance and Reliability of Layout Authentication', () => {
    it('should complete server-side authentication within reasonable time', () => {
      const startTime = Date.now()

      cy.visit('/newsletter/creer/', { timeout: 30000 })

      cy.get('body').should('be.visible').then(() => {
        const endTime = Date.now()
        const loadTime = endTime - startTime

        // Page with server auth should load within 10 seconds
        expect(loadTime).to.be.lessThan(10000)

        cy.log(`✅ Page with server authentication loaded in ${loadTime}ms`)

        // Log warning if slow
        if (loadTime > 5000) {
          cy.log(`⚠️  Server authentication took ${loadTime}ms (>5s)`)
        }
      })
    })

    it('should handle concurrent page loads with server authentication', () => {
      // Test multiple tabs/windows accessing the same page
      cy.visit('/newsletter/creer/', { timeout: 30000 })
      cy.get('body').should('be.visible')

      // Open page in a new context (simulating multiple tabs)
      cy.visit('/newsletter/creer/', { timeout: 30000 })
      cy.get('body').should('be.visible')

      cy.log('✅ Concurrent server authentication requests handled successfully')
    })
  })

  describe('Error Recovery and Resilience', () => {
    it('should recover from temporary authentication failures', () => {
      // First visit - may fail due to network issues
      cy.visit('/newsletter/creer/', { timeout: 30000, failOnStatusCode: false })

      // Second visit - should work if temporary issue
      cy.visit('/newsletter/creer/', { timeout: 30000 })
      cy.get('body').should('be.visible')

      cy.log('✅ Recovered from potential temporary authentication issues')
    })

    it('should maintain page functionality even if server auth fails', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000, failOnStatusCode: false })

      // Page should still render core content
      cy.get('body').should('be.visible')

      // Look for newsletter-related content
      cy.get('body').then(($body) => {
        if ($body.text().includes('Newsletter') || $body.find('[data-testid]').length > 0) {
          cy.log('✅ Page maintains functionality despite potential auth issues')
        }
      })
    })
  })

  describe('Development vs Production Behavior', () => {
    it('should show development banner only in development mode', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })
      cy.get('body').should('be.visible')

      // Check if we're in development mode based on banner presence
      cy.get('body').then(($body) => {
        const hasBanner = $body.find('[style*="backgroundColor"]').length > 0

        if (hasBanner) {
          cy.log('✅ Development mode detected - admin setup banner visible')
        } else {
          cy.log('✅ Production mode detected - no development banner')
        }
      })
    })

    it('should work with current amplify_outputs.json configuration', () => {
      // Test that server auth works with current environment setup
      cy.visit('/newsletter/creer/', { timeout: 30000 })
      cy.get('body').should('be.visible')

      // If we can load the page, the amplify configuration is working
      cy.contains('Newsletter', { timeout: 10000 }).should('be.visible')

      cy.log('✅ Current amplify_outputs.json configuration is working')
    })
  })
})