import { z } from 'zod';

export const courseSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(180),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only'),
  description: z.string().max(2000).optional().default(''),
  content: z.string().optional().default(''),
  coverImageUrl: z.string().url('Must be a valid URL').nullable().optional().or(z.literal('')),
  status: z.enum(['draft', 'published']),
  order: z.coerce.number().int().min(0).optional().default(0),
});

export const courseDefaultValues = {
  title: '',
  slug: '',
  description: '',
  content: '',
  coverImageUrl: '',
  status: 'draft',
  order: 0,
};