import { Course } from './types';
import { CreateCourseSchema } from './validation';

export class ContentService {
    async getFeaturedCourses(): Promise<Course[]> {
        // Logic to get featured courses
        return [];
    }

    async validateAndCreate(data: unknown): Promise<Course | null> {
        const result = CreateCourseSchema.safeParse(data);
        if (!result.success) return null;
        
        // Create logic
        return {
            id: 'new-id',
            ...result.data,
            published: false
        } as Course;
    }
}
