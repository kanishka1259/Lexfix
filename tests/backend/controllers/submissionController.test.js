import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockSubmission, mockReadingSession } = vi.hoisted(() => ({
    mockSubmission: { findOne: vi.fn(), find: vi.fn(), create: vi.fn() },
    mockReadingSession: { findById: vi.fn(), create: vi.fn() },
}));

vi.mock('../../../backend/models/Submission.js', () => ({ default: mockSubmission }));
vi.mock('../../../backend/models/Assignment.js', () => ({ default: {} }));
vi.mock('../../../backend/models/ReadingSession.js', () => ({ default: mockReadingSession }));

import { upsertSubmission, getStudentSubmission, getAllStudentSubmissions, getAssignmentSubmissions, startReadingSession, updateReadingSession } from '../../../backend/controllers_learning/submissionController.js';

const mockReq = (o = {}) => ({ body: {}, params: {}, user: { id: 's1', _id: 's1', role: 'student' }, ...o });
const mockRes = () => { const r = {}; r.status = vi.fn().mockReturnValue(r); r.json = vi.fn().mockReturnValue(r); return r; };

describe('SubmissionController', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('upsertSubmission', () => {
        it('creates new submission when none exists', async () => {
            mockSubmission.findOne.mockResolvedValueOnce(null);
            mockSubmission.create.mockResolvedValueOnce({ _id: 'sub1', status: 'in-progress' });
            const res = mockRes();
            await upsertSubmission(mockReq({ body: { assignmentId: 'a1', currentSentenceIndex: 0 } }), res);
            expect(mockSubmission.create).toHaveBeenCalled();
        });

        it('updates existing submission', async () => {
            const existing = { currentSentenceIndex: 0, timeSpent: 10, completedSentences: [0], status: 'in-progress', save: vi.fn() };
            mockSubmission.findOne.mockResolvedValueOnce(existing);
            const res = mockRes();
            await upsertSubmission(mockReq({ body: { assignmentId: 'a1', currentSentenceIndex: 1, timeSpent: 25 } }), res);
            expect(existing.currentSentenceIndex).toBe(1);
        });

        it('sets completedAt when completed', async () => {
            const existing = { currentSentenceIndex: 0, completedSentences: [], status: 'in-progress', completedAt: null, save: vi.fn() };
            mockSubmission.findOne.mockResolvedValueOnce(existing);
            const res = mockRes();
            await upsertSubmission(mockReq({ body: { assignmentId: 'a1', status: 'completed' } }), res);
            expect(existing.status).toBe('completed');
            expect(existing.completedAt).toBeInstanceOf(Date);
        });
    });

    describe('getStudentSubmission', () => {
        it('returns submission', async () => {
            mockSubmission.findOne.mockReturnValue({ populate: vi.fn().mockResolvedValue({ _id: 'sub1' }) });
            const res = mockRes();
            await getStudentSubmission(mockReq({ params: { assignmentId: 'a1' } }), res);
            expect(res.json).toHaveBeenCalledWith({ _id: 'sub1' });
        });
    });

    describe('getAllStudentSubmissions', () => {
        it('returns all submissions', async () => {
            mockSubmission.find.mockReturnValue({ populate: vi.fn().mockReturnValue({ sort: vi.fn().mockResolvedValue([{ _id: 'sub1' }]) }) });
            const res = mockRes();
            await getAllStudentSubmissions(mockReq(), res);
            expect(res.json).toHaveBeenCalledWith([{ _id: 'sub1' }]);
        });
    });

    describe('getAssignmentSubmissions', () => {
        it('returns submissions for an assignment', async () => {
            mockSubmission.find.mockReturnValue({ populate: vi.fn().mockReturnValue({ sort: vi.fn().mockResolvedValue([{ _id: 'sub1' }]) }) });
            const res = mockRes();
            await getAssignmentSubmissions(mockReq({ params: { assignmentId: 'a1' } }), res);
            expect(res.json).toHaveBeenCalledWith([{ _id: 'sub1' }]);
        });
    });

    describe('startReadingSession', () => {
        it('creates a reading session', async () => {
            mockReadingSession.create.mockResolvedValueOnce({ _id: 'rs1' });
            const res = mockRes();
            await startReadingSession(mockReq({ body: { assignmentId: 'a1', submissionId: 'sub1' } }), res);
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('updateReadingSession', () => {
        it('returns 404 when not found', async () => {
            mockReadingSession.findById.mockResolvedValueOnce(null);
            const res = mockRes();
            await updateReadingSession(mockReq({ params: { sessionId: 'bad' } }), res);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('updates session', async () => {
            const session = { sentencesRead: [], distractionEvents: [], breakEvents: [], isActive: true, save: vi.fn() };
            mockReadingSession.findById.mockResolvedValueOnce(session);
            const res = mockRes();
            await updateReadingSession(mockReq({ params: { sessionId: 'rs1' }, body: { sentenceRead: { index: 0, timeSpent: 5 }, endSession: true } }), res);
            expect(session.isActive).toBe(false);
        });
    });
});
