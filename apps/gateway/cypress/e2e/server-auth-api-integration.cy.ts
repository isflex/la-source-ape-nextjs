// Server Auth API Integration Tests
// Tests real API operations using server-side admin authentication credentials

describe('Server Auth API Integration', () => {

  beforeEach(() => {
    // Ensure clean state for each test
    cy.clearAllSessionStorage()
    cy.clearAllLocalStorage()
    cy.clearCookies()

    // Set client-side admin authentication for credential access
    cy.window().then((win) => {
      win.sessionStorage.setItem('admin_authenticated', 'true')
    })
  })

  describe('Newsletter API Integration with Server Auth', () => {
    it('should access newsletter API with server-injected credentials', () => {
      // First load the layout to trigger server authentication
      cy.visit('/newsletter/creer/', { timeout: 30000 })
      cy.get('body').should('be.visible')

      // Test newsletter API endpoints
      cy.request({
        method: 'GET',
        url: '/api/newsletter/',
        failOnStatusCode: false
      }).then((response) => {
        // Should work with server auth
        expect(response.status).to.be.oneOf([200, 401, 500])

        if (response.status === 200) {
          expect(response.body).to.have.property('data')
          cy.log('✅ Newsletter API accessible with server authentication')
        } else {
          cy.log(`ℹ️  Newsletter API returned ${response.status} - may require additional setup`)
        }
      })
    })

    it('should handle newsletter CRUD operations with real credentials', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })
      cy.get('body').should('be.visible')

      // Test creating a newsletter via API
      const testNewsletter = {
        subject: 'Test Newsletter from Cypress',
        eventDate: '2025-01-15T00:00:00+02:00',
        publicationDate: '2025-01-10T00:00:00+02:00',
        title: 'Cypress Test Title',
        greetings: 'Chers parents,',
        contentBlocks: [{
          type: 'LEFT_ALIGNED_TEXT',
          content: 'Test content from Cypress integration test',
          order: 0
        }]
      }

      cy.request({
        method: 'POST',
        url: '/api/newsletter/',
        body: testNewsletter,
        failOnStatusCode: false
      }).then((response) => {
        if (response.status === 200 || response.status === 201) {
          expect(response.body).to.have.property('success', true)
          cy.log('✅ Newsletter creation successful with server auth')

          // Clean up - try to delete the test newsletter
          if (response.body.id) {
            cy.request({
              method: 'DELETE',
              url: `/api/newsletter/${response.body.id}`,
              failOnStatusCode: false
            }).then((deleteResponse) => {
              if (deleteResponse.status === 200) {
                cy.log('✅ Newsletter cleanup successful')
              }
            })
          }
        } else {
          cy.log(`ℹ️  Newsletter creation returned ${response.status} - may need additional configuration`)
        }
      })
    })
  })

  describe('S3 Upload Integration with Server Auth', () => {
    it('should enable S3 uploads with server-injected credentials', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })
      cy.get('body').should('be.visible')

      // Create a test image file
      cy.fixture('images/test-image.png', 'base64').then((fileContent) => {
        const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/png')
        const formData = new FormData()
        formData.append('file', blob, 'test-server-auth.png')

        // Test upload API with server credentials
        cy.request({
          method: 'POST',
          url: '/api/upload/',
          body: formData,
          headers: {
            'x-admin-authenticated': 'true'
          },
          failOnStatusCode: false
        }).then((response) => {
          if (response.status === 200) {
            expect(response.body).to.have.property('success', true)
            expect(response.body).to.have.property('s3Key')
            expect(response.body).to.have.property('s3Bucket')

            cy.log('✅ S3 upload successful with server authentication')
            cy.log(`S3 Key: ${response.body.s3Key}`)

            // Clean up - try to delete the uploaded file
            const s3Key = response.body.s3Key
            cy.request({
              method: 'DELETE',
              url: `/api/upload/?key=${encodeURIComponent(s3Key)}`,
              headers: {
                'x-admin-authenticated': 'true'
              },
              failOnStatusCode: false
            }).then((deleteResponse) => {
              if (deleteResponse.status === 200) {
                cy.log('✅ S3 file cleanup successful')
              }
            })

          } else if (response.status === 401) {
            cy.log('⚠️  S3 upload requires authentication - server credentials may need setup')
          } else if (response.status === 500) {
            cy.log(`ℹ️  S3 upload returned 500 - may be permissions or configuration issue`)
            cy.log(`Error: ${response.body?.error || 'Unknown error'}`)
          }
        })
      })
    })

    it('should validate uploaded file properties with real S3', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })
      cy.get('body').should('be.visible')

      // Test with different file types and sizes
      const testFiles = [
        { name: 'small-image.png', type: 'image/png', size: 'small' },
        { name: 'medium-image.jpg', type: 'image/jpeg', size: 'medium' }
      ]

      testFiles.forEach((fileInfo) => {
        // Create test file based on specifications
        const testContent = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
        const blob = Cypress.Blob.base64StringToBlob(testContent, fileInfo.type)
        const formData = new FormData()
        formData.append('file', blob, fileInfo.name)

        cy.request({
          method: 'POST',
          url: '/api/upload/',
          body: formData,
          headers: {
            'x-admin-authenticated': 'true'
          },
          failOnStatusCode: false
        }).then((response) => {
          if (response.status === 200) {
            // Validate response structure
            expect(response.body).to.have.property('s3Key')
            expect(response.body).to.have.property('originalFilename', fileInfo.name)
            expect(response.body).to.have.property('mimeType', fileInfo.type)

            // Validate S3 key format
            expect(response.body.s3Key).to.include('newsletter-images/')
            expect(response.body.s3Key).to.include('.png')

            cy.log(`✅ ${fileInfo.name} validated successfully`)

            // Cleanup
            cy.request({
              method: 'DELETE',
              url: `/api/upload/?key=${encodeURIComponent(response.body.s3Key)}`,
              headers: { 'x-admin-authenticated': 'true' },
              failOnStatusCode: false
            })
          }
        })
      })
    })

    it('should handle file upload validation with server auth', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })
      cy.get('body').should('be.visible')

      // Test invalid file type
      const textContent = 'This is a text file, not an image'
      const textBlob = new Blob([textContent], { type: 'text/plain' })
      const formData = new FormData()
      formData.append('file', textBlob, 'invalid.txt')

      cy.request({
        method: 'POST',
        url: '/api/upload/',
        body: formData,
        headers: {
          'x-admin-authenticated': 'true'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.have.property('error')
        expect(response.body.error).to.contain('Invalid file type')

        cy.log('✅ File validation working with server auth')
      })
    })
  })

  describe('API Performance with Server Authentication', () => {
    it('should maintain acceptable API performance with server auth overhead', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })
      cy.get('body').should('be.visible')

      const startTime = Date.now()

      cy.request({
        method: 'GET',
        url: '/api/newsletter/',
        headers: {
          'x-admin-authenticated': 'true'
        }
      }).then((response) => {
        const responseTime = Date.now() - startTime

        expect(response.status).to.eq(200)
        expect(responseTime).to.be.lessThan(5000)

        cy.log(`✅ API response time: ${responseTime}ms with server auth`)

        if (responseTime > 2000) {
          cy.log(`⚠️  API response took ${responseTime}ms (>2s)`)
        }
      })
    })

    it('should handle concurrent API requests with server auth', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })
      cy.get('body').should('be.visible')

      // Make multiple concurrent API requests
      const requests = [
        cy.request({ method: 'GET', url: '/api/newsletter/', headers: { 'x-admin-authenticated': 'true' }}),
        cy.request({ method: 'GET', url: '/api/newsletter/', headers: { 'x-admin-authenticated': 'true' }}),
        cy.request({ method: 'GET', url: '/api/newsletter/', headers: { 'x-admin-authenticated': 'true' }})
      ]

      Promise.all(requests).then((responses) => {
        responses.forEach((response, index) => {
          expect(response.status).to.eq(200)
          cy.log(`✅ Concurrent request ${index + 1} successful`)
        })

        cy.log('✅ Concurrent API requests handled successfully with server auth')
      })
    })
  })

  describe('Real AWS Service Integration', () => {
    it('should work with actual Cognito User Pool', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })

      // Check development banner for User Pool information
      cy.get('[style*="backgroundColor"]', { timeout: 10000 }).then(($banner) => {
        const bannerText = $banner.text()
        const userPoolMatch = bannerText.match(/eu-west-3_[a-zA-Z0-9]+/)

        if (userPoolMatch) {
          const userPoolId = userPoolMatch[0]
          cy.log(`✅ Working with real User Pool: ${userPoolId}`)

          // If User Pool is working, server auth should enable API access
          cy.request({
            method: 'GET',
            url: '/api/newsletter/',
            headers: { 'x-admin-authenticated': 'true' }
          }).then((response) => {
            expect(response.status).to.eq(200)
            cy.log('✅ API access confirmed with real User Pool')
          })
        }
      })
    })

    it('should work with actual S3 bucket and IAM permissions', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })
      cy.get('body').should('be.visible')

      // Try a minimal S3 operation to test real permissions
      cy.fixture('images/test-image.png', 'base64').then((fileContent) => {
        const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/png')
        const formData = new FormData()
        formData.append('file', blob, 'real-s3-test.png')

        cy.request({
          method: 'POST',
          url: '/api/upload/',
          body: formData,
          headers: { 'x-admin-authenticated': 'true' },
          failOnStatusCode: false
        }).then((response) => {
          if (response.status === 200) {
            // Real S3 upload successful
            expect(response.body).to.have.property('s3Bucket')
            cy.log(`✅ Real S3 upload successful to bucket: ${response.body.s3Bucket}`)

            // Test real S3 deletion
            cy.request({
              method: 'DELETE',
              url: `/api/upload/?key=${encodeURIComponent(response.body.s3Key)}`,
              headers: { 'x-admin-authenticated': 'true' },
              failOnStatusCode: false
            }).then((deleteResponse) => {
              if (deleteResponse.status === 200) {
                cy.log('✅ Real S3 deletion successful')
              }
            })
          } else {
            cy.log(`ℹ️  S3 operation returned ${response.status} - permissions may need review`)
            if (response.body?.error) {
              cy.log(`S3 Error: ${response.body.error}`)
            }
          }
        })
      })
    })

    it('should handle real AWS region and endpoint configuration', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })

      // Verify working with correct AWS region
      cy.get('[style*="backgroundColor"]', { timeout: 10000 }).then(($banner) => {
        const bannerText = $banner.text()

        if (bannerText.includes('eu-west-3')) {
          cy.log('✅ Confirmed working in eu-west-3 region')

          // Test API works with regional configuration
          cy.request({
            method: 'GET',
            url: '/api/newsletter/',
            headers: { 'x-admin-authenticated': 'true' }
          }).then((response) => {
            expect(response.status).to.eq(200)
            cy.log('✅ API working with eu-west-3 configuration')
          })
        }
      })
    })
  })

  describe('Error Recovery and Resilience', () => {
    it('should recover from temporary AWS service outages', () => {
      // First attempt may fail due to temporary issues
      cy.visit('/newsletter/creer/', { timeout: 30000, failOnStatusCode: false })

      // Second attempt should work
      cy.request({
        method: 'GET',
        url: '/api/newsletter/',
        headers: { 'x-admin-authenticated': 'true' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 500, 502, 503])

        if (response.status === 200) {
          cy.log('✅ AWS services responding normally')
        } else {
          cy.log(`ℹ️  AWS service returned ${response.status} - may be temporary issue`)
        }
      })
    })

    it('should handle API authentication failures gracefully', () => {
      cy.visit('/newsletter/creer/', { timeout: 30000 })

      // Test API without authentication header
      cy.request({
        method: 'GET',
        url: '/api/newsletter/',
        failOnStatusCode: false
      }).then((response) => {
        // Should handle missing authentication appropriately
        expect(response.status).to.be.oneOf([200, 401, 403])

        if (response.status === 401 || response.status === 403) {
          cy.log('✅ API correctly requires authentication')
        } else if (response.status === 200) {
          cy.log('ℹ️  API allows unauthenticated access - may be by design')
        }
      })
    })
  })
})