/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

let userData;
let email;
let password;

describe('Registration and Login tests', () => {
  beforeEach(() => {
    userData = {
      firstName: faker.string.alpha({ length: { min: 2, max: 20 } }),
      lastName: faker.string.alpha({ length: { min: 2, max: 20 } }),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password({
        length: 10,
        memorable: true,
        pattern: /[A-Za-z0-9]/,
        prefix: 'Qw1',
      }),
    };
    cy.visit('/', {
      auth: {
        username: Cypress.env('authUser'),
        password: Cypress.env('authPass'),
      },
    });
  });

  it('Registration user', () => {
    cy.url().should('include', 'qauto.forstudy.space');
    cy.get('.header_right > .btn').click();
    cy.contains('.modal-header', 'Log in');
    cy.contains('button', 'Registration').click();
    cy.contains('.modal-header', 'Registration');
    cy.get('#signupName').clear().type(userData.firstName).should('have.value', userData.firstName);

    cy.get('[name="lastName"]')
      .clear()
      .type(userData.lastName)
      .should('have.value', userData.lastName);

    cy.get('[formcontrolname="email"]')
      .clear()
      .type(userData.email)
      .should('have.value', userData.email);

    cy.get('#signupPassword')
      .clear()
      .type(userData.password, { sensitive: true })
      .invoke('val')
      .then(val => {
        expect(val).to.eq(userData.password);
      });

    cy.get('#signupRepeatPassword')
      .clear()
      .type(userData.password, { sensitive: true })
      .invoke('val')
      .then(val => {
        expect(val).to.eq(userData.password);
      });

    email = userData.email;
    password = userData.password;

    cy.contains('button', 'Register').click();
  });

  it('Login user', () => {
    cy.url().should('include', 'qauto.forstudy.space');
    cy.get('.header_right > .btn').click();
    cy.contains('.modal-header', 'Log in');
    cy.get('#signinEmail').clear().type(email).should('have.value', email);

    cy.get('#signinPassword')
      .clear()
      .type(password)
      .invoke('val')
      .then(val => {
        expect(val).to.eq(password);
      });
    cy.contains('button', 'Login').click();
    cy.url().should('include', '/garage');

    cy.get('.alert.alert-success')
      .should('be.visible')
      .and('contain.text', 'You have been successfully logged in');
    cy.get('#userNavDropdown').click();

    cy.get('.user-nav_menu .dropdown-item').contains('Logout').click();
  });

  // === Name field tests ===
  it('Checking validation "Name" Empty field - "Name is required"', () => {
    cy.url().should('include', 'qauto.forstudy.space');
    cy.contains('button', 'Sign up').click();
    cy.contains('.modal-header', 'Registration');

    cy.get('#signupName').clear().focus().blur();

    cy.get('[name="lastName"]')
      .clear()
      .type(userData.lastName)
      .should('have.value', userData.lastName);

    cy.get('[formcontrolname="email"]')
      .clear()
      .type(userData.email)
      .should('have.value', userData.email);

    cy.get('#signupPassword')
      .clear()
      .type(userData.password)
      .invoke('val')
      .then(val => {
        expect(val).to.eq(userData.password);
      });

    cy.get('#signupRepeatPassword')
      .clear()
      .type(userData.password)
      .invoke('val')
      .then(val => {
        expect(val).to.eq(userData.password);
      });

    cy.get('.invalid-feedback').contains('Name required').should('be.visible');

    cy.contains('button', 'Register').should('be.disabled');
  });

  it('Checking validation "Name" Wrong data - "Name is invalid"', () => {
    cy.url().should('include', 'qauto.forstudy.space');
    cy.contains('button', 'Sign up').click();
    cy.contains('.modal-header', 'Registration');
    cy.get('#signupName').clear().type('!233').should('have.value', '!233');

    cy.get('[name="lastName"]')
      .clear()
      .type(userData.lastName)
      .should('have.value', userData.lastName);

    cy.get('[formcontrolname="email"]')
      .clear()
      .type(userData.email)
      .should('have.value', userData.email);

    cy.get('#signupPassword')
      .clear()
      .type(userData.password)
      .invoke('val')
      .then(val => {
        expect(val).to.eq(userData.password);
      });

    cy.get('#signupRepeatPassword')
      .clear()
      .type(userData.password)
      .invoke('val')
      .then(val => {
        expect(val).to.eq(userData.password);
      });

    cy.get('.invalid-feedback').contains('Name is invalid').should('be.visible');

    cy.get('#signupName').should('have.css', 'border-color', 'rgb(220, 53, 69)');

    cy.contains('button', 'Register').should('be.disabled');
  });

  it('Should accept a valid name', () => {
    cy.url().should('include', 'qauto.forstudy.space');
    cy.contains('button', 'Sign up').click();
    cy.contains('.modal-header', 'Registration');
    cy.get('#signupName').clear().type(userData.firstName).should('have.value', userData.firstName);

    cy.get('[name="lastName"]')
      .clear()
      .type(userData.lastName)
      .should('have.value', userData.lastName);

    cy.get('[formcontrolname="email"]')
      .clear()
      .type(userData.email)
      .should('have.value', userData.email);

    cy.get('#signupPassword')
      .clear()
      .type(userData.password)
      .invoke('val')
      .then(val => {
        expect(val).to.eq(userData.password);
      });

    cy.get('#signupRepeatPassword')
      .clear()
      .type(userData.password)
      .invoke('val')
      .then(val => {
        expect(val).to.eq(userData.password);
      });

    cy.get('.invalid-feedback').should('not.exist');

    cy.get('#signupName').should('not.have.css', 'border-color', 'rgb(220, 53, 69)');

    cy.contains('button', 'Register').should('not.be.disabled');

  });

  // === Lats Name field tests === 
  it('Checking validation "Lats Name" Wrong length - "Last name has to be from 2 to 20 characters long"', () => {
    cy.url().should('include', 'qauto.forstudy.space');
    cy.contains('button', 'Sign up').click();
    cy.contains('.modal-header', 'Registration');
    cy.get('#signupName').clear().type(userData.firstName).should('have.value', userData.firstName);

    cy.get('[name="lastName"]')
      .clear()
      .type('AlexanderTheGreatHero')
      .should('have.value', 'AlexanderTheGreatHero');

    cy.get('[formcontrolname="email"]')
      .clear()
      .type(userData.email)
      .should('have.value', userData.email);

    cy.get('#signupPassword')
      .clear()
      .type(userData.password)
      .invoke('val')
      .then(val => {
        expect(val).to.eq(userData.password);
      });

    cy.get('#signupRepeatPassword')
      .clear()
      .type(userData.password)
      .invoke('val')
      .then(val => {
        expect(val).to.eq(userData.password);
      });

    cy.get('.invalid-feedback')
      .contains('Last name has to be from 2 to 20 characters long')
      .should('be.visible');

    cy.get('[name="lastName"]').should('have.css', 'border-color', 'rgb(220, 53, 69)');

    cy.contains('button', 'Register').should('be.disabled');
  });

  it('Checking validation "Lats Name" Wrong data - "Last name is invalid"', () => {
    cy.url().should('include', 'qauto.forstudy.space');
    cy.contains('button', 'Sign up').click();
    cy.contains('.modal-header', 'Registration');
    cy.get('#signupName').clear().type(userData.firstName).should('have.value', userData.firstName);

    cy.get('[name="lastName"]').clear().type('Dora-cal').should('have.value', 'Dora-cal');

    cy.get('[formcontrolname="email"]')
      .clear()
      .type(userData.email)
      .should('have.value', userData.email);

    cy.get('#signupPassword')
      .clear()
      .type(userData.password)
      .invoke('val')
      .then(val => {
        expect(val).to.eq(userData.password);
      });

    cy.get('#signupRepeatPassword')
      .clear()
      .type(userData.password)
      .invoke('val')
      .then(val => {
        expect(val).to.eq(userData.password);
      });

    cy.get('.invalid-feedback').contains('Last name is invalid').should('be.visible');

    cy.get('[name="lastName"]').should('have.css', 'border-color', 'rgb(220, 53, 69)');

    cy.contains('button', 'Register').should('be.disabled');
  });

  it('Should accept a valid last name', () => {
    cy.url().should('include', 'qauto.forstudy.space');

    cy.contains('button', 'Sign up').click();
    cy.contains('.modal-header', 'Registration');
    cy.get('#signupName').clear().type(userData.firstName).should('have.value', userData.firstName);

    cy.get('[name="lastName"]')
      .clear()
      .type(userData.lastName)
      .should('have.value', userData.lastName);

    cy.get('[formcontrolname="email"]')
      .clear()
      .type(userData.email)
      .should('have.value', userData.email);

    cy.get('#signupPassword')
      .clear()
      .type(userData.password)
      .invoke('val')
      .then(val => {
        expect(val).to.eq(userData.password);
      });

    cy.get('#signupRepeatPassword')
      .clear()
      .type(userData.password)
      .invoke('val')
      .then(val => {
        expect(val).to.eq(userData.password);
      });

    cy.get('.invalid-feedback').should('not.exist');

    cy.get('[name="lastName"]').should('not.have.css', 'border-color', 'rgb(220, 53, 69)');

    cy.contains('button', 'Register').should('not.be.disabled');
  });

  // === Email field tests === 
  it('Checking validation "Email" For empty field - "Email required"', () => {
    cy.url().should('include', 'qauto.forstudy.space');

    cy.contains('button', 'Sign up').click();
    cy.contains('.modal-header', 'Registration');
    cy.get('#signupName').type(userData.firstName).should('have.value', userData.firstName);

    cy.get('[name="lastName"]')
      .clear()
      .type(userData.lastName)
      .should('have.value', userData.lastName);

    cy.get('[formcontrolname="email"]').focus().clear();

    cy.get('#signupPassword')
      .clear()
      .type(userData.password)
      .invoke('val')
      .then(val => {
        expect(val).to.eq(userData.password);
      });

    cy.get('#signupRepeatPassword')
      .clear()
      .type(userData.password)
      .invoke('val')
      .then(val => {
        expect(val).to.eq(userData.password);
      });

    cy.get('.invalid-feedback').contains('Email required').should('be.visible');

    cy.get('[formcontrolname="email"]').should('have.css', 'border-color', 'rgb(220, 53, 69)');

    cy.contains('button', 'Register').should('be.disabled');
  });

  it('Checking validation "Email" Wrong data - "Email is incorrect"', () => {
    cy.url().should('include', 'qauto.forstudy.space');

    cy.contains('button', 'Sign up').click();
    cy.contains('.modal-header', 'Registration');
    cy.get('#signupName').type(userData.firstName).should('have.value', userData.firstName);

    cy.get('[name="lastName"]')
      .clear()
      .type(userData.lastName)
      .should('have.value', userData.lastName);

    cy.get('[formcontrolname="email"]')
      .clear()
      .type('123mail.com')
      .should('have.value', '123mail.com');

    cy.get('#signupPassword')
      .clear()
      .type(userData.password)
      .invoke('val')
      .then(val => {
        expect(val).to.eq(userData.password);
      });

    cy.get('#signupRepeatPassword')
      .clear()
      .type(userData.password)
      .invoke('val')
      .then(val => {
        expect(val).to.eq(userData.password);
      });

    cy.get('.invalid-feedback').contains('Email is incorrect').should('be.visible');

    cy.get('[formcontrolname="email"]').should('have.css', 'border-color', 'rgb(220, 53, 69)');

    cy.contains('button', 'Register').should('be.disabled');
  });

  it('Should accept a valid Email', () => {
    cy.url().should('include', 'qauto.forstudy.space');

    cy.contains('button', 'Sign up').click();
    cy.contains('.modal-header', 'Registration');
    cy.get('#signupName').clear().type(userData.firstName).should('have.value', userData.firstName);

    cy.get('[name="lastName"]')
      .clear()
      .type(userData.lastName)
      .should('have.value', userData.lastName);

    cy.get('[formcontrolname="email"]')
      .clear()
      .type(userData.email)
      .should('have.value', userData.email);

    cy.get('#signupPassword')
      .clear()
      .type(userData.password)
      .invoke('val')
      .then(val => {
        expect(val).to.eq(userData.password);
      });

    cy.get('#signupRepeatPassword')
      .clear()
      .type(userData.password)
      .invoke('val')
      .then(val => {
        expect(val).to.eq(userData.password);
      });

    cy.get('.invalid-feedback').should('not.exist');

    cy.get('[formcontrolname="email"]').should('not.have.css', 'border-color', 'rgb(220, 53, 69)');

    cy.contains('button', 'Register').should('not.be.disabled');

  });

  // === Password field tests ===
  it('Checking validation "Password " For empty field error - "Password required"', () => {
    cy.url().should('include', 'qauto.forstudy.space');
    cy.contains('button', 'Sign up').click();
    cy.contains('.modal-header', 'Registration');

    cy.get('#signupName').type(userData.firstName).should('have.value', userData.firstName);

    cy.get('[name="lastName"]')
      .clear()
      .type(userData.lastName)
      .should('have.value', userData.lastName);

    cy.get('[formcontrolname="email"]')
      .clear()
      .type(userData.email)
      .should('have.value', userData.email);

    cy.get('#signupPassword').focus().clear();

    cy.get('#signupRepeatPassword')
      .clear()
      .type(userData.password)
      .invoke('val')
      .then(val => {
        expect(val).to.eq(userData.password);
      });

    cy.get('.invalid-feedback').contains('Password required').should('be.visible');

    cy.get('#signupPassword').should('have.css', 'border-color', 'rgb(220, 53, 69)');

    cy.contains('button', 'Register').should('be.disabled');
  });

  it('Checking validation "Password " Wrong data - "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"', () => {
    cy.url().should('include', 'qauto.forstudy.space');
    cy.contains('button', 'Sign up').click();
    cy.contains('.modal-header', 'Registration');

    cy.get('#signupName').type(userData.firstName).should('have.value', userData.firstName);

    cy.get('[name="lastName"]')
      .clear()
      .type(userData.lastName)
      .should('have.value', userData.lastName);

    cy.get('[formcontrolname="email"]')
      .clear()
      .type(userData.email)
      .should('have.value', userData.email);

    cy.get('#signupPassword')
      .clear()
      .type('Qwerqwerqwerqwerqwer')
      .should('have.value', 'Qwerqwerqwerqwerqwer');

    cy.get('#signupRepeatPassword')
      .clear()
      .type(userData.password)
      .invoke('val')
      .then(val => {
        expect(val).to.eq(userData.password);
      });

    cy.get('.invalid-feedback')
      .contains(
        'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter'
      )
      .should('be.visible');

    cy.get('#signupPassword').should('have.css', 'border-color', 'rgb(220, 53, 69)');

    cy.contains('button', 'Register').should('be.disabled');
  });

  // === Re-enter password field tests === 
  it('Checking validation "Re-enter password" For empty field error - "Re-enter password required"', () => {
    cy.url().should('include', 'qauto.forstudy.space');
    cy.contains('button', 'Sign up').click();
    cy.contains('.modal-header', 'Registration');

    cy.get('#signupName').type(userData.firstName).should('have.value', userData.firstName);

    cy.get('[name="lastName"]')
      .clear()
      .type(userData.lastName)
      .should('have.value', userData.lastName);

    cy.get('[formcontrolname="email"]')
      .clear()
      .type(userData.email)
      .should('have.value', userData.email);

    cy.get('#signupPassword')
      .clear()
      .type(userData.password)
      .should('have.value', userData.password);

    cy.get('#signupRepeatPassword').focus().clear().blur();

    cy.get('.invalid-feedback').contains('Re-enter password required').should('be.visible');

    cy.get('#signupRepeatPassword').should('have.css', 'border-color', 'rgb(220, 53, 69)');

    cy.contains('button', 'Register').should('be.disabled');
  });

  it('Checking validation "Re-enter password" Passwords do not match."', () => {
    cy.url().should('include', 'qauto.forstudy.space');
    cy.contains('button', 'Sign up').click();
    cy.contains('.modal-header', 'Registration');

    cy.get('#signupName').type(userData.firstName).should('have.value', userData.firstName);

    cy.get('[name="lastName"]')
      .clear()
      .type(userData.lastName)
      .should('have.value', userData.lastName);

    cy.get('[formcontrolname="email"]')
      .clear()
      .type(userData.email)
      .should('have.value', userData.email);

    cy.get('#signupPassword')
      .clear()
      .type(userData.password)
      .invoke('val')
      .then(val => {
        expect(val).to.eq(userData.password);
      });

    cy.get('#signupRepeatPassword').clear().type('QWEr1235!').blur();

    cy.get('#signupRepeatPassword')
      .invoke('val')
      .then(val => {
        expect(val).to.eq('QWEr1235!');
      });

    cy.contains('button', 'Register').should('be.disabled');

    cy.get('.invalid-feedback').contains('Passwords do not match').should('be.visible');

    cy.get('#signupRepeatPassword').should('have.css', 'border-color', 'rgb(220, 53, 69)');
  });
});
