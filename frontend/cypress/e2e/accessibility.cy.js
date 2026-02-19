// Tests the dyslexic font accessibility feature and its persistence
describe('Accessibility Flow', () => {
    beforeEach(() => {
        cy.viewport(1280, 720);
        cy.visit('/');
    });

    it('should toggle dyslexic font and apply class', () => {
        cy.wait(1000);
        // Initially should not have the class
        cy.get('body').should('not.have.class', 'font-dyslexic');

        // Click toggle
        cy.get('button').contains('Dyslexic Font').click();
        cy.wait(1000);

        // Should have class now
        cy.get('body').should('have.class', 'font-dyslexic');

        // Click again to toggle off
        cy.get('button').contains('Dyslexic Font').click();
        cy.wait(1000);
        cy.get('body').should('not.have.class', 'font-dyslexic');
    });

    it('should persist dyslexic font preference after reload', () => {
        cy.wait(1000);
        cy.get('button').contains('Dyslexic Font').click();
        cy.wait(1000);

        cy.reload();
        cy.wait(1000);

        // Should still be active
        cy.get('body').should('have.class', 'font-dyslexic');

        // Clean up
        cy.get('button').contains('Dyslexic Font').click();
    });
});
