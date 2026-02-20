import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockADHDSession, mockTask } = vi.hoisted(() => ({
    mockADHDSession: { findById: vi.fn(), findOne: vi.fn(), find: vi.fn(), create: vi.fn() },
    mockTask: { findById: vi.fn() },
}));

vi.mock('../../../backend/models/ADHDSession.js', () => ({ default: mockADHDSession }));
vi.mock('../../../backend/models/Task.js', () => ({ default: mockTask }));

import { startSession, trackSentence, recordBreak, completeSession, getProgress, getActiveSession } from '../../../backend/controllers/adhdController.js';

const mockReq = (o = {}) => ({ body: {}, params: {}, user: { id: 'u1', _id: 'u1' }, ...o });
const mockRes = () => { const r = {}; r.status = vi.fn().mockReturnValue(r); r.json = vi.fn().mockReturnValue(r); return r; };

describe('ADHDController', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('startSession', () => {
        it('returns 404 when task not found', async () => {
            mockTask.findById.mockResolvedValueOnce(null);
            const res = mockRes();
            await startSession(mockReq({ body: { taskId: 'bad' } }), res);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('creates a session', async () => {
            mockTask.findById.mockResolvedValueOnce({ _id: 't1', content: ['S1.', 'S2.'] });
            mockADHDSession.create.mockResolvedValueOnce({ _id: 's1' });
            const res = mockRes();
            await startSession(mockReq({ body: { taskId: 't1' } }), res);
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('trackSentence', () => {
        it('returns 404 when session not found', async () => {
            mockADHDSession.findById.mockResolvedValueOnce(null);
            const res = mockRes();
            await trackSentence(mockReq({ body: { sessionId: 'bad', sentenceIndex: 0, timeSpent: 10 } }), res);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('updates sentence completion', async () => {
            const session = { sentences: [{ index: 0, content: 'T', timeSpent: 0, completed: false }], currentSentenceIndex: 0, save: vi.fn() };
            mockADHDSession.findById.mockResolvedValueOnce(session);
            const res = mockRes();
            await trackSentence(mockReq({ body: { sessionId: 's1', sentenceIndex: 0, timeSpent: 15 } }), res);
            expect(session.sentences[0].timeSpent).toBe(15);
            expect(session.sentences[0].completed).toBe(true);
        });
    });

    describe('recordBreak', () => {
        it('returns 404 when session not found', async () => {
            mockADHDSession.findById.mockResolvedValueOnce(null);
            const res = mockRes();
            await recordBreak(mockReq({ body: { sessionId: 'bad' } }), res);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('increments break count', async () => {
            const session = { breaksTaken: 2, save: vi.fn() };
            mockADHDSession.findById.mockResolvedValueOnce(session);
            const res = mockRes();
            await recordBreak(mockReq({ body: { sessionId: 's1' } }), res);
            expect(session.breaksTaken).toBe(3);
        });
    });

    describe('completeSession', () => {
        it('returns 404 when session not found', async () => {
            mockADHDSession.findById.mockResolvedValueOnce(null);
            const res = mockRes();
            await completeSession(mockReq({ body: { sessionId: 'bad' } }), res);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('marks session as completed', async () => {
            const session = { sentences: [{ completed: true, timeSpent: 10 }], totalTime: 10, breaksTaken: 1, save: vi.fn() };
            mockADHDSession.findById.mockResolvedValueOnce(session);
            const res = mockRes();
            await completeSession(mockReq({ body: { sessionId: 's1', moduleCompleted: 2 } }), res);
            expect(session.completionStatus).toBe('Completed');
        });
    });

    describe('getProgress', () => {
        it('returns sessions and stats', async () => {
            mockADHDSession.find.mockReturnValue({ populate: vi.fn().mockReturnValue({ sort: vi.fn().mockResolvedValue([{ completionStatus: 'Completed', totalTime: 100, moduleCompleted: 1 }]) }) });
            const res = mockRes();
            await getProgress(mockReq({ params: { userId: 'u1' } }), res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });
    });

    describe('getActiveSession', () => {
        it('returns active session', async () => {
            mockADHDSession.findOne.mockReturnValue({ populate: vi.fn().mockResolvedValue({ _id: 's1' }) });
            const res = mockRes();
            await getActiveSession(mockReq(), res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('returns null when no active session', async () => {
            mockADHDSession.findOne.mockReturnValue({ populate: vi.fn().mockResolvedValue(null) });
            const res = mockRes();
            await getActiveSession(mockReq(), res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: null }));
        });
    });
});
