// Custom commands for newsletter testing

Cypress.Commands.add('createTestNewsletter', (data: any = {}) => {
  const defaultData = {
    subject: 'Test Newsletter',
    eventDate: '2025-01-15T00:00:00+02:00',
    publicationDate: '2025-01-10T00:00:00+02:00',
    title: 'Test Title',
    greetings: 'Chers parents,',
    contentBlocks: [{
      type: 'LEFT_ALIGNED_TEXT',
      content: 'Default test content',
      order: 0
    }]
  }

  return cy.request({
    method: 'POST',
    url: '/api/newsletter/',
    body: { ...defaultData, ...data }
  })
})

Cypress.Commands.add('cleanupTestData', () => {
  // Clean up test newsletters
  cy.request('DELETE', '/api/newsletter/')
})

// Newsletter form helpers
Cypress.Commands.add('fillNewsletterForm', (data: any) => {
  if (data.subject) {
    cy.get('[data-testid="newsletter-subject"]').clear().type(data.subject)
  }
  if (data.eventDate) {
    cy.get('[data-testid="newsletter-event-date"]').clear().type(data.eventDate)
  }
  if (data.publicationDate) {
    cy.get('[data-testid="newsletter-publication-date"]').clear().type(data.publicationDate)
  }
  if (data.title) {
    cy.get('[data-testid="newsletter-title"]').clear().type(data.title)
  }
  if (data.greetings) {
    cy.get('[data-testid="newsletter-greetings"]').clear().type(data.greetings)
  }
})

Cypress.Commands.add('addContentBlock', (type: string, content: any = {}) => {
  cy.get('[data-testid="add-content-block"]').click()
  cy.get('[data-testid="content-block-type"]').select(type)

  switch (type) {
    case 'LEFT_ALIGNED_TEXT':
      if (content.text) {
        cy.get('[data-testid="content-block-text"]').type(content.text)
      }
      break
    case 'CENTERED_URL':
      if (content.url) {
        cy.get('[data-testid="content-block-url"]').type(content.url)
      }
      if (content.text) {
        cy.get('[data-testid="content-block-text"]').type(content.text)
      }
      break
    case 'CENTRED_IMAGE':
      if (content.file) {
        cy.get('[data-testid="content-block-file"]').selectFile(content.file)
      }
      break
  }
})

declare global {
  namespace Cypress {
    interface Chainable {
      createTestNewsletter(data?: any): Chainable<any>
      cleanupTestData(): Chainable<void>
      fillNewsletterForm(data: any): Chainable<void>
      addContentBlock(type: string, content?: any): Chainable<void>
      mockAmplifyAuth(): Chainable<void>
    }
  }
}