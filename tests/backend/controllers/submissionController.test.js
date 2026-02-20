import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- Mock Models ---
const mockSubmission = {
    findOne: vi.fn(),
    find: vi.fn(),
    create: vi.fn(),
};

const mockReadingSession = {
    findById: vi.fn(),
    create: vi.fn(),
};

vi.mock('../../../backend/models/Submission.js', () => ({ default: mockSubmission }));
vi.mock('../../../backend/models/Assignment.js', () => ({ default: {} }));
vi.mock('../../../backend/models/ReadingSession.js', () => ({ default: mockReadingSession }));

import {
    upsertSubmission,
    getStudentSubmission,
    getAllStudentSubmissions,
    getAssignmentSubmissions,
    startReadingSession,
    updateReadingSession,
} from '../../../backend/controllers_learning/submissionController.js';

// --- Helpers ---
const mockReq = (overrides = {}) => ({
    body: {},
    params: {},
    user: { id: 'student1', _id: 'student1', role: 'student' },
    ...overrides,
});

const mockRes = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
};

describe('SubmissionController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ----------------------------------------------------------
    // UPSERT SUBMISSION
    // ----------------------------------------------------------
    describe('upsertSubmission', () => {
        it('should create a new submission when none exists', async () => {
            mockSubmission.findOne.mockResolvedValueOnce(null);
            const newSub = { _id: 'sub1', status: 'in-progress' };
            mockSubmission.create.mockResolvedValueOnce(newSub);

            const req = mockReq({
                body: { assignmentId: 'a1', currentSentenceIndex: 0, timeSpent: 0 },
            });
            const res = mockRes();

            await upsertSubmission(req, res);

            expect(mockSubmission.create).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(newSub);
        });

        it('should update existing submission', async () => {
            const existing = {
                _id: 'sub1',
                currentSentenceIndex: 0,
                timeSpent: 10,
                completedSentences: [0],
                status: 'in-progress',
                save: vi.fn().mockResolvedValue(true),
            };
            mockSubmission.findOne.mockResolvedValueOnce(existing);

            const req = mockReq({
                body: { assignmentId: 'a1', currentSentenceIndex: 1, timeSpent: 25 },
            });
            const res = mockRes();

            await upsertSubmission(req, res);

            expect(existing.currentSentenceIndex).toBe(1);
            expect(existing.timeSpent).toBe(25);
            expect(existing.save).toHaveBeenCalled();
        });

        it('should set completedAt when status is completed', async () => {
            const existing = {
                _id: 'sub1',
                currentSentenceIndex: 0,
                completedSentences: [],
                status: 'in-progress',
                completedAt: null,
                save: vi.fn().mockResolvedValue(true),
            };
            mockSubmission.findOne.mockResolvedValueOnce(existing);

            const req = mockReq({
                body: { assignmentId: 'a1', status: 'completed' },
            });
            const res = mockRes();

            await upsertSubmission(req, res);

            expect(existing.status).toBe('completed');
            expect(existing.completedAt).toBeInstanceOf(Date);
        });
    });

    // ----------------------------------------------------------
    // GET STUDENT SUBMISSION
    // ----------------------------------------------------------
    describe('getStudentSubmission', () => {
        it('should return submission for the given assignment', async () => {
            const sub = { _id: 'sub1', assignment: 'a1' };
            mockSubmission.findOne.mockReturnValue({
                populate: vi.fn().mockResolvedValue(sub),
            });

            const req = mockReq({ params: { assignmentId: 'a1' } });
            const res = mockRes();

            await getStudentSubmission(req, res);

            expect(res.json).toHaveBeenCalledWith(sub);
        });
    });

    // ----------------------------------------------------------
    // GET ALL STUDENT SUBMISSIONS
    // ----------------------------------------------------------
    describe('getAllStudentSubmissions', () => {
        it('should return all submissions for a student', async () => {
            const subs = [{ _id: 'sub1' }, { _id: 'sub2' }];
            mockSubmission.find.mockReturnValue({
                populate: vi.fn().mockReturnValue({
                    sort: vi.fn().mockResolvedValue(subs),
                }),
            });

            const req = mockReq();
            const res = mockRes();

            await getAllStudentSubmissions(req, res);

            expect(res.json).toHaveBeenCalledWith(subs);
        });
    });

    // ----------------------------------------------------------
    // GET ASSIGNMENT SUBMISSIONS
    // ----------------------------------------------------------
    describe('getAssignmentSubmissions', () => {
        it('should return all submissions for an assignment', async () => {
            const subs = [{ _id: 'sub1', student: 's1' }];
            mockSubmission.find.mockReturnValue({
                populate: vi.fn().mockReturnValue({
                    sort: vi.fn().mockResolvedValue(subs),
                }),
            });

            const req = mockReq({ params: { assignmentId: 'a1' } });
            const res = mockRes();

            await getAssignmentSubmissions(req, res);

            expect(res.json).toHaveBeenCalledWith(subs);
        });
    });

    // ----------------------------------------------------------
    // START READING SESSION
    // ----------------------------------------------------------
    describe('startReadingSession', () => {
        it('should create a new reading session', async () => {
            const session = { _id: 'rs1', isActive: true };
            mockReadingSession.create.mockResolvedValueOnce(session);

            const req = mockReq({
                body: { assignmentId: 'a1', submissionId: 'sub1' },
            });
            const res = mockRes();

            await startReadingSession(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(session);
        });
    });

    // ----------------------------------------------------------
    // UPDATE READING SESSION
    // ----------------------------------------------------------
    describe('updateReadingSession', () => {
        it('should return 404 when session is not found', async () => {
            mockReadingSession.findById.mockResolvedValueOnce(null);

            const req = mockReq({ params: { sessionId: 'bad' } });
            const res = mockRes();

            await updateReadingSession(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should update session with sentence read and end session', async () => {
            const session = {
                _id: 'rs1',
                sentencesRead: [],
                distractionEvents: [],
                breakEvents: [],
                isActive: true,
                save: vi.fn().mockResolvedValue(true),
            };
            mockReadingSession.findById.mockResolvedValueOnce(session);

            const req = mockReq({
                params: { sessionId: 'rs1' },
                body: {
                    sentenceRead: { index: 0, timeSpent: 5 },
                    endSession: true,
                },
            });
            const res = mockRes();

            await updateReadingSession(req, res);

            expect(session.sentencesRead.length).toBe(1);
            expect(session.isActive).toBe(false);
            expect(session.endTime).toBeInstanceOf(Date);
            expect(session.save).toHaveBeenCalled();
        });
    });
});
