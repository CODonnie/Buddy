import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/users.routes";
import studyRoutes from "./modules/study/study.routes";
import { errorMiddleware } from "./shared/middleware/error.middleware";
import { loggerMiddleware } from "./shared/middleware/logger.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use(loggerMiddleware);

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Buddy API is a GO!!!");
})

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/study", studyRoutes);


app.use(errorMiddleware);

export default app;