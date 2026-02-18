import { describe, it, expect } from 'vitest';
import { fetchCourses } from './api';

describe('Content API', () => {
    it('fetches courses', async () => {
        const courses = await fetchCourses();
        expect(courses).toEqual([]);
    });
});
