import { Router } from "express";

import { StudyController } from "./study.controller";

import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { validate } from "../../shared/middleware/validate.Middleware";

import { startStudySchema } from "./study.schema";

const router = Router();

router.use(authMiddleware);

router.post(
  "/start",
  validate(startStudySchema),
  StudyController.start
);

router.get(
  "/current",
  StudyController.current
);

router.patch(
  "/:id/end",
  StudyController.end
);

router.get(
  "/history",
  StudyController.history
);

export default router;