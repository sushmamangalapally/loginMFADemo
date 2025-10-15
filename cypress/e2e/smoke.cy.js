describe('homepage', () => {
  it('loads and shows title', () => {
    cy.visit('http://localhost:5173');   // your dev server URL
    cy.contains('Log In').should('be.visible');
  });
});