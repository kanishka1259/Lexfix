import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- Mock Models ---
const mockAssignment = {
    findById: vi.fn(),
    find: vi.fn(),
    create: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
};

const mockUser = {
    find: vi.fn(),
};

vi.mock('../../../backend/models/Assignment.js', () => ({ default: mockAssignment }));
vi.mock('../../../backend/models/User.js', () => ({ default: mockUser }));

import {
    createAssignment,
    getAssignmentsByDisability,
    getStudentAssignments,
    getAssignment,
    updateAssignment,
    deleteAssignment,
    getStudentsByDisability,
} from '../../../backend/controllers_learning/assignmentController.js';

// --- Helpers ---
const mockReq = (overrides = {}) => ({
    body: {},
    params: {},
    user: { id: 'teacher1', _id: 'teacher1', role: 'teacher' },
    ...overrides,
});

const mockRes = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
};

describe('AssignmentController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ----------------------------------------------------------
    // CREATE ASSIGNMENT
    // ----------------------------------------------------------
    describe('createAssignment', () => {
        it('should create a new assignment', async () => {
            const assignment = { _id: 'a1', title: 'Read Aloud', disability: 'dyslexia' };
            mockAssignment.create.mockResolvedValueOnce(assignment);

            const req = mockReq({
                body: {
                    title: 'Read Aloud',
                    description: 'Practice reading',
                    content: 'Read the following text.',
                    disability: 'dyslexia',
                    assignedStudents: ['s1'],
                    dueDate: '2026-03-01',
                },
            });
            const res = mockRes();

            await createAssignment(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(assignment);
        });

        it('should handle server errors', async () => {
            mockAssignment.create.mockRejectedValueOnce(new Error('DB error'));

            const req = mockReq({ body: { title: 'X' } });
            const res = mockRes();

            await createAssignment(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // ----------------------------------------------------------
    // GET ASSIGNMENTS BY DISABILITY
    // ----------------------------------------------------------
    describe('getAssignmentsByDisability', () => {
        it('should return assignments filtered by disability and teacher', async () => {
            const assignments = [{ _id: 'a1', disability: 'adhd' }];
            mockAssignment.find.mockReturnValue({
                populate: vi.fn().mockReturnValue({
                    sort: vi.fn().mockResolvedValue(assignments),
                }),
            });

            const req = mockReq({ params: { disability: 'adhd' } });
            const res = mockRes();

            await getAssignmentsByDisability(req, res);

            expect(mockAssignment.find).toHaveBeenCalledWith({
                disability: 'adhd',
                teacher: 'teacher1',
                status: 'active',
            });
            expect(res.json).toHaveBeenCalledWith(assignments);
        });
    });

    // ----------------------------------------------------------
    // GET STUDENT ASSIGNMENTS
    // ----------------------------------------------------------
    describe('getStudentAssignments', () => {
        it('should return assignments for the requesting student', async () => {
            const assignments = [{ _id: 'a1' }];
            mockAssignment.find.mockReturnValue({
                populate: vi.fn().mockReturnValue({
                    sort: vi.fn().mockResolvedValue(assignments),
                }),
            });

            const req = mockReq({ user: { id: 's1', role: 'student' } });
            const res = mockRes();

            await getStudentAssignments(req, res);

            expect(mockAssignment.find).toHaveBeenCalledWith({
                assignedStudents: 's1',
                status: 'active',
            });
            expect(res.json).toHaveBeenCalledWith(assignments);
        });
    });

    // ----------------------------------------------------------
    // GET ASSIGNMENT
    // ----------------------------------------------------------
    describe('getAssignment', () => {
        it('should return 404 when assignment is not found', async () => {
            mockAssignment.findById.mockReturnValue({
                populate: vi.fn().mockReturnValue({
                    populate: vi.fn().mockResolvedValue(null),
                }),
            });

            const req = mockReq({ params: { id: 'bad' } });
            const res = mockRes();

            await getAssignment(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should return the assignment when found', async () => {
            const assignment = { _id: 'a1', title: 'Test' };
            mockAssignment.findById.mockReturnValue({
                populate: vi.fn().mockReturnValue({
                    populate: vi.fn().mockResolvedValue(assignment),
                }),
            });

            const req = mockReq({ params: { id: 'a1' } });
            const res = mockRes();

            await getAssignment(req, res);

            expect(res.json).toHaveBeenCalledWith(assignment);
        });
    });

    // ----------------------------------------------------------
    // UPDATE ASSIGNMENT
    // ----------------------------------------------------------
    describe('updateAssignment', () => {
        it('should return 404 when assignment is not found', async () => {
            mockAssignment.findById.mockResolvedValueOnce(null);

            const req = mockReq({ params: { id: 'bad' }, body: { title: 'Updated' } });
            const res = mockRes();

            await updateAssignment(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should return 403 when non-owner teacher tries to update', async () => {
            mockAssignment.findById.mockResolvedValueOnce({
                _id: 'a1',
                teacher: { toString: () => 'other-teacher' },
            });

            const req = mockReq({ params: { id: 'a1' }, body: { title: 'Updated' } });
            const res = mockRes();

            await updateAssignment(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('should update the assignment when authorized', async () => {
            mockAssignment.findById.mockResolvedValueOnce({
                _id: 'a1',
                teacher: { toString: () => 'teacher1' },
            });
            const updated = { _id: 'a1', title: 'Updated' };
            mockAssignment.findByIdAndUpdate.mockResolvedValueOnce(updated);

            const req = mockReq({ params: { id: 'a1' }, body: { title: 'Updated' } });
            const res = mockRes();

            await updateAssignment(req, res);

            expect(res.json).toHaveBeenCalledWith(updated);
        });
    });

    // ----------------------------------------------------------
    // DELETE ASSIGNMENT
    // ----------------------------------------------------------
    describe('deleteAssignment', () => {
        it('should return 404 when assignment is not found', async () => {
            mockAssignment.findById.mockResolvedValueOnce(null);

            const req = mockReq({ params: { id: 'bad' } });
            const res = mockRes();

            await deleteAssignment(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should return 403 when non-owner tries to delete', async () => {
            mockAssignment.findById.mockResolvedValueOnce({
                teacher: { toString: () => 'other' },
            });

            const req = mockReq({ params: { id: 'a1' } });
            const res = mockRes();

            await deleteAssignment(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('should delete the assignment when authorized', async () => {
            mockAssignment.findById.mockResolvedValueOnce({
                teacher: { toString: () => 'teacher1' },
            });
            mockAssignment.findByIdAndDelete.mockResolvedValueOnce(true);

            const req = mockReq({ params: { id: 'a1' } });
            const res = mockRes();

            await deleteAssignment(req, res);

            expect(res.json).toHaveBeenCalledWith({ message: 'Assignment deleted' });
        });
    });

    // ----------------------------------------------------------
    // GET STUDENTS BY DISABILITY
    // ----------------------------------------------------------
    describe('getStudentsByDisability', () => {
        it('should return students with the specified disability', async () => {
            const students = [{ name: 'S1', disability: 'adhd' }];
            mockUser.find.mockReturnValue({
                select: vi.fn().mockResolvedValue(students),
            });

            const req = mockReq({ params: { disability: 'ADHD' } });
            const res = mockRes();

            await getStudentsByDisability(req, res);

            expect(mockUser.find).toHaveBeenCalledWith({
                role: { $in: ['student', 'Student'] },
                disability: 'adhd',
            });
            expect(res.json).toHaveBeenCalledWith(students);
        });
    });
});
