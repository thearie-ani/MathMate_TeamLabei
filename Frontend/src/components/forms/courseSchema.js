import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  icon: z.string().optional(),
  thumbnail: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export const courseDefaultValues = {
  title: "",
  slug: "",
  description: "",
  icon: "",
  thumbnail: "",
  isPublished: false,
};