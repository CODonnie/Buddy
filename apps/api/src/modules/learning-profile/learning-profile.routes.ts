import { Router } from "express";
import { LearningProfileController } from "./learning-profile.controller";
import { authMiddleware } from "../../shared/middleware/auth.middleware";

const router = Router();

router.get("/me", authMiddleware, LearningProfileController.me);

export default router;
