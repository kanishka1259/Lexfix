import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockSession } = vi.hoisted(() => ({
    mockSession: { findById: vi.fn(), find: vi.fn(), create: vi.fn() },
}));

vi.mock('../../../backend/models/Session.js', () => ({ default: mockSession }));

import { startSession, endSession, getAllSessions } from '../../../backend/controllers_learning/sessionController.js';

const mockReq = (o = {}) => ({ body: {}, params: {}, ...o });
const mockRes = () => { const r = {}; r.status = vi.fn().mockReturnValue(r); r.json = vi.fn().mockReturnValue(r); return r; };

describe('SessionController', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('startSession', () => {
        it('creates a session', async () => {
            mockSession.create.mockResolvedValueOnce({ _id: 's1' });
            const res = mockRes();
            await startSession(mockReq(), res);
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('endSession', () => {
        it('returns 404 when not found', async () => {
            mockSession.findById.mockResolvedValueOnce(null);
            const res = mockRes();
            await endSession(mockReq({ params: { id: 'bad' } }), res);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('calculates total time', async () => {
            const start = new Date(Date.now() - 60000);
            const session = { startTime: start, save: vi.fn() };
            mockSession.findById.mockResolvedValueOnce(session);
            const res = mockRes();
            await endSession(mockReq({ params: { id: 's1' }, body: { sentencesViewed: 5 } }), res);
            expect(session.sentencesViewed).toBe(5);
            expect(session.totalTime).toBeGreaterThanOrEqual(59);
        });
    });

    describe('getAllSessions', () => {
        it('returns sorted sessions', async () => {
            mockSession.find.mockReturnValue({ sort: vi.fn().mockResolvedValue([{ _id: 's1' }]) });
            const res = mockRes();
            await getAllSessions(mockReq(), res);
            expect(res.json).toHaveBeenCalledWith([{ _id: 's1' }]);
        });
    });
});
