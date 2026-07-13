import z from "zod";

const topicBaseSchema = z.object({
  courseId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid course id'),
  title: z.string().trim().min(3).max(180),
  content: z.string().optional().default(''),
  isPublished: z.enum(['false', 'true']).default('false'),
  order: z.number().int().min(0).optional().default(0),
  estimatedMinutes: z.number().int().min(1).max(480).optional().default(10),
});

export const createTopicSchema = topicBaseSchema;
export const updateTopicSchema = topicBaseSchema.partial().omit({ courseId: true });