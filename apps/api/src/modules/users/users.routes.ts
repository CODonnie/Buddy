import { Router } from "express"
import { UsersController } from "./users.controller"
import { authMiddleware } from "../../shared/middleware/auth.middleware"
import { validate } from "../../shared/middleware/validate.Middleware"
import {
    updateProfileSchema,
    changePasswordSchema
} from "./users.schema";

const router = Router();

router.get("/me", authMiddleware, UsersController.me);
router.patch(
    "/me",
    authMiddleware,
    validate(updateProfileSchema),
    UsersController.updateProfile);
router.patch(
    "/change-password",
    authMiddleware,
    validate(changePasswordSchema),
    UsersController.changePassword);

export default router;