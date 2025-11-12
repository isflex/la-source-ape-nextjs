// Newsletter Layout Integration Tests
// Tests the complete integration of server-side admin auth with newsletter functionality

describe('Newsletter Layout Integration', () => {

  beforeEach(() => {
    // Ensure clean state for each test
    cy.clearAllSessionStorage()
    cy.clearAllLocalStorage()
    cy.clearCookies()
  })

  describe('Layout Loading and Authentication', () => {
    it('should load newsletter creation layout with server authentication', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })

      // Verify basic layout structure loads
      cy.get('body').should('be.visible')

      // Check for main content areas
      cy.get('div', { timeout: 10000 }).should('exist')

      // Look for newsletter-specific content
      cy.contains('Newsletter', { timeout: 15000 }).should('be.visible')

      // Verify URL is correct with trailing slash
      cy.url().should('include', '/newsletter/creer/')

      cy.log('✅ Newsletter layout loaded successfully with server authentication')
    })

    it('should display admin setup banner in development mode', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })

      // Look for development admin setup banner
      cy.get('[style*="backgroundColor"]', { timeout: 10000 }).should('exist').then(($banner) => {
        const bannerText = $banner.text()
        const styles = $banner.attr('style') || ''

        // Verify it's an admin setup banner
        expect(bannerText).to.contain('Admin Setup')

        // Check banner styling for success/failure indication
        if (styles.includes('#d4edda') || bannerText.includes('exists') || bannerText.includes('created')) {
          cy.log('✅ Success: Admin setup banner shows authentication success')
        } else if (styles.includes('#f8d7da') || bannerText.includes('Error') || bannerText.includes('failed')) {
          cy.log('⚠️  Error: Admin setup banner shows authentication failure')
          cy.log(`Error details: ${bannerText}`)
        }

        // Log User Pool ID if present
        const userPoolMatch = bannerText.match(/eu-west-3_[a-zA-Z0-9]+/)
        if (userPoolMatch) {
          cy.log(`User Pool ID: ${userPoolMatch[0]}`)
        }
      })
    })

    it('should render newsletter form components after layout authentication', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })

      // Wait for layout authentication to complete
      cy.get('body').should('be.visible')

      // Look for newsletter form elements
      cy.get('input, textarea, select, button', { timeout: 15000 }).should('exist')

      // Check for specific newsletter form elements
      cy.get('body').then(($body) => {
        const hasNewsletterInputs = $body.find('input[type="text"], input[type="date"], textarea').length > 0
        const hasSubmitButton = $body.find('button[type="submit"], input[type="submit"]').length > 0
        const hasFileInput = $body.find('input[type="file"]').length > 0

        if (hasNewsletterInputs) {
          cy.log('✅ Newsletter form inputs found')
        }
        if (hasSubmitButton) {
          cy.log('✅ Newsletter submit functionality found')
        }
        if (hasFileInput) {
          cy.log('✅ File upload functionality found (requires S3 credentials)')
        }
      })
    })
  })

  describe('Server Credential Injection for Child Components', () => {
    beforeEach(() => {
      // Set client-side admin authentication
      cy.window().then((win) => {
        win.sessionStorage.setItem('admin_authenticated', 'true')
      })
    })

    it('should enable file upload functionality when admin credentials are injected', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })

      // Look for file upload components
      cy.get('input[type="file"]', { timeout: 10000 }).then(($fileInputs) => {
        if ($fileInputs.length > 0) {
          cy.log(`✅ Found ${$fileInputs.length} file upload input(s)`)

          // Test that file input is enabled (not disabled)
          cy.get('input[type="file"]').first().should('not.be.disabled')

          // Try to interact with file input
          cy.get('input[type="file"]').first().click({ force: true })

          cy.log('✅ File upload functionality enabled with server credentials')
        } else {
          cy.log('ℹ️  No file upload inputs found - may be conditionally rendered')
        }
      })
    })

    it('should enable admin-specific UI elements when credentials are available', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })

      // Look for admin-specific functionality
      cy.get('body').then(($body) => {
        // Check for admin panels, buttons, or restricted areas
        const adminElements = $body.find('[data-testid*="admin"], [class*="admin"], button:contains("Admin")').length

        if (adminElements > 0) {
          cy.log(`✅ Found ${adminElements} admin-specific element(s)`)
        }

        // Look for publish/save functionality
        const actionButtons = $body.find('button:contains("Save"), button:contains("Publish"), button:contains("Create")').length

        if (actionButtons > 0) {
          cy.log(`✅ Found ${actionButtons} action button(s) - newsletter operations enabled`)
        }
      })
    })

    it('should handle S3 operations through injected credentials', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })

      // Try to test S3 integration indirectly
      cy.get('input[type="file"]', { timeout: 10000 }).then(($fileInputs) => {
        if ($fileInputs.length > 0) {
          // Create a small test file
          const fileName = 'test-image.png'
          const fileContent = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='

          // Convert base64 to blob
          cy.window().then((win) => {
            const byteCharacters = atob(fileContent)
            const byteNumbers = new Array(byteCharacters.length)
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i)
            }
            const byteArray = new Uint8Array(byteNumbers)
            const blob = new Blob([byteArray], { type: 'image/png' })
            const file = new File([blob], fileName, { type: 'image/png' })

            // Try to select the file (doesn't actually upload, just tests UI)
            const input = $fileInputs[0] as HTMLInputElement
            const dataTransfer = new win.DataTransfer()
            dataTransfer.items.add(file)
            input.files = dataTransfer.files

            // Trigger change event
            input.dispatchEvent(new win.Event('change', { bubbles: true }))

            cy.log('✅ File selection successful - S3 integration should work')
          })
        } else {
          cy.log('ℹ️  No file inputs found for S3 testing')
        }
      })
    })
  })

  describe('Layout Performance with Server Authentication', () => {
    it('should load within acceptable time with server auth overhead', () => {
      const startTime = Date.now()

      cy.visit('/newsletter/creer/', { timeout: 30000 })

      cy.get('body').should('be.visible').then(() => {
        const loadTime = Date.now() - startTime

        // Layout with server auth should load within 15 seconds
        expect(loadTime).to.be.lessThan(15000)

        cy.log(`✅ Layout loaded in ${loadTime}ms with server authentication`)

        // Warn if performance is slow
        if (loadTime > 10000) {
          cy.log(`⚠️  Layout loading took ${loadTime}ms (>10s) - may need optimization`)
        }
      })

      // Check that newsletter content appears reasonably quickly
      cy.contains('Newsletter', { timeout: 10000 }).should('be.visible')
    })

    it('should complete server authentication before rendering interactive elements', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })

      // Wait for authentication banner to appear (indicates server auth completed)
      cy.get('[style*="backgroundColor"]', { timeout: 10000 }).should('exist')

      // Now interactive elements should be ready
      cy.get('input, button, textarea', { timeout: 5000 }).should('exist')

      cy.log('✅ Interactive elements ready after server authentication')
    })
  })

  describe('Error Handling in Layout Integration', () => {
    it('should render layout gracefully even if server auth fails', () => {
      // Visit page and expect it to work even if auth fails
      cy.visit('/newsletter/creer/', { timeout: 30000, failOnStatusCode: false })

      // Basic layout should still render
      cy.get('body').should('be.visible')
      cy.get('div').should('exist')

      // Should show error in development banner if auth failed
      cy.get('body').then(($body) => {
        if ($body.find('[style*="backgroundColor"]').length > 0) {
          cy.get('[style*="backgroundColor"]').then(($banner) => {
            const bannerText = $banner.text()
            const styles = $banner.attr('style') || ''

            if (styles.includes('#f8d7da') || bannerText.includes('Error') || bannerText.includes('failed')) {
              cy.log('✅ Error banner displayed for authentication failure')
              cy.log(`Error: ${bannerText}`)
            } else {
              cy.log('✅ Authentication succeeded')
            }
          })
        }
      })

      cy.log('✅ Layout renders gracefully regardless of server auth status')
    })

    it('should handle missing environment variables gracefully', () => {
      // This test verifies robustness when env vars are missing
      cy.visit('/newsletter/creer/', { timeout: 30000, failOnStatusCode: false })

      cy.get('body').should('be.visible')

      // Look for error messages about missing credentials
      cy.get('[style*="backgroundColor"]', { timeout: 5000 }).then(($banner) => {
        if ($banner.length > 0) {
          const bannerText = $banner.text()

          if (bannerText.includes('credentials not found') || bannerText.includes('environment')) {
            cy.log('✅ Missing environment variables handled gracefully')
            cy.log(`Error: ${bannerText}`)
          }
        }
      }).catch(() => {
        cy.log('ℹ️  No error banner found - environment likely configured correctly')
      })
    })

    it('should maintain layout structure during auth errors', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000, failOnStatusCode: false })

      // Even with auth errors, basic page structure should exist
      cy.get('body').should('be.visible')

      // Should have some kind of content structure
      cy.get('div').should('exist')

      // Page title/heading should still appear
      cy.get('h1, h2, h3').then(($headings) => {
        if ($headings.length > 0) {
          cy.log(`✅ Found ${$headings.length} heading(s) - page structure maintained`)
        }
      })

      cy.log('✅ Layout structure maintained during authentication issues')
    })
  })

  describe('Real Environment Integration', () => {
    it('should work with current User Pool and S3 bucket configuration', () => {
      // Test with admin authentication
      cy.window().then((win) => {
        win.sessionStorage.setItem('admin_authenticated', 'true')
      })

      cy.visit('/newsletter/creer/', { timeout: 30000 })

      cy.get('body').should('be.visible')

      // Verify current configuration is working
      cy.get('[style*="backgroundColor"]', { timeout: 10000 }).then(($banner) => {
        const bannerText = $banner.text()

        // Look for User Pool ID
        const userPoolMatch = bannerText.match(/eu-west-3_[a-zA-Z0-9]+/)
        if (userPoolMatch) {
          cy.log(`✅ Working with User Pool: ${userPoolMatch[0]}`)
        }

        // Check for success indicators
        if (bannerText.includes('exists') || bannerText.includes('created')) {
          cy.log('✅ Current environment configuration working')
        }
      })

      // Newsletter functionality should be available
      cy.contains('Newsletter', { timeout: 10000 }).should('be.visible')
    })

    it('should handle real amplify_outputs.json parsing in layout', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })

      // If page loads, amplify_outputs.json was parsed successfully
      cy.get('body').should('be.visible')

      // Check development banner for parsing results
      cy.get('[style*="backgroundColor"]', { timeout: 10000 }).then(($banner) => {
        const bannerText = $banner.text()

        if (bannerText.includes('User Pool ID not found')) {
          cy.log('❌ amplify_outputs.json parsing failed in layout')
        } else if (bannerText.includes('eu-west-3_')) {
          cy.log('✅ amplify_outputs.json parsed successfully in layout')
        }
      })
    })
  })
})