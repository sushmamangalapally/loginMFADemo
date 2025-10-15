/// <reference types="cypress" />

it('logs in with email with correct OTP', () => {
	cy.window().then(win => {
		win.localStorage.removeItem('authUser');
	});
	cy.visit('http://localhost:5173'); 
	cy.contains('Log In').should('be.visible');
	cy.findByLabelText(/email/i).type('sushma@sushma.com');
	cy.findByLabelText(/password/i).type('password2!');
	cy.findByRole('button', { name: /next/i }).click();

	// OTP screen
	cy.findByRole('heading', { name: /enter.*code/i }).should('be.visible');

  cy.get('input[name="otp-0"]').type('1');
  cy.get('input[name="otp-1"]').type('2');
  cy.get('input[name="otp-2"]').type('3');
  cy.get('input[name="otp-3"]').type('4');
  cy.get('input[name="otp-4"]').type('5');
  cy.get('input[name="otp-5"]').type('6');

  // cy.findByRole('button', { name: /verify/i }).click();
  cy.findByText(/Welcome to the Home Page!/i).should('be.visible');
});

it('logs in with email with wrong OTP', () => {
	cy.window().then(win => {
		win.localStorage.removeItem('authUser');
	});
	cy.visit('http://localhost:5173'); 
	cy.contains('Log In').should('be.visible');
	cy.findByLabelText(/email/i).type('sushma@sushma.com');
	cy.findByLabelText(/password/i).type('password2!');
	cy.findByRole('button', { name: /next/i }).click();

	// OTP screen
	cy.findByRole('heading', { name: /enter.*code/i }).should('be.visible');

  // If you expose code in test env, read from fixture/env; otherwise stub API:
  // cy.intercept('POST','/api/verify',{ fixture: 'verify-success.json' });

  cy.get('input[name="otp-0"]').type('0');
  cy.get('input[name="otp-1"]').type('2');
  cy.get('input[name="otp-2"]').type('0');
  cy.get('input[name="otp-3"]').type('4');
  cy.get('input[name="otp-4"]').type('0');
  cy.get('input[name="otp-5"]').type('6');

  cy.findByText(/Invalid OTP Code!/i).should('be.visible');
	cy.get('input[name="otp-0"]')
      .should('have.class', 'focused')
});

Cypress.Commands.add('login', (user) => {
  cy.session(
    user.email,                        // unique cache key
    () => {                            // setup: perform the real login once
      
			// cy.window().then(win => {
    	// 	win.localStorage.removeItem('authUser');
  		// });
			cy.visit('http://localhost:5173'); 
			// cy.window().then(win => {
    	// 	win.localStorage.setItem('authUser', JSON.stringify(user));
  		// });


      // make sure testing-library commands are registered in support/e2e.ts
      // cy.findByText(/log in/i).should('be.visible');

      cy.get('input[name=email]').clear().type(user.email);
      cy.get('input[name=password]').clear().type(user.password);
      cy.findByRole('button', { name: /next|continue/i }).click();

      // OTP screen
      cy.findByRole('heading', { name: /enter.*code/i }).should('be.visible');
      cy.get('input[name="otp-0"]').type('1');
      cy.get('input[name="otp-1"]').type('2');
      cy.get('input[name="otp-2"]').type('3');
      cy.get('input[name="otp-3"]').type('4');
      cy.get('input[name="otp-4"]').type('5');
      cy.get('input[name="otp-5"]').type('6');

      // app should route to home and set whatever storage/cookies represent “logged in”
      cy.findByText(/welcome to the home page!/i).should('be.visible');
      cy.get('p.user-email').contains(user.email);
    },
    {
      // optional but recommended — proves session is still valid
      // validate: () => {
      //   cy.visit('/');
      //   cy.get('p.user-email').contains(user.email);
      // },
      // cacheAcrossSpecs: true, // uncomment if you want session reused across specs
    }
  );
});

it('admin can and edit a row and saves changes', () => {
  cy.login({
		name: 'Adam the Admin',
    email: 'admin@sushma.com',
		password: 'password1!'

	});

	cy.visit('http://localhost:5173'); 

  cy.findByRole('row', { name: /Gold Rush Reading/i })
    .within(() => cy.findByRole('button', { name:/edit/i }).click());

  cy.get('input[name="title"]').clear().type('Gold Rush Reading – Updated');
  cy.get('input[name="description"]').clear().type('New Description - Updated');
  cy.findByRole('button', { name:/save/i }).click();

  cy.findByRole('row', { name: /Gold Rush Reading – Updated/i })
    .within(() => cy.findByText('New Description - Updated').should('exist'));
});
