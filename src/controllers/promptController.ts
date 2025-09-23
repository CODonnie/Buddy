import { Response } from "express";
import { PrismaClient } from "../generated/prisma";
import OpenAI from "openai";
import { AuthRequest } from "../middlewares/authMiddleware";

const prisma = new PrismaClient();
const agent = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});

export const askPrompt = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || !req.user.id) return res.status(401).json({ error: "Unauthorized" });

        const { rawText} = req.body;
        if(!rawText) return res.status(400).json({ error: "Prompt text is required"});

        const completion = await agent.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: rawText}],
        });

        const response = completion.choices[0]?.message?.content ?? "";

        const prompt = await prisma.prompt.create({
            data: {
                rawText,
                response,
                userId: req.user.id,
            },
        });

        res.status(200).json({ message: "Prompt created successfully", prompt});
    } catch (err) {
        console.log(`ask prompt error - ${err}`);
        res.status(500).json({ error: "Internal server error"});
    }
}

export const getPromptHistory = async (req: AuthRequest, res: Response) => {
    try {
        if(!req.user || !req.user.id) return res.status(401).json({ error: "Unauthorized" });

        const promptHistory = await prisma.prompt.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: "desc"},
            take: 10,
            include: { refinement: true},
        });

        res.status(200).json({ promptHistory });
    } catch (err) {
        console.log(`get prompt history error - ${err}`);
        res.status(500).json({ error: "Internal server error"});
    }
}