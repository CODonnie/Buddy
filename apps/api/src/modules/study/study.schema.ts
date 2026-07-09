import { z } from "zod";

export const startStudySchema = z.object({
  title: z
    .string()
    .min(3, "Title is required")
    .max(100),

  subject: z
    .string()
    .max(100)
    .optional(),

  goal: z
    .string()
    .max(500)
    .optional(),
});