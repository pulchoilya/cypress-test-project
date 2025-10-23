// Element-oriented POM
export class RegistrationPageElements {
  get loginButtonHeader() {
    return cy.get('.header_right > .btn');
  }
  get registrationTabButton() {
    return cy.contains('button', 'Registration');
  }

  get loginModalHeader() {
    return cy.contains('.modal-header', 'Log in');
  }
  get registrationModalHeader() {
    return cy.contains('.modal-header', 'Registration');
  }

  get firstNameInput() {
    return cy.get('#signupName');
  }
  get lastNameInput() {
    return cy.get('[name="lastName"]');
  }
  get emailInput() {
    return cy.get('[formcontrolname="email"]');
  }
  get passwordInput() {
    return cy.get('#signupPassword');
  }
  get repeatPasswordInput() {
    return cy.get('#signupRepeatPassword');
  }
  get registerButton() {
    return cy.contains('button', 'Register');
  }

  openRegistrationModal() {
    this.loginButtonHeader.click();
    this.loginModalHeader.should('exist');
    this.registrationTabButton.click();
    this.registrationModalHeader.should('exist');
  }
}

// Element-oriented POM
export class SignInElements {
  get loginButton() {
    return cy.get('.header_right > .btn');
  }
  get headerLogIn() {
    return cy.contains('.modal-header', 'Log in');
  }
  get emailInput() {
    return cy.get('#signinEmail');
  }
  get passwordInput() {
    return cy.get('#signinPassword');
  }
  get submitLoginButton() {
    return cy.contains('button', 'Login');
  }
  get garageUrl() {
    return cy.url().should('include', '/garage');
  }
  get alert() {
    return cy.get('.alert.alert-success');
  }
  get profileDropdown() {
    return cy.get('#userNavDropdown');
  }
  get logoutOption() {
    return cy.get('.user-nav_menu .dropdown-item').contains('Logout');
  }

  openLogInModal() {
    this.loginButton.click();
    this.headerLogIn.should('exist');
  }
}
// Element-oriented POM
export class AddCar {
  get garageUrl() {
    return cy.url().should('include', '/garage');
  }
  get addCarButton() {
    return cy.contains('button', 'Add car');
  }
  get header() {
    return cy.get('h4');
  }
  get addCarBrand() {
    return cy.get('#addCarBrand');
  }
  get addCarModel() {
    return cy.get('#addCarModel');
  }
  get addCarMileage() {
    return cy.get('#addCarMileage');
  }
  get addButton() {
    return cy.get('.modal-footer > .btn-primary');
  }
  get checkAddedCar() {
    return cy.get('p.car_name.h2');
  }
  get addFuelButton() {
    return cy.contains('button', 'Add fuel expense');
  }
  get fuelHeader() {
    return cy.get('h4');
  }
  get expenseCar() {
    return cy.get('#addExpenseCar');
  }
  get expenseDate() {
    return cy.get('#addExpenseDate');
  }
  get expenseMileage() {
    return cy.get('#addExpenseMileage');
  }
  get expenseLiters() {
    return cy.get('#addExpenseLiters');
  }
  get expenseTotalCost() {
    return cy.get('#addExpenseTotalCost');
  }
  get submitFuelButton() {
    return cy.get('.modal-footer').find('button.btn-primary');
  }

