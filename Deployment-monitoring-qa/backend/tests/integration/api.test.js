const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');

// Connect to a test database before running tests
beforeAll(async () => {
    // Use a separate database for testing
    const url = "mongodb://127.0.0.1:27017/accessibilityDB_test";
    await mongoose.connect(url);
});

// We need to close the mongoose connection after tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe('API Integration Tests', () => {

    // Test a non-existent route to ensure 404 handling
    it('should return 404 for non-existent routes', async () => {
        const res = await request(app).get('/api/v1/non-existent');
        expect(res.statusCode).toEqual(404);
    });

    // Test a basic route if one exists without auth. 
    // Since we don't know exact routes that are public, we test the main prefixes.
    // Express default behavior for defined routes without return might be different, 
    // but at least we check if the server is up and routing works.

    it('should respond to /deployment related routes', async () => {
        // This might fail if the route requires auth, but status should not be 404 
        // unless the path is wrong. It might be 401 or 403 or 200.
        const res = await request(app).get('/deployment');
        // We expect it NOT to be 404 implying the router is mounted
        expect(res.statusCode).not.toEqual(404);
    });
});
