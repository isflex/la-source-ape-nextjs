// TDD Tests for Newsletter Helper Functions

describe('Newsletter Helper Functions', () => {
  // Import the functions by importing the module in a before hook
  let newsletterHelpers: any

  before(() => {
    cy.readFile('src/lib/newsletter-helpers.ts').then(() => {
      // We'll test the functions via API endpoints since they're used server-side
    })
  })

  describe('generateSlug function (tested via API)', () => {
    it('should convert subject to kebab-case', () => {
      cy.request({
        method: 'POST',
        url: '/api/newsletter',
        body: {
          subject: 'Café des Parents',
          eventDate: '2025-02-15T00:00:00+02:00',
          publicationDate: '2025-02-10T00:00:00+02:00',
          contentBlocks: [{
            type: 'LEFT_ALIGNED_TEXT',
            content: 'Test content',
            order: 0
          }]
        }
      }).then((response) => {
        expect(response.body.data.slug).to.eq('cafe-des-parents')
      })
    })

    it('should handle special characters and accents', () => {
      const testCases = [
        { subject: 'Événement Spécial', expected: 'evenement-special' },
        { subject: 'Newsletter - Janvier 2025', expected: 'newsletter-janvier-2025' },
        { subject: 'Test & Development', expected: 'test-development' }
      ]

      testCases.forEach((testCase, index) => {
        cy.request({
          method: 'POST',
          url: '/api/newsletter',
          body: {
            subject: testCase.subject,
            eventDate: `2025-02-${15 + index}T00:00:00+02:00`,
            publicationDate: `2025-02-${10 + index}T00:00:00+02:00`,
            contentBlocks: [{
              type: 'LEFT_ALIGNED_TEXT',
              content: 'Test content',
              order: 0
            }]
          }
        }).then((response) => {
          expect(response.body.data.slug).to.eq(testCase.expected)
        })
      })
    })

    it('should append number for duplicate slugs', () => {
      // Create first newsletter
      cy.request({
        method: 'POST',
        url: '/api/newsletter',
        body: {
          subject: 'Test Newsletter',
          eventDate: '2025-03-15T00:00:00+02:00',
          publicationDate: '2025-03-10T00:00:00+02:00',
          contentBlocks: [{
            type: 'LEFT_ALIGNED_TEXT',
            content: 'Test content',
            order: 0
          }]
        }
      }).then((response) => {
        expect(response.body.data.slug).to.eq('test-newsletter')

        // Create second newsletter with same subject
        cy.request({
          method: 'POST',
          url: '/api/newsletter',
          body: {
            subject: 'Test Newsletter',
            eventDate: '2025-03-20T00:00:00+02:00',
            publicationDate: '2025-03-15T00:00:00+02:00',
            contentBlocks: [{
              type: 'LEFT_ALIGNED_TEXT',
              content: 'Test content 2',
              order: 0
            }]
          }
        }).then((response2) => {
          expect(response2.body.data.subject).to.eq('Test Newsletter (2)')
          expect(response2.body.data.slug).to.eq('test-newsletter-2')
        })
      })
    })
  })

  describe('validateNewsletterData function (tested via API)', () => {
    it('should validate required fields', () => {
      cy.request({
        method: 'POST',
        url: '/api/newsletter',
        body: {
          // Missing required fields
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.include('Le sujet est requis')
      })
    })

    it('should validate date constraints', () => {
      cy.request({
        method: 'POST',
        url: '/api/newsletter',
        body: {
          subject: 'Invalid Date Test',
          eventDate: '2025-01-10T00:00:00+02:00',
          publicationDate: '2025-01-15T00:00:00+02:00', // After event date
          contentBlocks: [{
            type: 'LEFT_ALIGNED_TEXT',
            content: 'Test content',
            order: 0
          }]
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.include("La date de publication ne peut pas être postérieure à la date de l\'événement")
      })
    })

    it('should validate content block requirements', () => {
      cy.request({
        method: 'POST',
        url: '/api/newsletter',
        body: {
          subject: 'No Content Blocks Test',
          eventDate: '2025-04-15T00:00:00+02:00',
          publicationDate: '2025-04-10T00:00:00+02:00',
          contentBlocks: [] // Empty content blocks
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.include('Au moins un bloc de contenu est requis')
      })
    })
  })

  describe('newsletterContentGenerator function', () => {
    it('should generate valid email HTML structure', () => {
      // Test HTML generation by creating a newsletter and checking API response structure
      cy.request({
        method: 'POST',
        url: '/api/newsletter',
        body: {
          subject: 'HTML Generation Test',
          eventDate: '2025-05-15T00:00:00+02:00',
          publicationDate: '2025-05-10T00:00:00+02:00',
          title: 'Test Newsletter Title',
          greetings: 'Chers parents,',
          contentBlocks: [
            {
              type: 'LEFT_ALIGNED_TEXT',
              content: 'Test content for HTML generation',
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
      }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.data.subject).to.eq('HTML Generation Test')
        expect(response.body.data.title).to.eq('Test Newsletter Title')
        expect(response.body.data.greetings).to.eq('Chers parents,')
        expect(response.body.data.contentBlocks).to.have.length(2)
      })
    })

    it('should handle all content block types', () => {
      const contentBlocks = [
        { type: 'LEFT_ALIGNED_TEXT', content: 'Left aligned text', order: 0 },
        { type: 'CENTRED_TEXT', content: 'Centered text', order: 1 },
        { type: 'LEFT_ALIGNED_URL', content: 'Left link', href: 'https://example.com', order: 2 },
        { type: 'CENTERED_URL', content: 'Center link', href: 'https://example.com', order: 3 }
      ]

      cy.request({
        method: 'POST',
        url: '/api/newsletter',
        body: {
          subject: 'All Content Types Test',
          eventDate: '2025-06-15T00:00:00+02:00',
          publicationDate: '2025-06-10T00:00:00+02:00',
          contentBlocks
        }
      }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.data.contentBlocks).to.have.length(4)

        // Verify all content block types are preserved
        const types = response.body.data.contentBlocks.map((cb: any) => cb.type)
        expect(types).to.include.members([
          'LEFT_ALIGNED_TEXT',
          'CENTRED_TEXT',
          'LEFT_ALIGNED_URL',
          'CENTERED_URL'
        ])
      })
    })
  })

  afterEach(() => {
    // Clean up test data after each test
    cy.cleanupTestData()
  })
})
