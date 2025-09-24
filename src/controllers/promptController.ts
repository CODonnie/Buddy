import { Response } from "express";
import { PrismaClient } from "../generated/prisma";
import OpenAI from "openai";
import { AuthRequest } from "../middlewares/authMiddleware";
import { string } from "zod";

const prisma = new PrismaClient();
const agent = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MOCK_AI = process.env.NODE_ENV !== "production";

export const askPrompt = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || !req.user.id) return res.status(401).json({ error: "Unauthorized" });

        const { rawText } = req.body;
        if (!rawText) return res.status(400).json({ error: "Prompt text is required" });

        let response: string;

        if (MOCK_AI) {
            response = "Omo our credit is low for free AI calls";
        } else {
            const completion = await agent.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: rawText }],
            });
            response = completion.choices[0]?.message?.content ?? "";
        }

        const prompt = await prisma.prompt.create({
            data: {
                rawText,
                response,
                userId: req.user.id,
            },
        });

        res.status(201).json({ message: "Prompt created successfully", prompt });
    } catch (err) {
        console.log(`ask prompt error - ${err}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getPromptHistory = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || !req.user.id) return res.status(401).json({ error: "Unauthorized" });

        const promptHistory = await prisma.prompt.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: "desc" },
            take: 10,
        });

        res.status(200).json({ prompts: promptHistory });
    } catch (err) {
        console.log(`get prompt history error - ${err}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const refinePrompt = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });

    const { promptId, rawText, strategy } = req.body;

    let prompt;
    if (!promptId) {
      const refinementPrompt = strategy
        ? `Refine this prompt with the following strategy: "${strategy}". Prompt: "${rawText}"`
        : `Improve this prompt to be clearer and more specific for study. Prompt: "${rawText}"`;

      const completion = await agent.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: refinementPrompt }],
      });

      const refined = completion.choices[0].message?.content ?? "";

      prompt = await prisma.prompt.create({
        data: {
          rawText,
          refined,
          strategy,
          userId: req.user.id,
        },
      });
    }
    else {
      const existing = await prisma.prompt.findUnique({ where: { id: promptId } });
      if (!existing) return res.status(404).json({ error: "Prompt not found" });

      const refinementPrompt = strategy
        ? `Refine this prompt with the following strategy: "${strategy}". Prompt: "${existing.rawText}"`
        : `Improve this prompt to be clearer and more specific for study. Prompt: "${existing.rawText}"`;

      const completion = await agent.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: refinementPrompt }],
      });

      const refined = completion.choices[0].message?.content ?? "";

      prompt = await prisma.prompt.update({
        where: { id: promptId },
        data: { refined, strategy },
      });
    }

    res.status(200).json({ prompt });
  } catch (error) {
    console.error("Refine error:", error);
    res.status(500).json({ error: "Failed to refine prompt" });
  }
};

export const goPrompt = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || !req.user.id) return res.status(401).json({ error: "Unauthorized" });

        const { id } = req.params;
        if (!id || typeof id !== "string") return res.status(400).json({ error: "Valid prompt ID is required" });

        const prompt = await prisma.prompt.findUnique({ where: { id }});
        if (!prompt) return res.status(404).json({ error: "Prompt not found" });

        const textToSend = prompt.refined || prompt.rawText;

        const completion = await agent.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: textToSend }],
        });

        const response = completion.choices[0]?.message?.content ?? "";

        const updatedPrompt = await prisma.prompt.update({
            where: { id },
            data: { response },
        });

        res.status(200).json({ message: "Prompt processed successfully", prompt: updatedPrompt });
    } catch (err) {
        console.log(`go prompt error - ${err}`);
        res.status(500).json({ error: "Internal server error" });
    }
}