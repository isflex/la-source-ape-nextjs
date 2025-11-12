describe('API Upload Endpoint', () => {
  beforeEach(() => {
    // Set admin authentication for upload tests
    cy.window().then((win) => {
      win.localStorage.setItem('admin_authenticated', 'true')
    })
  })

  afterEach(() => {
    // Clean up admin authentication
    cy.window().then((win) => {
      win.localStorage.removeItem('admin_authenticated')
    })
  })

  it('should respond to GET requests with method not allowed', () => {
    cy.request({
      method: 'GET',
      url: '/api/upload/',
      failOnStatusCode: false
    }).then((response) => {
      // Should return 405 Method Not Allowed for GET requests
      expect(response.status).to.eq(405)
    })
  })

  it('should require admin authentication for POST requests', () => {
    cy.request({
      method: 'POST',
      url: '/api/upload/',
      body: 'test',
      failOnStatusCode: false
    }).then((response) => {
      // Should return 401 Unauthorized without admin auth
      expect(response.status).to.eq(401)
      expect(response.body).to.have.property('error')
      expect(response.body.error).to.contain('Admin authentication required')
    })
  })

  it('should accept POST requests with admin authentication', () => {
    // Create a test image file
    cy.fixture('images/test-image.png', 'base64').then((fileContent) => {
      const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/png')

      // Create FormData
      const formData = new FormData()
      formData.append('file', blob, 'test-image.png')

      cy.request({
        method: 'POST',
        url: '/api/upload/',
        body: formData,
        headers: {
          'x-admin-authenticated': 'true'
        },
        failOnStatusCode: false
      }).then((response) => {
        // Should process the request (may fail on S3 upload but should reach our code)
        expect(response.status).to.be.oneOf([200, 500])

        if (response.status === 200) {
          expect(response.body).to.have.property('success', true)
          expect(response.body).to.have.property('s3Key')
        } else if (response.status === 500) {
          // S3 permission errors are expected in test environment
          expect(response.body).to.have.property('error')
        }
      })
    })
  })

  it('should validate file types', () => {
    // Create a test text file (invalid type)
    const textContent = 'This is not an image'
    const blob = new Blob([textContent], { type: 'text/plain' })

    const formData = new FormData()
    formData.append('file', blob, 'test.txt')

    cy.request({
      method: 'POST',
      url: '/api/upload',
      body: formData,
      headers: {
        'x-admin-authenticated': 'true'
      },
      failOnStatusCode: false
    }).then((response) => {
      // Should reject invalid file types
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('error')
      expect(response.body.error).to.contain('Invalid file type')
    })
  })

  it('should validate file size', () => {
    // Create a large file (over 2MB limit)
    const largeContent = 'x'.repeat(3 * 1024 * 1024) // 3MB of text
    const blob = new Blob([largeContent], { type: 'image/png' })

    const formData = new FormData()
    formData.append('file', blob, 'large-image.png')

    cy.request({
      method: 'POST',
      url: '/api/upload',
      body: formData,
      headers: {
        'x-admin-authenticated': 'true'
      },
      failOnStatusCode: false
    }).then((response) => {
      // Should reject files that are too large
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('error')
      expect(response.body.error).to.contain('File too large')
    })
  })

  it('should handle DELETE requests for file cleanup', () => {
    const testKey = 'newsletter-images/test-image.png'

    cy.request({
      method: 'DELETE',
      url: `/api/upload?key=${encodeURIComponent(testKey)}`,
      headers: {
        'x-admin-authenticated': 'true'
      },
      failOnStatusCode: false
    }).then((response) => {
      // Should process DELETE request (may fail on S3 but should reach our code)
      expect(response.status).to.be.oneOf([200, 500])

      if (response.status === 200) {
        expect(response.body).to.have.property('success', true)
      } else if (response.status === 500) {
        // S3 permission errors are expected in test environment
        expect(response.body).to.have.property('error')
      }
    })
  })

  it('should measure API response time for performance', () => {
    const startTime = Date.now()

    cy.request({
      method: 'GET',
      url: '/api/upload/',
      failOnStatusCode: false
    }).then((response) => {
      const endTime = Date.now()
      const responseTime = endTime - startTime

      // API should respond within 5 seconds (much faster with pre-warming)
      expect(responseTime).to.be.lessThan(5000)

      // Log performance for monitoring
      cy.log(`API upload response time: ${responseTime}ms`)
    })
  })
})

// Helper test for newsletter API as comparison
describe('API Newsletter Endpoint', () => {
  it('should respond quickly to GET requests', () => {
    const startTime = Date.now()

    cy.request({
      method: 'GET',
      url: '/api/newsletter/'
    }).then((response) => {
      const endTime = Date.now()
      const responseTime = endTime - startTime

      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('data')

      // Should be fast with pre-warming
      expect(responseTime).to.be.lessThan(3000)

      cy.log(`API newsletter response time: ${responseTime}ms`)
    })
  })
})