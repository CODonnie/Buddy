import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes"
import { errorMiddleware } from "./shared/middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Buddy API is a GO!!!");
})

app.use("/api/v1/auth", authRoutes);


app.use(errorMiddleware);

export default app;