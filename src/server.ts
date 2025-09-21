import app from "./app";
import dotenv from "dotenv";
import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient();

//init
dotenv.config();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on("SIGINT", async() => {
    console.log("Server shutting down...");
    await prisma.$disconnect();
    process.exit(0);
});