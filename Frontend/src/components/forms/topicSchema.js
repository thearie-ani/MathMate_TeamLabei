import { z } from 'zod';

export const topicSchema = z.object({
  courseId: z.string().min(1, 'Course is required'),
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(180),
  content: z.string().optional().default(''),
  status: z.enum(['draft', 'published']),
  order: z.coerce.number().int().min(0).optional().default(0),
  estimatedMinutes: z.coerce.number().int().min(1).max(480).optional().default(10),
});

export const topicDefaultValues = (courseId) => ({
  courseId: courseId || '',
  title: '',
  content: '',
  status: 'draft',
  order: 0,
  estimatedMinutes: 10,
});