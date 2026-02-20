import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- Mock Models ---
const mockTask = {
    findById: vi.fn(),
    find: vi.fn(),
    create: vi.fn(),
};

vi.mock('../../../backend/models/Task.js', () => ({ default: mockTask }));

import { createTask, getTasksByStudent, getTasksByTeacher, getTaskById } from '../../../backend/controllers/taskController.js';

// --- Helpers ---
const mockReq = (overrides = {}) => ({
    body: {},
    params: {},
    user: { id: 'teacher1', _id: 'teacher1', role: 'teacher' },
    file: null,
    ...overrides,
});

const mockRes = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
};

describe('TaskController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ----------------------------------------------------------
    // CREATE TASK
    // ----------------------------------------------------------
    describe('createTask', () => {
        it('should return 403 for non-teacher users', async () => {
            const req = mockReq({ user: { id: 's1', role: 'student' } });
            const res = mockRes();

            await createTask(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('should return 400 when required fields are missing', async () => {
            const req = mockReq({ body: { title: 'Task1' } }); // missing content, studentId
            const res = mockRes();

            await createTask(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should create a task successfully', async () => {
            const newTask = {
                _id: 'task1',
                title: 'Read Chapter 1',
                content: ['Sentence one.', 'Sentence two.'],
                assignedTo: ['student1'],
            };
            mockTask.create.mockResolvedValueOnce(newTask);

            const req = mockReq({
                body: { title: 'Read Chapter 1', content: ['Sentence one.', 'Sentence two.'], studentId: 'student1' },
            });
            const res = mockRes();

            await createTask(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true, data: newTask }),
            );
        });

        it('should handle file attachment', async () => {
            mockTask.create.mockResolvedValueOnce({ _id: 'task2', attachmentUrl: '/uploads/file.pdf' });

            const req = mockReq({
                body: { title: 'Task', content: 'Content', studentId: 's1' },
                file: { filename: 'file.pdf' },
            });
            const res = mockRes();

            await createTask(req, res);

            expect(mockTask.create).toHaveBeenCalledWith(
                expect.objectContaining({ attachmentUrl: '/uploads/file.pdf' }),
            );
        });
    });

    // ----------------------------------------------------------
    // GET TASKS BY STUDENT
    // ----------------------------------------------------------
    describe('getTasksByStudent', () => {
        it('should return 403 when student accesses another student tasks', async () => {
            const req = mockReq({
                user: { id: 's1', _id: 's1', role: 'student' },
                params: { studentId: 's2' },
            });
            const res = mockRes();

            await getTasksByStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('should return tasks for the requesting student', async () => {
            const tasks = [{ _id: 't1', title: 'Task 1' }];
            mockTask.find.mockReturnValue({ sort: vi.fn().mockResolvedValue(tasks) });

            const req = mockReq({
                user: { id: 's1', _id: 's1', role: 'student' },
                params: { studentId: 's1' },
            });
            const res = mockRes();

            await getTasksByStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ count: 1, data: tasks }),
            );
        });
    });

    // ----------------------------------------------------------
    // GET TASKS BY TEACHER
    // ----------------------------------------------------------
    describe('getTasksByTeacher', () => {
        it('should return tasks created by teacher', async () => {
            const tasks = [{ _id: 't1' }, { _id: 't2' }];
            mockTask.find.mockReturnValue({
                sort: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue(tasks) }),
            });

            const req = mockReq({ params: { teacherId: 'teacher1' } });
            const res = mockRes();

            await getTasksByTeacher(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ count: 2 }),
            );
        });
    });

    // ----------------------------------------------------------
    // GET TASK BY ID
    // ----------------------------------------------------------
    describe('getTaskById', () => {
        it('should return 404 when task is not found', async () => {
            mockTask.findById.mockResolvedValueOnce(null);

            const req = mockReq({ params: { id: 'nonexistent' } });
            const res = mockRes();

            await getTaskById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should return the task when found', async () => {
            const task = { _id: 't1', title: 'Task' };
            mockTask.findById.mockResolvedValueOnce(task);

            const req = mockReq({ params: { id: 't1' } });
            const res = mockRes();

            await getTaskById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ data: task }),
            );
        });
    });
});
