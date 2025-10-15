it('logs in with email + OTP (happy path)', () => {
    cy.visit('http://localhost:5173'); 
    cy.contains('Log In').should('be.visible');
  cy.findByLabelText(/email/i).type('sushma@sushma.com');
  cy.findByLabelText(/password/i).type('password2!');
  cy.findByRole('button', { name: /next/i }).click();

  // OTP screen
  cy.findByRole('heading', { name: /enter.*code/i }).should('be.visible');

  // If you expose code in test env, read from fixture/env; otherwise stub API:
  // cy.intercept('POST','/api/verify',{ fixture: 'verify-success.json' });

  cy.get('input.otp-input[key="0"]').type('1');
  cy.get('input.otp-input[key="1"]').type('2');
  cy.get('input.otp-input[key="2"]').type('3');
  cy.get('input.otp-input[key="3"]').type('4');
  cy.get('input.otp-input[key="4"]').type('5');
  cy.get('input.otp-input[key="5"]').type('6');

//   cy.get('[data-otp-index="1"]').type('2');
//   cy.get('[data-otp-index="2"]').type('3');
//   cy.get('[data-otp-index="3"]').type('4');
//   cy.get('[data-otp-index="4"]').type('5');
//   cy.get('[data-otp-index="5"]').type('6');

  cy.findByRole('button', { name: /verify/i }).click();
  cy.findByText(/welcome/i).should('be.visible');
});

