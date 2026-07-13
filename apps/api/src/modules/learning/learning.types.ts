import { z } from "zod";
import {
  createLearningEntrySchema,
  updateLearningEntrySchema,
} from "./learning.schema";

export type CreateLearningEntryDto = z.infer<typeof createLearningEntrySchema>;
export type UpdateLearningEntryDto = z.infer<typeof updateLearningEntrySchema>;
