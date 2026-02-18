import { z } from 'zod';

export const CreateCourseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  level: z.enum(['beginner', 'intermediate', 'advanced'], {
    errorMap: () => ({ message: "Invalid level selected" })
  }),
});

export const CreateLessonSchema = z.object({
  title: z.string().min(3, "Title too short"),
  content: z.string().min(50, "Content must be substantial"),
});
