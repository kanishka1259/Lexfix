import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockUser = { findById: vi.fn(), findOne: vi.fn() };
const mockSubmission = { find: vi.fn() };
const mockAssignment = { find: vi.fn() };

vi.mock('../../../backend/models/User.js', () => ({ default: mockUser }));
vi.mock('../../../backend/models/Submission.js', () => ({ default: mockSubmission }));
vi.mock('../../../backend/models/Assignment.js', () => ({ default: mockAssignment }));

import { linkChild, getChildren, getChildProgress, getChildAssignments } from '../../../backend/controllers_learning/parentController.js';

const mockReq = (o = {}) => ({ body: {}, params: {}, user: { _id: 'p1', id: 'p1', role: 'parent' }, ...o });
const mockRes = () => { const r = {}; r.status = vi.fn().mockReturnValue(r); r.json = vi.fn().mockReturnValue(r); return r; };

describe('ParentController', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('linkChild', () => {
        it('returns 404 when child not found', async () => {
            mockUser.findOne.mockResolvedValueOnce(null);
            const res = mockRes();
            await linkChild(mockReq({ body: { childEmail: 'no@m.com' } }), res);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('links child successfully', async () => {
            const child = { _id: 'c1', name: 'C', email: 'c@m.com', disability: ['adhd'], save: vi.fn() };
            mockUser.findOne.mockResolvedValueOnce(child);
            mockUser.findById.mockResolvedValueOnce({ children: [], save: vi.fn() });
            const res = mockRes();
            await linkChild(mockReq({ body: { childEmail: 'c@m.com' } }), res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Child linked successfully' }));
        });
    });

    describe('getChildren', () => {
        it('returns children', async () => {
            mockUser.findById.mockReturnValue({ populate: vi.fn().mockResolvedValue({ children: [{ name: 'C1' }] }) });
            const res = mockRes();
            await getChildren(mockReq(), res);
            expect(res.json).toHaveBeenCalledWith([{ name: 'C1' }]);
        });
    });

    describe('getChildProgress', () => {
        it('returns 403 for unauthorized parent', async () => {
            mockUser.findById.mockResolvedValueOnce({ children: [] });
            const res = mockRes();
            await getChildProgress(mockReq({ params: { childId: 'c1' } }), res);
            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('returns progress stats', async () => {
            mockUser.findById.mockResolvedValueOnce({ children: ['c1'] }).mockReturnValue({ select: vi.fn().mockResolvedValue({ name: 'C1' }) });
            mockSubmission.find.mockReturnValue({ populate: vi.fn().mockReturnValue({ sort: vi.fn().mockResolvedValue([{ status: 'completed', timeSpent: 60, distractionCount: 2, breaksTaken: 1 }]) }) });
            const res = mockRes();
            await getChildProgress(mockReq({ params: { childId: 'c1' } }), res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ statistics: expect.objectContaining({ completedAssignments: 1 }) }));
        });
    });

    describe('getChildAssignments', () => {
        it('returns 403 for unauthorized parent', async () => {
            mockUser.findById.mockResolvedValueOnce({ children: [] });
            const res = mockRes();
            await getChildAssignments(mockReq({ params: { childId: 'c1' } }), res);
            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('returns assignments', async () => {
            mockUser.findById.mockResolvedValueOnce({ children: ['c1'] });
            mockAssignment.find.mockReturnValue({ populate: vi.fn().mockReturnValue({ sort: vi.fn().mockResolvedValue([{ _id: 'a1' }]) }) });
            const res = mockRes();
            await getChildAssignments(mockReq({ params: { childId: 'c1' } }), res);
            expect(res.json).toHaveBeenCalledWith([{ _id: 'a1' }]);
        });
    });
});
