import { describe, it, expect, vi } from 'vitest';
import { createAssignment } from '../controllers_learning/assignmentController.js';
import Assignment from '../models/Assignment.js';

vi.mock('../models/Assignment.js', () => ({
    default: {
        create: vi.fn()
    }
}));

describe('Assignment Controller - createAssignment', () => {
    it('should create an assignment and return 201', async () => {
        const req = {
            body: {
                title: 'Test Assignment',
                description: 'Test Description',
                content: 'Test Content',
                disability: 'dyslexia',
                assignedStudents: [],
                dueDate: '2026-12-31'
            },
            user: { id: 'teacher123' }
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        const mockAssignment = { ...req.body, teacher: req.user.id, _id: 'assignment123' };
        Assignment.create.mockResolvedValue(mockAssignment);

        await createAssignment(req, res);

        expect(Assignment.create).toHaveBeenCalledWith({
            title: 'Test Assignment',
            description: 'Test Description',
            content: 'Test Content',
            disability: 'dyslexia',
            teacher: 'teacher123',
            assignedStudents: [],
            dueDate: '2026-12-31'
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockAssignment);
    });

    it('should return 500 on error', async () => {
        const req = {
            body: {},
            user: { id: 'teacher123' }
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        Assignment.create.mockRejectedValue(new Error('Database Error'));

        await createAssignment(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Database Error' });
    });
});
