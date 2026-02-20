import { describe, it, expect, vi, beforeEach } from 'vitest';
import { register, login, getMe, getAllStudents, getChildren, protect, authorize } from '../controllers/authController.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

vi.mock('../models/User.js', () => ({
    default: {
        findOne: vi.fn(),
        create: vi.fn(),
        findById: vi.fn(),
        find: vi.fn(),
        updateMany: vi.fn(),
    }
}));

vi.mock('jsonwebtoken', () => ({
    default: {
        sign: vi.fn().mockReturnValue('mock-token'),
        verify: vi.fn(),
    }
}));

describe('Auth Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            headers: {},
            user: {}
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        vi.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            req.body = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'teacher'
            };

            User.findOne.mockResolvedValue(null);
            User.create.mockResolvedValue({
                _id: 'user123',
                name: 'Test User',
                email: 'test@example.com',
                role: 'teacher',
                disability: undefined
            });

            await register(req, res);

            expect(User.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: expect.objectContaining({ token: 'mock-token' })
            }));
        });

        it('should return 400 if user already exists', async () => {
            req.body = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'teacher'
            };

            User.findOne.mockResolvedValue({ email: 'test@example.com' });

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
        });
    });

    describe('login', () => {
        it('should login successfully with correct credentials', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'password123'
            };

            const mockUser = {
                _id: 'user123',
                name: 'Test User',
                email: 'test@example.com',
                role: 'teacher',
                comparePassword: vi.fn().mockResolvedValue(true)
            };

            User.findOne.mockResolvedValue(mockUser);

            await login(req, res);

            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: expect.objectContaining({ token: 'mock-token' })
            }));
        });

        it('should return 401 with invalid credentials', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'wrongpassword'
            };

            const mockUser = {
                comparePassword: vi.fn().mockResolvedValue(false)
            };

            User.findOne.mockResolvedValue(mockUser);

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });
    });
});
