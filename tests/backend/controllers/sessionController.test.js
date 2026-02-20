import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSession = { findById: vi.fn(), find: vi.fn(), create: vi.fn() };
vi.mock('../../../backend/models/Session.js', () => ({ default: mockSession }));

import { startSession, endSession, getAllSessions } from '../../../backend/controllers_learning/sessionController.js';

const mockReq = (o = {}) => ({ body: {}, params: {}, ...o });
const mockRes = () => { const r = {}; r.status = vi.fn().mockReturnValue(r); r.json = vi.fn().mockReturnValue(r); return r; };

describe('SessionController', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('startSession', () => {
        it('creates a new session', async () => {
            const session = { _id: 's1', startTime: new Date() };
            mockSession.create.mockResolvedValueOnce(session);
            const res = mockRes();
            await startSession(mockReq(), res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(session);
        });
    });

    describe('endSession', () => {
        it('returns 404 when session not found', async () => {
            mockSession.findById.mockResolvedValueOnce(null);
            const res = mockRes();
            await endSession(mockReq({ params: { id: 'bad' } }), res);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('calculates total time and saves', async () => {
            const start = new Date(Date.now() - 60000); // 60 seconds ago
            const session = { _id: 's1', startTime: start, save: vi.fn().mockResolvedValue(true) };
            mockSession.findById.mockResolvedValueOnce(session);
            const res = mockRes();
            await endSession(mockReq({ params: { id: 's1' }, body: { sentencesViewed: 5 } }), res);
            expect(session.sentencesViewed).toBe(5);
            expect(session.totalTime).toBeGreaterThanOrEqual(59);
            expect(session.save).toHaveBeenCalled();
        });
    });

    describe('getAllSessions', () => {
        it('returns all sessions sorted', async () => {
            const sessions = [{ _id: 's1' }, { _id: 's2' }];
            mockSession.find.mockReturnValue({ sort: vi.fn().mockResolvedValue(sessions) });
            const res = mockRes();
            await getAllSessions(mockReq(), res);
            expect(res.json).toHaveBeenCalledWith(sessions);
        });
    });
});
