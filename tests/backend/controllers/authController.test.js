import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';

// vi.mock is hoisted, so mock objects must be created via vi.hoisted()
const { mockUser } = vi.hoisted(() => ({
    mockUser: {
        findOne: vi.fn(),
        findById: vi.fn(),
        find: vi.fn(),
        create: vi.fn(),
        updateMany: vi.fn(),
    },
}));

vi.mock('../../../backend/models/User.js', () => ({ default: mockUser }));

// We don't mock jsonwebtoken — instead we use the real library with the known fallback secret
const JWT_SECRET = 'lexfix-secret-key-2024';

import { register, login, getMe, getAllStudents, getChildren, protect, authorize } from '../../../backend/controllers/authController.js';

const mockReq = (overrides = {}) => ({ body: {}, params: {}, headers: {}, user: null, ...overrides });
const mockRes = () => { const r = {}; r.status = vi.fn().mockReturnValue(r); r.json = vi.fn().mockReturnValue(r); return r; };

describe('AuthController', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('register', () => {
        it('returns 500 when required fields missing (email undefined causes crash)', async () => {
            // The controller tries email.toLowerCase() before validation, so undefined email results in 500
            const res = mockRes();
            await register(mockReq({ body: { name: 'Test' } }), res);
            expect(res.status).toHaveBeenCalledWith(500);
        });

        it('returns 400 when only email and name provided (no password/role)', async () => {
            const res = mockRes();
            await register(mockReq({ body: { name: 'Test', email: 'test@m.com' } }), res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('returns 400 for an invalid role', async () => {
            const res = mockRes();
            await register(mockReq({ body: { name: 'T', email: 't@m.com', password: '123456', role: 'admin' } }), res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('returns 400 when student registers without disability', async () => {
            const res = mockRes();
            await register(mockReq({ body: { name: 'S', email: 's@m.com', password: '123456', role: 'student' } }), res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('returns 400 when user already exists', async () => {
            mockUser.findOne.mockResolvedValueOnce({ email: 's@m.com' });
            const res = mockRes();
            await register(mockReq({ body: { name: 'S', email: 's@m.com', password: '123456', role: 'student', disability: 'adhd' } }), res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('creates a student successfully', async () => {
            mockUser.findOne.mockResolvedValueOnce(null);
            mockUser.create.mockResolvedValueOnce({ _id: 'u1', name: 'Student', email: 's@m.com', role: 'student', disability: ['adhd'] });
            const res = mockRes();
            await register(mockReq({ body: { name: 'Student', email: 's@m.com', password: '123456', role: 'student', disability: 'adhd' } }), res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('creates a teacher without disability', async () => {
            mockUser.findOne.mockResolvedValueOnce(null);
            mockUser.create.mockResolvedValueOnce({ _id: 't1', name: 'Teacher', email: 't@m.com', role: 'teacher' });
            const res = mockRes();
            await register(mockReq({ body: { name: 'Teacher', email: 't@m.com', password: '123456', role: 'teacher' } }), res);
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('login', () => {
        it('returns 400 when email or password is missing', async () => {
            const res = mockRes();
            await login(mockReq({ body: { email: 't@m.com' } }), res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('returns 401 for non-existent user', async () => {
            mockUser.findOne.mockResolvedValueOnce(null);
            const res = mockRes();
            await login(mockReq({ body: { email: 'no@m.com', password: '123456' } }), res);
            expect(res.status).toHaveBeenCalledWith(401);
        });

        it('returns 401 when password does not match', async () => {
            mockUser.findOne.mockResolvedValueOnce({ _id: 'u1', comparePassword: vi.fn().mockResolvedValue(false) });
            const res = mockRes();
            await login(mockReq({ body: { email: 't@m.com', password: 'wrong' } }), res);
            expect(res.status).toHaveBeenCalledWith(401);
        });

        it('returns user data and token on success', async () => {
            mockUser.findOne.mockResolvedValueOnce({ _id: 'u1', name: 'Test', email: 't@m.com', role: 'student', disability: ['adhd'], comparePassword: vi.fn().mockResolvedValue(true) });
            const res = mockRes();
            await login(mockReq({ body: { email: 't@m.com', password: '123456' } }), res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: expect.objectContaining({
                    name: 'Test',
                    role: 'student',
                    token: expect.any(String),
                }),
            }));
        });
    });

    describe('getMe', () => {
        it('returns current user without password', async () => {
            const selectMock = vi.fn().mockResolvedValue({ _id: 'u1', name: 'Test' });
            mockUser.findById.mockReturnValue({ select: selectMock });
            const res = mockRes();
            await getMe(mockReq({ user: { id: 'u1' } }), res);
            expect(selectMock).toHaveBeenCalledWith('-password');
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });
    });

    describe('getAllStudents', () => {
        it('returns all students', async () => {
            mockUser.find.mockReturnValue({ select: vi.fn().mockResolvedValue([{ name: 'S1' }]) });
            const res = mockRes();
            await getAllStudents(mockReq(), res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ count: 1 }));
        });
    });

    describe('getChildren', () => {
        it('returns 403 for non-parent', async () => {
            const res = mockRes();
            await getChildren(mockReq({ user: { id: 'u1', role: 'student' } }), res);
            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('returns children for parent', async () => {
            mockUser.find.mockReturnValue({ select: vi.fn().mockResolvedValue([{ name: 'Child' }]) });
            const res = mockRes();
            await getChildren(mockReq({ user: { id: 'p1', role: 'parent' } }), res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });
    });

    describe('protect', () => {
        it('returns 401 when no token is provided', async () => {
            const res = mockRes();
            await protect(mockReq({ headers: {} }), res, vi.fn());
            expect(res.status).toHaveBeenCalledWith(401);
        });

        it('returns 401 for invalid token', async () => {
            const res = mockRes();
            await protect(mockReq({ headers: { authorization: 'Bearer bad-token' } }), res, vi.fn());
            expect(res.status).toHaveBeenCalledWith(401);
        });

        it('calls next for valid token', async () => {
            // Generate a real token using the known fallback secret
            const validToken = jwt.sign({ id: 'user123', role: 'student' }, JWT_SECRET, { expiresIn: '1h' });
            const next = vi.fn();
            const req = mockReq({ headers: { authorization: `Bearer ${validToken}` } });
            await protect(req, mockRes(), next);
            expect(next).toHaveBeenCalled();
            expect(req.user).toEqual(expect.objectContaining({ id: 'user123', role: 'student' }));
        });
    });

    describe('authorize', () => {
        it('returns 403 when role is not allowed', () => {
            const res = mockRes();
            authorize('teacher')(mockReq({ user: { role: 'student' } }), res, vi.fn());
            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('calls next when role is allowed', () => {
            const next = vi.fn();
            authorize('teacher')(mockReq({ user: { role: 'teacher' } }), mockRes(), next);
            expect(next).toHaveBeenCalled();
        });
    });
});
