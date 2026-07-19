import z from "zod";

const lessonBaseSchema = z.object({
  courseId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid course id'),
  title: z.string().trim().min(3).max(180),
  content: z.string().optional().default(''),
  isPublished: z.enum(['false', 'true']).default('false'),
  order: z.number().int().min(0).optional().default(0),
});

export const createLessonSchema = lessonBaseSchema;
export const updateLessonSchema = lessonBaseSchema.partial().omit({ courseId: true });