import z from 'zod';

export const postSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long').max(100, 'Title must be at most 100 characters long'),
  content: z.string().min(10, 'Content must be at least 10 characters long'),
  image: z.instanceof(File),
}); 