import { Router } from "express";
import { signup, login, logout, getUser } from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";

const authRouter = Router();
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.get("/user", protect, getUser);

export default authRouter;