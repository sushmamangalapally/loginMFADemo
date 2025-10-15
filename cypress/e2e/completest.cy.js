describe('complete test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173')
  })

	it('logs in with email with correct OTP', () => {
		cy.window().then(win => {
			win.localStorage.removeItem('authUser');
		});
		cy.visit('http://localhost:5173'); 
		cy.contains('Log In').should('be.visible');
		cy.findByLabelText(/email/i).type('sushma@sushma.com');
		cy.findByLabelText(/password/i).type('password2!');
		cy.findByRole('button', { name: /next/i }).click();

		cy.findByRole('heading', { name: /enter.*code/i }).should('be.visible');

		cy.get('input[name="otp-0"]').type('1');
		cy.get('input[name="otp-1"]').type('2');
		cy.get('input[name="otp-2"]').type('3');
		cy.get('input[name="otp-3"]').type('4');
		cy.get('input[name="otp-4"]').type('5');
		cy.get('input[name="otp-5"]').type('6');

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

		cy.findByRole('heading', { name: /enter.*code/i }).should('be.visible');

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
})