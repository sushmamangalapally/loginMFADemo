Cypress.Commands.add('login', (user) => {
	cy.session(
		user.email,                        // unique cache key
		() => {                            
			cy.visit('http://localhost:5173'); 

			cy.get('input[name=email]').clear().type(user.email);
			cy.get('input[name=password]').clear().type(user.password);
			cy.findByRole('button', { name: /next|continue/i }).click();

			cy.findByRole('heading', { name: /enter.*code/i }).should('be.visible');
			cy.get('input[name="otp-0"]').type('1');
			cy.get('input[name="otp-1"]').type('2');
			cy.get('input[name="otp-2"]').type('3');
			cy.get('input[name="otp-3"]').type('4');
			cy.get('input[name="otp-4"]').type('5');
			cy.get('input[name="otp-5"]').type('6');

			cy.findByText(/welcome to the home page!/i).should('be.visible');
			cy.get('p.user-email').contains(user.email);
		},
		{
		}
	);
});