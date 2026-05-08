import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes"

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Buddy API is a GO!!!");
})

app.use("/auth", authRoutes);

export default app;