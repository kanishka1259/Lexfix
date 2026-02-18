export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  published: boolean;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  order: number;
  content: string;
}