  getTodayDate() {
    const today = new Date();
    return `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
  }
}

// Methodological POM
export class RegistrationPage {
  get firstNameInput() {
    return cy.get('#signupName');
  }
  get lastNameInput() {
    return cy.get('[name="lastName"]');
  }
  get emailInput() {
    return cy.get('[formcontrolname="email"]');
  }
  get passwordInput() {
    return cy.get('#signupPassword');
  }
  get repeatPasswordInput() {
    return cy.get('#signupRepeatPassword');
  }
  get registerButton() {
    return cy.contains('button', 'Register');
  }

  get loginButtonHeader() {
    return cy.get('.header_right > .btn');
  }
  get registrationTabButton() {
    return cy.contains('button', 'Registration');
  }
  get registrationModalHeader() {
    return cy.contains('.modal-header', 'Log in');
  }

  openRegistrationModal() {
    this.loginButtonHeader.click();
    this.registrationModalHeader.should('exist');
    this.registrationTabButton.click();
    return this;
  }

  typeFirstName(firstName) {
    this.firstNameInput.clear().type(firstName).should('have.value', firstName);
    return this;
  }

  typeLastName(lastName) {
    this.lastNameInput.clear().type(lastName).should('have.value', lastName);
    return this;
  }

  typeEmail(email) {
    this.emailInput.clear().type(email).should('have.value', email);
    return this;
  }

  typePassword(password) {
    this.passwordInput.clear().type(password, { sensitive: true });
    this.repeatPasswordInput.clear().type(password, { sensitive: true });
    return this;
  }

  clickRegisterButton() {
    this.registerButton.click();
    return this;
  }
}

// Methodological POM
export class SingInPage {
  get loginButton() {
    return cy.get('.header_right > .btn');
  }
  get headerLogIn() {
    return cy.contains('.modal-header', 'Log in');
  }
  get emailInput() {
    return cy.get('#signinEmail');
  }
  get passwordInput() {
    return cy.get('#signinPassword');
  }
  get submitLoginButton() {
    return cy.contains('button', 'Login');
  }
  get alert() {
    return cy.get('.alert.alert-success');
  }
  get profileDropdown() {
    return cy.get('#userNavDropdown');
  }
  get logoutOption() {
    return cy.get('.user-nav_menu .dropdown-item').contains('Logout');
  }

  openLoginModalMeth() {
    this.loginButton.click();
    this.headerLogIn.should('exist');
    return this;
  }

  typeEmail(email) {
    this.emailInput.clear().type(email).should('have.value', email);
    return this;
  }

  typePassword(password) {
    this.passwordInput.clear().type(password).should('have.value', password);
    return this;
  }

  clickLogIn() {
    this.submitLoginButton.click();
    return this;
  }

  verifyAlert(message) {
    this.alert.should('be.visible').and('contain.text', message);
    return this;
  }

  clickProfileDropdown() {
    this.profileDropdown.click();
    return this;
  }

  clickLogout() {
    this.logoutOption.click();
    return this;
  }
}

// Methodological POM
export class AddCarPage {
  get garageUrl() {
    return cy.url();
  }
  get addCarButton() {
    return cy.contains('button', 'Add car');
  }
  get header() {
    return cy.get('h4');
  }
  get addCarBrand() {
    return cy.get('#addCarBrand');
  }
  get addCarModel() {
    return cy.get('#addCarModel');
  }
  get addCarMileage() {
    return cy.get('#addCarMileage');
  }
  get addButton() {
    return cy.get('.modal-footer > .btn-primary');
  }
  get checkAddedCar() {
    return cy.get('p.car_name.h2');
  }
  get addFuelButton() {
    return cy.contains('button', 'Add fuel expense');
  }
  get fuelHeader() {
    return cy.get('h4');
  }
  get expenseCar() {
    return cy.get('#addExpenseCar');
  }
  get expenseDate() {
    return cy.get('#addExpenseDate');
  }
  get expenseMileage() {
    return cy.get('#addExpenseMileage');
  }
  get expenseLiters() {
    return cy.get('#addExpenseLiters');
  }
  get expenseTotalCost() {
    return cy.get('#addExpenseTotalCost');
  }
  get submitFuelButton() {
    return cy.get('.modal-footer').find('button.btn-primary');
  }

  verifyGarageUrl() {
    this.garageUrl.should('include', '/garage');
    return this;
  }

  openAddCarModal() {
    this.addCarButton.click();
    this.header.should('have.text', 'Add a car');
    return this;
  }

  fillCarForm(brand, model, mileage) {
    this.addCarBrand.select(brand);
    this.addCarModel.select(model);
    this.addCarMileage.clear().type(mileage).should('have.value', mileage);
    return this;
  }

  submitAddCar() {
    this.addButton.click();
    this.checkAddedCar.should('have.text', 'BMW X5');
    return this;
  }

  openAddFuelModal() {
    this.addFuelButton.click();
    this.fuelHeader.should('have.text', 'Add an expense');
    return this;
  }

  fillFuelForm(mileage, liters, totalCost) {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;

    this.expenseDate.clear().type(formattedDate).should('have.value', formattedDate);
    this.expenseMileage.clear().type(mileage).should('have.value', mileage);
    this.expenseLiters.clear().type(liters).should('have.value', liters);
    this.expenseTotalCost.clear().type(totalCost).should('have.value', totalCost);

    return this;
  }

  submitAddFuel() {
    this.submitFuelButton.click();
    return this;
  }
}
