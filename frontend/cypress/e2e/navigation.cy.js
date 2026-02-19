// Tests navigation between landing, login, and registration flows
describe('Navigation Flow', () => {

    // Verify navigation from landing page to login page
    it('should navigate from landing page to login', () => {
        cy.visit('/');
        cy.wait(1000);

        // Navigate to login page
        cy.visit('/login');
        cy.wait(1000);

        // Confirm login page is displayed
        cy.get('h1').should('contain', 'Welcome Back');
    });

    // Verify navigation between login and multi-step registration flow
    it('should navigate between login and register', () => {
        cy.visit('/login');
        cy.wait(1000);

        // Move from login to registration
        cy.get('.login-footer').contains('Create an account').click();
        cy.wait(1000);
        cy.url().should('include', '/register');

        // Verify initial registration step
        cy.get('.back-btn').should('not.exist');
        cy.get('.role-card').first().click();
        cy.wait(1000);

        // Verify back navigation works within registration flow
        cy.get('.back-btn').should('be.visible');
        cy.get('.back-btn').click();
        cy.wait(1000);

        // Confirm return to role selection step
        cy.contains('I am a...').should('be.visible');
    });
});
