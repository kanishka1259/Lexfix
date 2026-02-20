import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockProgress = { find: vi.fn(), findOne: vi.fn(), create: vi.fn() };
vi.mock('../../../backend/models/Progress.js', () => ({ default: mockProgress }));

import { getProgress, updateProgress } from '../../../backend/controllers_learning/progressController.js';

const mockReq = (o = {}) => ({ body: {}, params: {}, ...o });
const mockRes = () => { const r = {}; r.status = vi.fn().mockReturnValue(r); r.json = vi.fn().mockReturnValue(r); return r; };

describe('ProgressController', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('getProgress', () => {
        it('returns all progress records', async () => {
            const records = [{ lessonId: 'l1', completed: true }];
            mockProgress.find.mockReturnValue({ sort: vi.fn().mockResolvedValue(records) });
            const res = mockRes();
            await getProgress(mockReq(), res);
            expect(res.json).toHaveBeenCalledWith(records);
        });
    });

    describe('updateProgress', () => {
        it('creates new progress when none exists', async () => {
            mockProgress.findOne.mockResolvedValueOnce(null);
            const created = { lessonId: 'l1', completed: true, timeSpent: 30 };
            mockProgress.create.mockResolvedValueOnce(created);
            const res = mockRes();
            await updateProgress(mockReq({ params: { lessonId: 'l1' }, body: { completed: true, timeSpent: 30 } }), res);
            expect(mockProgress.create).toHaveBeenCalledWith({ lessonId: 'l1', completed: true, timeSpent: 30 });
            expect(res.json).toHaveBeenCalledWith(created);
        });

        it('updates existing progress', async () => {
            const existing = { lessonId: 'l1', completed: false, timeSpent: 10, save: vi.fn().mockResolvedValue(true) };
            mockProgress.findOne.mockResolvedValueOnce(existing);
            const res = mockRes();
            await updateProgress(mockReq({ params: { lessonId: 'l1' }, body: { completed: true, timeSpent: 20 } }), res);
            expect(existing.completed).toBe(true);
            expect(existing.timeSpent).toBe(30); // 10 + 20
            expect(existing.save).toHaveBeenCalled();
        });
    });
});
