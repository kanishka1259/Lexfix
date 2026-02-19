// Tests the multi-step registration flow and validations
describe('Registration Flow', () => {

    // Load registration page before each test
    beforeEach(() => {
        cy.visit('/register');
    });

    // Verify role selection step works
    it('should navigate through role selection', () => {
        cy.contains('I am a...').should('be.visible');
        cy.get('.role-card').contains('Student').click();
        cy.get('.selected-role-badge').should('contain', 'student');
    });

    // Verify validation errors for required role-specific fields
    it('should show validation errors in role-specific fields', () => {
        cy.get('.role-card').contains('Student').click();

        // Fill basic registration fields
        cy.get('#name').type('Test Student');
        cy.get('#email').type('student@test.com');
        cy.get('#password').type('password123');
        cy.get('#confirmPassword').type('password123');

        // Attempt submit without selecting required disability field
        cy.get('.register-button').click();

        // Verify validation error is shown
        cy.get('.error-message')
            .should('be.visible')
            .and('contain', 'learning issue');
    });

    // Verify back navigation returns to role selection
    it('should go back to role selection', () => {
        cy.get('.role-card').contains('Teacher').click();
        cy.get('.back-btn').click();
        cy.contains('I am a...').should('be.visible');
    });
});
