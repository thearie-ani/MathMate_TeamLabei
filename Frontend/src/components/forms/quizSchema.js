import { z } from "zod";

export const quizSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  course: z.string().min(1, "Course is required"),
  topic: z.string().optional(),
  passingScore: z.number().min(1).max(100),
  isPublished: z.boolean().optional(),
  questions: z
    .array(
      z.object({
        text: z.string().min(5, "Question is required"),
        options: z.array(z.string())
          .refine(
            (options) => options.filter(o => o.trim() !== "").length >= 2,
            {
              message: "At least 2 options required",
            }
          ),

        correctIndex: z.coerce.number().min(0),
        explaination: z.string().min(1, "Explanation is required"),
        points: z.number().min(1).optional(),
      }).refine(
        (question) => question.correctIndex < question.options.filter(o => o.trim() !== "").length,
        {
          message: "Select a valid option",
          path: ["correctIndex"],
        }
      )
    )
    .min(1, "At least one question required"), // back to 1 unless 4 is genuinely a product rule
});

export const emptyQuestion = () => ({
  text: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  explaination: "",
  points: 1,
});