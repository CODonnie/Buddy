import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { loginSchema, registerSchema } from "./auth.schema";
import { validate } from "../../shared/middleware/validate.Middleware";

const router = Router();

router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);
router.get("/me", authMiddleware, AuthController.me);

export default router;