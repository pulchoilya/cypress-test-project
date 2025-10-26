import { faker } from '@faker-js/faker';
import { RegistrationPageElements, SignInElements, AddCar } from './POM';
import expenseCar from '../fixtures/expenseCar';

const registrationPage = new RegistrationPageElements();
const signIn = new SignInElements();
const addCar = new AddCar();

let userData1;
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
    cy.visit('/', {
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

    cy.getCookie('sid').then(cookie => {
      cy.log('Session ID:', cookie.value);
      cy.writeFile('cypress/fixtures/session.json', { sid: cookie.value });
    });

    cy.intercept('POST', '**/api/cars').as('createCar');

    addCar.addCarButton.click();
    addCar.header.should('have.text', 'Add a car');
    addCar.addCarBrand.select('BMW').should('have.value', '1: 2');
    addCar.addCarModel.select('X5').should('have.value', '7: 8');
    addCar.addCarMileage.type('5500').should('have.value', '5500');
    addCar.addButton.click();

    cy.wait('@createCar').then(interception => {
      // Check status
      expect(interception.response.statusCode).to.eq(201);

      // created car ID
      const carId = interception.response.body.data.id;
      cy.log('Created car id:', carId);

      // saved to a fixture
      cy.writeFile('cypress/fixtures/createdCar.json', { id: carId });

      // check the car UI
      addCar.checkAddedCar.should('have.text', 'BMW X5');
    });
  });

  it('Validate created car exists via API', () => {
    cy.fixture('createdCar.json').then(car => {
      const carId = car.id;
      cy.log('Checking car with ID:', carId);
      console.log('Checking car with ID:', carId);

      // take sid from fixture
      cy.fixture('session.json').then(session => {
        const sid = session.sid;

        cy.request({
          method: 'GET',
          url: 'https://qauto.forstudy.space/api/cars',
          headers: {
            accept: 'application/json',
            cookie: `sid=${sid}`, // SID
          },
        }).then(apiResponse => {
          expect(apiResponse.status).to.eq(200);

          const cars = apiResponse.body.data;
          const foundCar = cars.find(c => c.id === carId);

          expect(foundCar).to.exist;
          expect(foundCar.brand).to.eq('BMW');
          expect(foundCar.model).to.eq('X5');
          expect(foundCar.mileage).to.eq(5500);

          cy.log(`The car was found in the list: ${foundCar.brand} ${foundCar.model}`);
        });
      });
    });
  });

  it('Create expense via API and validate response', () => {
    // created car ID
    cy.fixture('createdCar.json').then(car => {
      const carId = car.id;

      // sid user
      cy.fixture('session.json').then(session => {
        const sid = session.sid;

        // Create expense API
        const expenseData = { ...expenseCar, carId };

        cy.createExpense(sid, expenseData).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body.status).to.eq('ok');
          expect(response.body.data.carId).to.eq(carId);
          expect(response.body.data.mileage).to.eq(expenseData.mileage);
          expect(response.body.data.liters).to.eq(expenseData.liters);
          expect(response.body.data.totalCost).to.eq(expenseData.totalCost);
          cy.log(`Expense created car id: ${carId}`);
        });
      });
    });
  });

  it('Validate created expense via UI after login and navigation', () => {
    signIn.openLogInModal();
    signIn.emailInput.clear().type(email).should('have.value', email);
    signIn.passwordInput
      .clear()
      .type(password)
      .invoke('val')
      .then(val => expect(val).to.eq(password));
    signIn.submitLoginButton.click();

    cy.get('a[routerlink="expenses"]').click();
    cy.url().should('include', '/panel/expenses');

    // table expense
    cy.get('table.expenses_table tbody tr').should('exist');

    // check the contents
    cy.get('table.expenses_table tbody tr')
      .first()
      .within(() => {
        cy.get('td').eq(1).should('contain.text', expenseCar.mileage); // Mileage
        cy.get('td').eq(2).should('contain.text', `${expenseCar.liters}L`); // Liters used
        cy.get('td').eq(3).should('contain.text', `${expenseCar.totalCost}.00 USD`); // Total cost
      });
  });

  it('API POST - Create multiple fake cars and validate in UI', () => {
    const fakeCars = {
      status: 'ok',
      data: [
        {
          id: 101,
          carBrandId: 1,
          carModelId: 1,
          initialMileage: 100,
          updatedMileageAt: '2025-10-26T12:00:00.000Z',
          mileage: 100,
          brand: 'Audi',
          model: 'TT',
          logo: 'audi.png',
        },
        {
          id: 102,
          carBrandId: 2,
          carModelId: 3,
          initialMileage: 200,
          updatedMileageAt: '2025-10-26T12:05:00.000Z',
          mileage: 200,
          brand: 'BMW',
          model: 'X5',
          logo: 'bmw.png',
        },
        {
          id: 103,
          carBrandId: 3,
          carModelId: 4,
          initialMileage: 300,
          updatedMileageAt: '2025-10-26T12:10:00.000Z',
          mileage: 300,
          brand: 'Mercedes',
          model: 'C-Class',
          logo: 'mercedes.png',
        },
        {
          id: 104,
          carBrandId: 4,
          carModelId: 5,
          initialMileage: 400,
          updatedMileageAt: '2025-10-26T12:15:00.000Z',
          mileage: 400,
          brand: 'Toyota',
          model: 'Corolla',
          logo: 'toyota.png',
        },
        {
          id: 105,
          carBrandId: 5,
          carModelId: 6,
          initialMileage: 500,
          updatedMileageAt: '2025-10-26T12:20:00.000Z',
          mileage: 500,
          brand: 'Honda',
          model: 'Civic',
          logo: 'honda.png',
        },
        {
          id: 106,
          carBrandId: 6,
          carModelId: 7,
          initialMileage: 600,
          updatedMileageAt: '2025-10-26T12:25:00.000Z',
          mileage: 600,
          brand: 'Ford',
          model: 'Focus',
          logo: 'ford.png',
        },
        {
          id: 107,
          carBrandId: 7,
          carModelId: 8,
          initialMileage: 700,
          updatedMileageAt: '2025-10-26T12:30:00.000Z',
          mileage: 700,
          brand: 'Chevrolet',
          model: 'Cruze',
          logo: 'chevrolet.png',
        },
        {
          id: 108,
          carBrandId: 8,
          carModelId: 9,
          initialMileage: 800,
          updatedMileageAt: '2025-10-26T12:35:00.000Z',
          mileage: 800,
          brand: 'Nissan',
          model: 'Altima',
          logo: 'nissan.png',
        },
        {
          id: 109,
          carBrandId: 9,
          carModelId: 10,
          initialMileage: 900,
          updatedMileageAt: '2025-10-26T12:40:00.000Z',
          mileage: 900,
          brand: 'Kia',
          model: 'Rio',
          logo: 'kia.png',
        },
        {
          id: 110,
          carBrandId: 10,
          carModelId: 11,
          initialMileage: 1000,
          updatedMileageAt: '2025-10-26T12:45:00.000Z',
          mileage: 1000,
          brand: 'Hyundai',
          model: 'Elantra',
          logo: 'hyundai.png',
        },
      ],
    };

    cy.intercept('GET', '**/cars', fakeCars).as('getCars');

    signIn.openLogInModal();
    signIn.emailInput.clear().type(email).should('have.value', email);
    signIn.passwordInput
      .clear()
      .type(password)
      .invoke('val')
      .then(val => expect(val).to.eq(password));
    signIn.submitLoginButton.click();

    cy.get('a[routerlink="garage"]').click();
    cy.wait('@getCars');
    fakeCars.data.forEach(car => {
      cy.contains(`${car.brand} ${car.model}`).should('exist');
    });
  });
});
