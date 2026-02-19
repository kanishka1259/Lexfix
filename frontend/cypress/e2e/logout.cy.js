// Tests logout functionality and session cleanup
describe('Logout Flow', () => {

    // Prepare logged-in state and load dashboard before each test
    beforeEach(() => {
        cy.viewport(1280, 720); // Ensure responsive elements are visible

        // Mock logged-in user by setting localStorage directly
        const testUser = {
            id: '123',
            name: 'Test Voyager',
            email: 'voyager@test.com',
            role: 'student',
            token: 'fake-jwt-token'
        };

        localStorage.setItem('user', JSON.stringify(testUser));
        localStorage.setItem('token', 'fake-jwt-token');

        cy.visit('/dashboard');
    });

    // Verify user profile details appear in the navbar
    it('should show user profile info in navbar', () => {
        cy.get('nav').contains('Test Voyager').should('be.visible');
        cy.get('nav').contains('student', { matchCase: false }).should('be.visible');
    });

    // Verify logout clears session and redirects user
    it('should logout successfully and clear session', () => {
        // Trigger logout action
        cy.get('button').contains('Sign Out').click();

        // Verify redirect to landing page
        cy.url().should('eq', Cypress.config().baseUrl + '/');

        // Verify session data is removed from localStorage
        cy.window().then((win) => {
            expect(win.localStorage.getItem('user')).to.be.null;
            expect(win.localStorage.getItem('token')).to.be.null;
        });

        // Verify login option is visible again
        cy.get('nav').contains('Log In').should('be.visible');
    });
});
