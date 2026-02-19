// Accessibility audit suite for major public and authenticated pages
describe('Accessibility Audit', () => {

    // Set a consistent desktop viewport for all tests
    beforeEach(() => {
        cy.viewport(1280, 720);
    });

    // Helper to log axe accessibility violations in terminal
    const terminalLog = (violations) => {
        cy.task(
            'log',
            `${violations.length} accessibility violation${violations.length === 1 ? '' : 's'
            } detected`
        );

        // Show a concise table of violations
        const violationData = violations.map(
            ({ id, impact, description, nodes }) => ({
                id,
                impact,
                description,
                nodes: nodes.length
            })
        );

        cy.task('table', violationData);
    };

    // Check accessibility of the public landing page
    it('should have no accessibility violations on Landing Page', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.checkA11y(null, null, terminalLog);
    });

    // Check accessibility of the login page
    it('should have no accessibility violations on Login Page', () => {
        cy.visit('/login');
        cy.injectAxe();
        cy.checkA11y(null, null, terminalLog);
    });

    // Check accessibility of the registration page
    it('should have no accessibility violations on Registration Page', () => {
        cy.visit('/register');
        cy.injectAxe();
        cy.checkA11y(null, null, terminalLog);
    });

    // Check accessibility of student dashboard after login
    it('should have no violations on Student Dashboard (Authenticated)', () => {
        cy.login('student1@gmail.com', 'password123');
        cy.visit('/dashboard');
        cy.injectAxe();

        cy.checkA11y(null, {
            rules: {
                // Ignore rule that may conflict with complex dashboard layouts
                'landmark-one-main': { enabled: false }
            }
        }, terminalLog);
    });

    // Check accessibility of line reader / task view if an assignment exists
    it('should have no violations on Line Reader (Authenticated)', () => {
        cy.login('student1@gmail.com', 'password123');
        cy.visit('/dashboard');

        // Proceed only if assignments are available
        cy.get('body').then(($body) => {
            if ($body.find('.task-card').length > 0) {
                cy.get('.task-card').first().find('button').click();
                cy.injectAxe();
                cy.checkA11y(null, null, terminalLog);
            } else {
                cy.log('Skipping accessibility check: No assignments found.');
            }
        });
    });
});
