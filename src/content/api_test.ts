import { describe, it, expect, vi } from 'vitest';
import { fetchCourses } from './api';
import { MOCK_COURSES } from './data';

vi.mock('./api', async (importOriginal) => {
  const mod = await importOriginal<typeof import('./api')>();
  return {
    ...mod,
    fetchCourses: vi.fn().mockResolvedValue(MOCK_COURSES),
  };
});

describe('Content API', () => {
    it('fetches mock courses', async () => {
        const courses = await fetchCourses();
        expect(courses).toEqual(MOCK_COURSES);
        expect(courses).toHaveLength(2);
    });
});
