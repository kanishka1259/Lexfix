import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockProgress } = vi.hoisted(() => ({
    mockProgress: { find: vi.fn(), findOne: vi.fn(), create: vi.fn() },
}));

vi.mock('../../../backend/models/Progress.js', () => ({ default: mockProgress }));

import { getProgress, updateProgress } from '../../../backend/controllers_learning/progressController.js';

const mockReq = (o = {}) => ({ body: {}, params: {}, ...o });
const mockRes = () => { const r = {}; r.status = vi.fn().mockReturnValue(r); r.json = vi.fn().mockReturnValue(r); return r; };

describe('ProgressController', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('getProgress', () => {
        it('returns all progress records', async () => {
            mockProgress.find.mockReturnValue({ sort: vi.fn().mockResolvedValue([{ lessonId: 'l1' }]) });
            const res = mockRes();
            await getProgress(mockReq(), res);
            expect(res.json).toHaveBeenCalledWith([{ lessonId: 'l1' }]);
        });
    });

    describe('updateProgress', () => {
        it('creates new progress when none exists', async () => {
            mockProgress.findOne.mockResolvedValueOnce(null);
            mockProgress.create.mockResolvedValueOnce({ lessonId: 'l1', completed: true, timeSpent: 30 });
            const res = mockRes();
            await updateProgress(mockReq({ params: { lessonId: 'l1' }, body: { completed: true, timeSpent: 30 } }), res);
            expect(mockProgress.create).toHaveBeenCalled();
        });

        it('updates existing progress', async () => {
            const existing = { completed: false, timeSpent: 10, save: vi.fn() };
            mockProgress.findOne.mockResolvedValueOnce(existing);
            const res = mockRes();
            await updateProgress(mockReq({ params: { lessonId: 'l1' }, body: { completed: true, timeSpent: 20 } }), res);
            expect(existing.completed).toBe(true);
            expect(existing.timeSpent).toBe(30);
        });
    });
});
