import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/authRoutes";
import "./config/passport";
import passport from "passport";
import { errorHandler, notFound } from "./middlewares/errorMiddleware";

//init
dotenv.config();
const app = express();

//middleware
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

//routes
app.use("/api/auth", authRouter);

//error handling
app.use(notFound);
app.use(errorHandler);

export default app;