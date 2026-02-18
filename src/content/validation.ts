import { z } from 'zod';

export const CreateCourseSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
});

export const CreateLessonSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(50),
});
