/// <reference types="cypress" />

describe('Search Sign Up button and Footer', () => {

beforeEach(() => {
  cy.visit('/', {
    auth: { 
      username: Cypress.env('authUser'),
      password: Cypress.env('authPass'),
    },
  });
});

  it('Find "Sign Up" button by class', () => {
    // Search by class
    cy.get('.hero-descriptor_btn');
  });

  it('Check footer elements using different selector types', () => {

    // Search by multiple classes
    cy.get('.contacts_link.display-4')
      .should('have.attr', 'href', 'https://ithillel.ua');

    // Search by class
    cy.get('.contacts_link.h4');

    // Search by element (icon inside link)
    cy.get('.socials_link .icon-facebook');

    // Search by href attribute (exact match)
    cy.get('[href="https://t.me/ithillel_kyiv"]');

    // Search by href attribute (partial match)
    cy.get('[href*="www.youtube.com"]');

    // Search by tag + class + href part
    cy.get('a.socials_link[href*="instagram.com"]');

    // Find the last element via child selector
    cy.get('.socials_link:last-child');
  });
});