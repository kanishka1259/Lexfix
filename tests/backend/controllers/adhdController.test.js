import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- Mock Models ---
const mockADHDSession = {
    findById: vi.fn(),
    findOne: vi.fn(),
    find: vi.fn(),
    create: vi.fn(),
};

const mockTask = {
    findById: vi.fn(),
};

vi.mock('../../../backend/models/ADHDSession.js', () => ({ default: mockADHDSession }));
vi.mock('../../../backend/models/Task.js', () => ({ default: mockTask }));

import {
    startSession,
    trackSentence,
    recordBreak,
    completeSession,
    getProgress,
    getActiveSession,
} from '../../../backend/controllers/adhdController.js';

// --- Helpers ---
const mockReq = (overrides = {}) => ({
    body: {},
    params: {},
    user: { id: 'user1', _id: 'user1' },
    ...overrides,
});

const mockRes = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
};

describe('ADHDController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ----------------------------------------------------------
    // START SESSION
    // ----------------------------------------------------------
    describe('startSession', () => {
        it('should return 404 when task is not found', async () => {
            mockTask.findById.mockResolvedValueOnce(null);

            const req = mockReq({ body: { taskId: 'bad-id' } });
            const res = mockRes();

            await startSession(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
        });

        it('should create a new ADHD session', async () => {
            mockTask.findById.mockResolvedValueOnce({
                _id: 'task1',
                content: ['Sentence 1.', 'Sentence 2.'],
            });

            const createdSession = { _id: 'session1', userId: 'user1', taskId: 'task1' };
            mockADHDSession.create.mockResolvedValueOnce(createdSession);

            const req = mockReq({ body: { taskId: 'task1' } });
            const res = mockRes();

            await startSession(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true, data: createdSession }),
            );
        });
    });

    // ----------------------------------------------------------
    // TRACK SENTENCE
    // ----------------------------------------------------------
    describe('trackSentence', () => {
        it('should return 404 when session is not found', async () => {
            mockADHDSession.findById.mockResolvedValueOnce(null);

            const req = mockReq({ body: { sessionId: 'bad', sentenceIndex: 0, timeSpent: 10 } });
            const res = mockRes();

            await trackSentence(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should update sentence completion', async () => {
            const session = {
                _id: 's1',
                sentences: [{ index: 0, content: 'Test', timeSpent: 0, completed: false }],
                currentSentenceIndex: 0,
                save: vi.fn().mockResolvedValue(true),
            };
            mockADHDSession.findById.mockResolvedValueOnce(session);

            const req = mockReq({ body: { sessionId: 's1', sentenceIndex: 0, timeSpent: 15 } });
            const res = mockRes();

            await trackSentence(req, res);

            expect(session.sentences[0].timeSpent).toBe(15);
            expect(session.sentences[0].completed).toBe(true);
            expect(session.currentSentenceIndex).toBe(1);
            expect(session.save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });
    });

    // ----------------------------------------------------------
    // RECORD BREAK
    // ----------------------------------------------------------
    describe('recordBreak', () => {
        it('should return 404 when session is not found', async () => {
            mockADHDSession.findById.mockResolvedValueOnce(null);

            const req = mockReq({ body: { sessionId: 'bad' } });
            const res = mockRes();

            await recordBreak(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should increment break count', async () => {
            const session = { _id: 's1', breaksTaken: 2, save: vi.fn().mockResolvedValue(true) };
            mockADHDSession.findById.mockResolvedValueOnce(session);

            const req = mockReq({ body: { sessionId: 's1' } });
            const res = mockRes();

            await recordBreak(req, res);

            expect(session.breaksTaken).toBe(3);
            expect(session.save).toHaveBeenCalled();
        });
    });

    // ----------------------------------------------------------
    // COMPLETE SESSION
    // ----------------------------------------------------------
    describe('completeSession', () => {
        it('should return 404 when session is not found', async () => {
            mockADHDSession.findById.mockResolvedValueOnce(null);

            const req = mockReq({ body: { sessionId: 'bad' } });
            const res = mockRes();

            await completeSession(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should mark session as completed and return stats', async () => {
            const session = {
                _id: 's1',
                sentences: [
                    { completed: true, timeSpent: 10 },
                    { completed: true, timeSpent: 20 },
                ],
                totalTime: 30,
                breaksTaken: 1,
                save: vi.fn().mockResolvedValue(true),
            };
            mockADHDSession.findById.mockResolvedValueOnce(session);

            const req = mockReq({ body: { sessionId: 's1', moduleCompleted: 2 } });
            const res = mockRes();

            await completeSession(req, res);

            expect(session.completionStatus).toBe('Completed');
            expect(session.moduleCompleted).toBe(2);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    stats: expect.objectContaining({ totalSentences: 2, completedSentences: 2 }),
                }),
            );
        });
    });

    // ----------------------------------------------------------
    // GET PROGRESS
    // ----------------------------------------------------------
    describe('getProgress', () => {
        it('should return sessions and aggregated stats', async () => {
            const sessions = [
                { completionStatus: 'Completed', totalTime: 100, moduleCompleted: 1 },
                { completionStatus: 'In Progress', totalTime: 0, moduleCompleted: null },
            ];

            mockADHDSession.find.mockReturnValue({
                populate: vi.fn().mockReturnValue({
                    sort: vi.fn().mockResolvedValue(sessions),
                }),
            });

            const req = mockReq({ params: { userId: 'user1' } });
            const res = mockRes();

            await getProgress(req, res);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({
                        stats: expect.objectContaining({
                            totalSessions: 2,
                            completedSessions: 1,
                        }),
                    }),
                }),
            );
        });
    });

    // ----------------------------------------------------------
    // GET ACTIVE SESSION
    // ----------------------------------------------------------
    describe('getActiveSession', () => {
        it('should return active session for user', async () => {
            const session = { _id: 's1', completionStatus: 'In Progress' };
            mockADHDSession.findOne.mockReturnValue({
                populate: vi.fn().mockResolvedValue(session),
            });

            const req = mockReq();
            const res = mockRes();

            await getActiveSession(req, res);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true, data: session }),
            );
        });

        it('should return null data when no active session', async () => {
            mockADHDSession.findOne.mockReturnValue({
                populate: vi.fn().mockResolvedValue(null),
            });

            const req = mockReq();
            const res = mockRes();

            await getActiveSession(req, res);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true, data: null }),
            );
        });
    });
});
