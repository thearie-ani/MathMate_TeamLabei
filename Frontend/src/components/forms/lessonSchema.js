import { z } from "zod";

export const lessonSchema = z.object({
  course: z.string().min(1, "Please select a course"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().optional(),
  content: z.string().min(10, "Content is required"),
  chapter: z.coerce.number().min(0).optional(),
  order: z.coerce.number().min(0).optional(),
  status: z.enum(["draft", "published"]).optional(),
  sourceUrl: z.string().optional(),
});

export const lessonDefaultValues = (presetCourseId = "") => ({
  course: presetCourseId,
  title: "",
  slug: "",
  content: "",
  chapter: 0,
  order: 0,
  status: "draft",
  sourceUrl: "",
});