import z from "zod";

// Mirrors frontend/src/components/forms/schemas/courseSchema.js so both
// tiers agree on what "valid" means. Kept independent (no shared package)
// to avoid coupling deploys, but any change here should be mirrored there.
const courseBaseSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(180),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase, hyphen-separated'),
  description: z.string().max(2000).optional().default(''),
  content: z.string().optional().default(''),
  coverImageUrl: z.string().url().nullable().optional(),
  isPublished: z.enum(['false', 'true']).default('false'),
});

export const createCourseSchema = courseBaseSchema;
export const updateCourseSchema = courseBaseSchema.partial();

