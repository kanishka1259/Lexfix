// Tests basic login page UI and navigation behavior
describe('Login Flow', () => {

    // Load login page before each test
    beforeEach(() => {
        cy.visit('/login');
    });

    // Verify login card and heading are displayed
    it('should display the login card', () => {
        cy.get('.login-card').should('be.visible');
        cy.get('h1').should('contain', 'Welcome Back');
    });

    // Verify error message appears for invalid credentials
    it('should show error on invalid credentials', () => {
        cy.get('#email').type('wrong@example.com', { delay: 100 });
        cy.get('#password').type('wrongpassword', { delay: 100 });
        cy.get('.login-button').click();

        cy.get('.error-message').should('be.visible');
    });

    // Verify navigation to registration page
    it('should navigate to register page', () => {
        cy.get('.login-footer').contains('Create an account').click();
        cy.url().should('include', '/register');
    });
});
