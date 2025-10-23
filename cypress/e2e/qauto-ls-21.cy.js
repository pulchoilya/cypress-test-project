import { faker } from '@faker-js/faker';
import {
  RegistrationPageElements,
  RegistrationPage,
  SignInElements,
  SingInPage,
  AddCar,
  AddCarPage,
} from './POM';
const qauto1Config = require('../config/qauto1.json');
const qauto2Config = require('../config/qauto2.json');

// npx cypress run --env configFile=qauto1 --spec "cypress/e2e/qauto-ls-21.cy.js"
// npx cypress run --env configFile=qauto2 --spec "cypress/e2e/qauto-ls-21.cy.js"
// npx cypress run --env configFile=qauto1
// npx cypress run --env configFile=qauto2
// npx cypress run --reporter reporters/custom.js
// npx cypress run --reporter spec
// npx cypress run --reporter dot
// npx cypress run --reporter nyan
// npx marge mochawesome.json

const registrationPage = new RegistrationPageElements();
const signIn = new SignInElements();
const addCar = new AddCar();
const RegistrationPage2 = new RegistrationPage();
const signInMethodological = new SingInPage();
const addCarMeth = new AddCarPage();

let userData1;
let userData2;
let email;
let password;

describe('Registration and Login tests for QAuto1', () => {
  before(() => {
    userData1 = {
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
    email = userData1.email;
    password = userData1.password;
  });

  beforeEach(() => {
    cy.visit(qauto1Config.baseUrl, {
      auth: {
        username: Cypress.env('authUser'),
        password: Cypress.env('authPass'),
      },
    });
  });

  it('Registration user - Element-oriented POM', () => {
    registrationPage.openRegistrationModal();
    registrationPage.firstNameInput
      .clear()
      .type(userData1.firstName)
      .should('have.value', userData1.firstName);
    registrationPage.lastNameInput
      .clear()
      .type(userData1.lastName)
      .should('have.value', userData1.lastName);
    registrationPage.emailInput.clear().type(userData1.email).should('have.value', userData1.email);
    registrationPage.passwordInput.clear().type(userData1.password, { sensitive: true });
    registrationPage.repeatPasswordInput.clear().type(userData1.password, { sensitive: true });
    registrationPage.registerButton.click();
  });

  it('Login user - Element-oriented POM', () => {
    signIn.openLogInModal();
    signIn.emailInput.clear().type(email).should('have.value', email);
    signIn.passwordInput
      .clear()
      .type(password)
      .invoke('val')
      .then(val => expect(val).to.eq(password));
    signIn.submitLoginButton.click();
    signIn.alert.should('be.visible').and('contain.text', 'You have been successfully logged in');
    signIn.garageUrl;
    signIn.profileDropdown.click();
    signIn.logoutOption.click();
  });

  it('Add car and fuel - Element-oriented POM', () => {
    signIn.openLogInModal();
    signIn.emailInput.clear().type(email).should('have.value', email);
    signIn.passwordInput
      .clear()
      .type(password)
      .invoke('val')
      .then(val => expect(val).to.eq(password));
    signIn.submitLoginButton.click();

    addCar.garageUrl;
    addCar.addCarButton.click();
    addCar.header.should('have.text', 'Add a car');
    addCar.addCarBrand.select('BMW').should('have.value', '1: 2');
    addCar.addCarModel.select('X5').should('have.value', '7: 8');
    addCar.addCarMileage.type('5500').should('have.value', '5500');
    addCar.addButton.click();
    addCar.checkAddedCar.should('have.text', 'BMW X5');

    addCar.addFuelButton.click();
    addCar.fuelHeader.should('have.text', 'Add an expense');
    addCar.expenseCar.find('option:selected').should('have.text', 'BMW X5');
    addCar.expenseDate
      .clear()
      .type(addCar.getTodayDate())
      .should('have.value', addCar.getTodayDate());
    addCar.expenseMileage.clear().type('20000').should('have.value', '20000');
    addCar.expenseLiters.clear().type('80').should('have.value', '80');
    addCar.expenseTotalCost.clear().type('9000').should('have.value', '9000');
    addCar.submitFuelButton.contains('Add').click();
  });
});

describe('Registration and Login tests for QAuto2', () => {
  before(() => {
    userData2 = {
      firstName: faker.string.alpha({ length: { min: 2, max: 20 } }),
      lastName: faker.string.alpha({ length: { min: 2, max: 20 } }),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password({
        length: 10,
        memorable: true,
        pattern: /[A-Za-z0-9]/,
        prefix: 'Qw2',
      }),
    };
  });

  beforeEach(() => {
    cy.visit(qauto2Config.baseUrl, {
      auth: {
        username: Cypress.env('authUser'),
        password: Cypress.env('authPass'),
      },
    });
  });

  it('Registration user2 - Methodological POM', () => {
    RegistrationPage2.openRegistrationModal()
      .typeFirstName(userData2.firstName)
      .typeLastName(userData2.lastName)
      .typeEmail(userData2.email)
      .typePassword(userData2.password)
      .clickRegisterButton();
  });

  it('Login user2 - Methodological POM', () => {
    signInMethodological
      .openLoginModalMeth()
      .typeEmail(userData2.email)
      .typePassword(userData2.password)
      .clickLogIn()
      .verifyAlert('You have been successfully logged in')
      .clickProfileDropdown()
      .clickLogout();
  });

  it('Add car and fuel - Methodological POM', () => {
    signInMethodological
      .openLoginModalMeth()
      .typeEmail(userData2.email)
      .typePassword(userData2.password)
      .clickLogIn();

    addCarMeth
      .verifyGarageUrl()
      .openAddCarModal()
      .fillCarForm('BMW', 'X5', '5500')
      .submitAddCar()
      .openAddFuelModal()
      .fillFuelForm('20000', '80', '9000')
      .submitAddFuel();
  });
});
