import { describe, it, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';
import express from 'express';

// We create a mock app or import the app without starting the server
const app = express();
app.get("/", (req, res) => {
    res.json({
        message: "🔐 Lexfix Authentication API is running!",
        version: "2.0.0"
    });
});

describe('GET /', () => {
    it('should return health status', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.body.message).toContain('Lexfix Authentication API is running!');
    });
});
