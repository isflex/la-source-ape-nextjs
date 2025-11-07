// TDD Tests for Newsletter Models - Schema & Database Operations

describe('Newsletter Model Schema Tests', () => {
  beforeEach(() => {
    cy.cleanupTestData()
  })

  afterEach(() => {
    cy.cleanupTestData()
  })

  describe('Newsletter Model Validation', () => {
    it('should require eventDate field', () => {
      cy.request({
        method: 'POST',
        url: '/api/newsletter',
        body: {
          subject: 'Test Newsletter',
          publicationDate: '2025-01-10T00:00:00+02:00'
          // eventDate missing
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.include('eventDate is required')
      })
    })

    it('should require subject field with unique constraint', () => {
      const newsletterData = {
        subject: 'Unique Test Newsletter',
        eventDate: '2025-01-15T00:00:00+02:00',
        publicationDate: '2025-01-10T00:00:00+02:00'
      }

      // Create first newsletter
      cy.createTestNewsletter(newsletterData).then(() => {
        // Try to create duplicate
        cy.request({
          method: 'POST',
          url: '/api/newsletter',
          body: newsletterData,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.error).to.include('subject must be unique')
        })
      })
    })

    it('should auto-generate slug from subject', () => {
      cy.createTestNewsletter({
        subject: 'Café des Parents - Janvier 2025'
      }).then((response) => {
        expect(response.body.data.slug).to.eq('cafe-des-parents-janvier-2025')
      })
    })

    it('should validate publicationDate <= eventDate', () => {
      cy.request({
        method: 'POST',
        url: '/api/newsletter',
        body: {
          subject: 'Invalid Date Test',
          eventDate: '2025-01-10T00:00:00+02:00',
          publicationDate: '2025-01-15T00:00:00+02:00' // After event date
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.include('publication date cannot be after event date')
      })
    })

    it('should handle duplicate subjects with numeric suffix', () => {
      const baseSubject = 'Monthly Newsletter'

      // Create first newsletter
      cy.createTestNewsletter({ subject: baseSubject }).then(() => {
        // Create second with same subject
        cy.createTestNewsletter({ subject: baseSubject }).then((response) => {
          expect(response.body.data.subject).to.eq('Monthly Newsletter (2)')
          expect(response.body.data.slug).to.eq('monthly-newsletter-2')
        })
      })
    })
  })

  describe('ContentBlock Model Validation', () => {
    it('should require newsletterId and type fields', () => {
      cy.request({
        method: 'POST',
        url: '/api/content-block',
        body: {
          content: 'Test content'
          // Missing newsletterId and type
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.include('newsletterId is required')
        expect(response.body.error).to.include('type is required')
      })
    })

    it('should validate required fields per EContentBlockType', () => {
      cy.createTestNewsletter().then((newsletter) => {
        // Test CENTERED_URL requires href
        cy.request({
          method: 'POST',
          url: '/api/content-block',
          body: {
            newsletterId: newsletter.body.data.id,
            type: 'CENTERED_URL',
            content: 'Click here'
            // Missing href
          },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.error).to.include('href is required for URL types')
        })
      })
    })

    it('should validate file fields for image types', () => {
      cy.createTestNewsletter().then((newsletter) => {
        cy.request({
          method: 'POST',
          url: '/api/content-block',
          body: {
            newsletterId: newsletter.body.data.id,
            type: 'CENTRED_IMAGE',
            content: 'base64content'
            // Missing filename, filetype, encoding
          },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.error).to.include('filename, filetype, and encoding are required for image types')
        })
      })
    })
  })

  describe('Newsletter API Operations', () => {
    it('should create newsletter with content blocks', () => {
      const newsletterData = {
        subject: 'Complete Newsletter Test',
        eventDate: '2025-02-15T00:00:00+02:00',
        publicationDate: '2025-02-10T00:00:00+02:00',
        title: 'Test Newsletter',
        greetings: 'Chers parents,',
        contentBlocks: [
          {
            type: 'LEFT_ALIGNED_TEXT',
            content: 'Welcome to our newsletter!',
            order: 0
          },
          {
            type: 'CENTERED_URL',
            content: 'Visit our website',
            href: 'https://example.com',
            order: 1
          }
        ]
      }

      cy.request({
        method: 'POST',
        url: '/api/newsletter',
        body: newsletterData
      }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.data.subject).to.eq(newsletterData.subject)
        expect(response.body.data.contentBlocks).to.have.length(2)
        expect(response.body.data.slug).to.eq('complete-newsletter-test')
      })
    })

    it('should soft delete newsletters', () => {
      cy.createTestNewsletter().then((newsletter) => {
        const id = newsletter.body.data.id

        cy.request({
          method: 'DELETE',
          url: `/api/newsletter/${id}`
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.data.isDeleted).to.be.true
        })

        // Verify it's not in active list
        cy.request('/api/newsletter').then((response) => {
          const activeNewsletters = response.body.data
          expect(activeNewsletters.find((n: any) => n.id === id)).to.be.undefined
        })
      })
    })
  })
})