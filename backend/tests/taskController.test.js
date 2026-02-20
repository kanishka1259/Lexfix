import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTask, getTasksByStudent, getTasksByTeacher, getTaskById } from '../controllers/taskController.js';
import Task from '../models/Task.js';

vi.mock('../models/Task.js', () => ({
    default: {
        create: vi.fn(),
        find: vi.fn(),
        findById: vi.fn(),
    }
}));

describe('Task Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            user: {},
            file: null
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        vi.clearAllMocks();
    });

    describe('createTask', () => {
        it('should create a task successfully as teacher', async () => {
            req.user = { id: 'teacher123', role: 'teacher' };
            req.body = {
                title: 'Math Homework',
                content: 'Solve problems 1-5',
                studentId: 'student123'
            };

            const mockTask = {
                _id: 'task123',
                title: 'Math Homework',
                description: 'Teacher Assigned Task',
                assignedTo: ['student123'],
                createdBy: 'teacher123',
                status: 'Published'
            };

            Task.create.mockResolvedValue(mockTask);

            await createTask(req, res);

            expect(Task.create).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Math Homework',
                description: 'Teacher Assigned Task',
                assignedTo: ['student123'],
                createdBy: 'teacher123'
            }));
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockTask
            });
        });

        it('should return 403 if not specific teacher role', async () => {
            req.user = { id: 'student123', role: 'student' };
            req.body = {
                title: 'Math Homework',
                content: 'Solve problems 1-5',
                studentId: 'student123'
            };

            await createTask(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: "Only teachers can create tasks" });
        });
    });

    describe('getTasksByStudent', () => {
        it('should return tasks for a student', async () => {
            req.params.studentId = 'student123';
            req.user = { id: 'student123', role: 'student' };

            const mockTasks = [
                { _id: 'task1', title: 'Task 1' },
                { _id: 'task2', title: 'Task 2' }
            ];

            // Chainable mock for sort
            const mockFind = {
                sort: vi.fn().mockResolvedValue(mockTasks)
            };
            Task.find.mockReturnValue(mockFind);

            await getTasksByStudent(req, res);

            expect(Task.find).toHaveBeenCalledWith({ assignedTo: 'student123' });
            expect(mockFind.sort).toHaveBeenCalledWith({ createdAt: -1 });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                count: 2,
                data: mockTasks
            });
        });

        it('should return 403 if student tries to view another student tasks', async () => {
            req.params.studentId = 'otherStudent';
            req.user = { id: 'student123', role: 'student' };

            await getTasksByStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
        });
    });

    describe('getTasksByTeacher', () => {
        it('should return tasks created by a teacher', async () => {
            req.params.teacherId = 'teacher123';

            const mockTasks = [
                { _id: 'task1', title: 'Task 1' }
            ];

            // Chainable mock for sort and limit
            const mockLimit = {
                limit: vi.fn().mockResolvedValue(mockTasks) // This is the final Promise
            };
            const mockSort = {
                sort: vi.fn().mockReturnValue(mockLimit) // Returns object with limit
            };
            Task.find.mockReturnValue(mockSort);

            await getTasksByTeacher(req, res);

            expect(Task.find).toHaveBeenCalledWith({ createdBy: 'teacher123' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                count: 1,
                data: mockTasks
            });
        });
    });
});
