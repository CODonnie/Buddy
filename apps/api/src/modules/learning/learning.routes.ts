import { Router } from "express";
import { LearningController } from "./learning.controller";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { validate } from "../../shared/middleware/validate.Middleware";
import {
  createLearningEntrySchema,
  updateLearningEntrySchema,
} from "./learning.schema";

const router = Router();

router.use(authMiddleware);

router.post("/", validate(createLearningEntrySchema), LearningController.create);
router.get("/:studySessionId", LearningController.get);
router.patch(
  "/:studySessionId",
  validate(updateLearningEntrySchema),
  LearningController.update,
);

export default router;
