// Custom commands can be added here
Cypress.Commands.add('login', (email, password) => {
    cy.request({
        method: 'POST',
        url: 'http://localhost:5000/api/auth/login',
        body: { email, password }
    }).then((resp) => {
        const user = resp.body.data || resp.body;
        // Normalize user data to match frontend expectation
        const normalizedUser = {
            ...user,
            userType: user.role || user.userType || 'student',
            username: user.name || user.username || user.email.split('@')[0],
            token: user.token || resp.body.token
        };
        window.localStorage.setItem('user', JSON.stringify(normalizedUser));
        window.localStorage.setItem('token', normalizedUser.token);
    });
});
