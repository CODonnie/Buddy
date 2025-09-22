import { Router } from "express";
import { signup, login, logout, getUser, googleCallback } from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";
import passport from "passport";

const authRouter = Router();
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.get("/user", protect, getUser);

authRouter.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}));
authRouter.get("/google/callback", passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: false,
}), googleCallback);

export default authRouter;