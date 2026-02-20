import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockTask } = vi.hoisted(() => ({
    mockTask: { findById: vi.fn(), find: vi.fn(), create: vi.fn() },
}));

vi.mock('../../../backend/models/Task.js', () => ({ default: mockTask }));

import { createTask, getTasksByStudent, getTasksByTeacher, getTaskById } from '../../../backend/controllers/taskController.js';

const mockReq = (o = {}) => ({ body: {}, params: {}, user: { id: 'teacher1', _id: 'teacher1', role: 'teacher' }, file: null, ...o });
const mockRes = () => { const r = {}; r.status = vi.fn().mockReturnValue(r); r.json = vi.fn().mockReturnValue(r); return r; };

describe('TaskController', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('createTask', () => {
        it('returns 403 for non-teacher', async () => {
            const res = mockRes();
            await createTask(mockReq({ user: { id: 's1', role: 'student' } }), res);
            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('returns 400 when required fields are missing', async () => {
            const res = mockRes();
            await createTask(mockReq({ body: { title: 'T' } }), res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('creates a task successfully', async () => {
            const task = { _id: 't1', title: 'Read', content: ['S1.', 'S2.'] };
            mockTask.create.mockResolvedValueOnce(task);
            const res = mockRes();
            await createTask(mockReq({ body: { title: 'Read', content: ['S1.', 'S2.'], studentId: 's1' } }), res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: task }));
        });

        it('handles file attachment', async () => {
            mockTask.create.mockResolvedValueOnce({ _id: 't2' });
            const res = mockRes();
            await createTask(mockReq({ body: { title: 'T', content: 'C', studentId: 's1' }, file: { filename: 'f.pdf' } }), res);
            expect(mockTask.create).toHaveBeenCalledWith(expect.objectContaining({ attachmentUrl: '/uploads/f.pdf' }));
        });
    });

    describe('getTasksByStudent', () => {
        it('returns 403 when accessing another student', async () => {
            const res = mockRes();
            await getTasksByStudent(mockReq({ user: { id: 's1', _id: 's1', role: 'student' }, params: { studentId: 's2' } }), res);
            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('returns tasks for the student', async () => {
            mockTask.find.mockReturnValue({ sort: vi.fn().mockResolvedValue([{ _id: 't1' }]) });
            const res = mockRes();
            await getTasksByStudent(mockReq({ user: { id: 's1', _id: 's1', role: 'student' }, params: { studentId: 's1' } }), res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('getTasksByTeacher', () => {
        it('returns tasks created by teacher', async () => {
            mockTask.find.mockReturnValue({ sort: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([{ _id: 't1' }]) }) });
            const res = mockRes();
            await getTasksByTeacher(mockReq({ params: { teacherId: 'teacher1' } }), res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('getTaskById', () => {
        it('returns 404 when not found', async () => {
            mockTask.findById.mockResolvedValueOnce(null);
            const res = mockRes();
            await getTaskById(mockReq({ params: { id: 'bad' } }), res);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('returns the task', async () => {
            mockTask.findById.mockResolvedValueOnce({ _id: 't1' });
            const res = mockRes();
            await getTaskById(mockReq({ params: { id: 't1' } }), res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
