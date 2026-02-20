import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockAssignment, mockUser } = vi.hoisted(() => ({
    mockAssignment: { findById: vi.fn(), find: vi.fn(), create: vi.fn(), findByIdAndUpdate: vi.fn(), findByIdAndDelete: vi.fn() },
    mockUser: { find: vi.fn() },
}));

vi.mock('../../../backend/models/Assignment.js', () => ({ default: mockAssignment }));
vi.mock('../../../backend/models/User.js', () => ({ default: mockUser }));

import { createAssignment, getAssignmentsByDisability, getStudentAssignments, getAssignment, updateAssignment, deleteAssignment, getStudentsByDisability } from '../../../backend/controllers_learning/assignmentController.js';

const mockReq = (o = {}) => ({ body: {}, params: {}, user: { id: 'teacher1', _id: 'teacher1', role: 'teacher' }, ...o });
const mockRes = () => { const r = {}; r.status = vi.fn().mockReturnValue(r); r.json = vi.fn().mockReturnValue(r); return r; };

describe('AssignmentController', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('createAssignment', () => {
        it('creates a new assignment', async () => {
            const a = { _id: 'a1', title: 'Read' };
            mockAssignment.create.mockResolvedValueOnce(a);
            const res = mockRes();
            await createAssignment(mockReq({ body: { title: 'Read', content: 'Text', disability: 'dyslexia' } }), res);
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('handles server errors', async () => {
            mockAssignment.create.mockRejectedValueOnce(new Error('DB'));
            const res = mockRes();
            await createAssignment(mockReq({ body: { title: 'X' } }), res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getAssignmentsByDisability', () => {
        it('filters by disability and teacher', async () => {
            mockAssignment.find.mockReturnValue({ populate: vi.fn().mockReturnValue({ sort: vi.fn().mockResolvedValue([{ _id: 'a1' }]) }) });
            const res = mockRes();
            await getAssignmentsByDisability(mockReq({ params: { disability: 'adhd' } }), res);
            expect(mockAssignment.find).toHaveBeenCalledWith({ disability: 'adhd', teacher: 'teacher1', status: 'active' });
        });
    });

    describe('getStudentAssignments', () => {
        it('returns assignments for student', async () => {
            mockAssignment.find.mockReturnValue({ populate: vi.fn().mockReturnValue({ sort: vi.fn().mockResolvedValue([{ _id: 'a1' }]) }) });
            const res = mockRes();
            await getStudentAssignments(mockReq({ user: { id: 's1', role: 'student' } }), res);
            expect(res.json).toHaveBeenCalledWith([{ _id: 'a1' }]);
        });
    });

    describe('getAssignment', () => {
        it('returns 404 when not found', async () => {
            mockAssignment.findById.mockReturnValue({ populate: vi.fn().mockReturnValue({ populate: vi.fn().mockResolvedValue(null) }) });
            const res = mockRes();
            await getAssignment(mockReq({ params: { id: 'bad' } }), res);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('returns the assignment', async () => {
            mockAssignment.findById.mockReturnValue({ populate: vi.fn().mockReturnValue({ populate: vi.fn().mockResolvedValue({ _id: 'a1' }) }) });
            const res = mockRes();
            await getAssignment(mockReq({ params: { id: 'a1' } }), res);
            expect(res.json).toHaveBeenCalledWith({ _id: 'a1' });
        });
    });

    describe('updateAssignment', () => {
        it('returns 404 when not found', async () => {
            mockAssignment.findById.mockResolvedValueOnce(null);
            const res = mockRes();
            await updateAssignment(mockReq({ params: { id: 'bad' }, body: {} }), res);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('returns 403 for non-owner', async () => {
            mockAssignment.findById.mockResolvedValueOnce({ teacher: { toString: () => 'other' } });
            const res = mockRes();
            await updateAssignment(mockReq({ params: { id: 'a1' }, body: {} }), res);
            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('updates when authorized', async () => {
            mockAssignment.findById.mockResolvedValueOnce({ teacher: { toString: () => 'teacher1' } });
            mockAssignment.findByIdAndUpdate.mockResolvedValueOnce({ _id: 'a1', title: 'U' });
            const res = mockRes();
            await updateAssignment(mockReq({ params: { id: 'a1' }, body: { title: 'U' } }), res);
            expect(res.json).toHaveBeenCalledWith({ _id: 'a1', title: 'U' });
        });
    });

    describe('deleteAssignment', () => {
        it('returns 404 when not found', async () => {
            mockAssignment.findById.mockResolvedValueOnce(null);
            const res = mockRes();
            await deleteAssignment(mockReq({ params: { id: 'bad' } }), res);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('deletes when authorized', async () => {
            mockAssignment.findById.mockResolvedValueOnce({ teacher: { toString: () => 'teacher1' } });
            mockAssignment.findByIdAndDelete.mockResolvedValueOnce(true);
            const res = mockRes();
            await deleteAssignment(mockReq({ params: { id: 'a1' } }), res);
            expect(res.json).toHaveBeenCalledWith({ message: 'Assignment deleted' });
        });
    });

    describe('getStudentsByDisability', () => {
        it('returns filtered students', async () => {
            mockUser.find.mockReturnValue({ select: vi.fn().mockResolvedValue([{ name: 'S1' }]) });
            const res = mockRes();
            await getStudentsByDisability(mockReq({ params: { disability: 'ADHD' } }), res);
            expect(res.json).toHaveBeenCalledWith([{ name: 'S1' }]);
        });
    });
});
