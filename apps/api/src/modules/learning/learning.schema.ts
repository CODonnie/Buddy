import { z } from "zod";

const difficultyEnum = z.enum(["EASY", "MEDIUM", "HARD"]);
const moodEnum = z.enum(["CONFUSED", "FOCUSED", "TIRED", "MOTIVATED"]);

export const createLearningEntrySchema = z
  .object({
    studySessionId: z.string().uuid("Study session ID must be a valid UUID"),
    topic: z.string().min(1, "Topic is required").max(200).optional(),
    content: z.string().min(1, "Content is required").max(5000).optional(),
    notes: z.string().max(5000).optional(),
    difficulty: difficultyEnum.optional(),
    understanding: z.number().int().min(0).max(100).optional(),
    mood: moodEnum.optional(),
    usedAI: z.boolean().optional(),
  })
  .refine((data) => data.topic || data.content, {
    message: "Topic or content is required",
    path: ["topic"],
  });

export const updateLearningEntrySchema = z.object({
  topic: z.string().min(1, "Topic is required").max(200).optional(),
  content: z.string().min(1, "Content is required").max(5000).optional(),
  notes: z.string().max(5000).optional(),
  difficulty: difficultyEnum.optional(),
  understanding: z.number().int().min(0).max(100).optional(),
  mood: moodEnum.optional(),
  usedAI: z.boolean().optional(),
});
