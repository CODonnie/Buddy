import { Response } from "express";
import { PrismaClient } from "../generated/prisma";
import OpenAI from "openai";
import { AuthRequest } from "../middlewares/authMiddleware";

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
    if (!rawText && !promptId) {
      return res.status(400).json({ error: "Either rawText or promptId is required" });
    }

    let basePrompt = rawText;
    if (promptId) {
      const existing = await prisma.prompt.findUnique({ where: { id: promptId } });
      if (!existing) return res.status(404).json({ error: "Prompt not found" });
      basePrompt = existing.rawText;
    }

    const refinementInstruction = strategy
      ? `You are an AI study assistant. Refine the user's study prompt using this strategy: "${strategy}".`
      : `You are an AI study assistant. Refine the user's study prompt to be clearer, more specific, and more effective.`;

    let refined = "Omo our credit is low for free AI calls";
    let tokens = 0;
    let modelUsed = "mock";
    const start = Date.now();

    if (!MOCK_AI) {
      const completion = await agent.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: refinementInstruction },
          { role: "user", content: basePrompt },
        ],
      });

      refined = completion.choices[0].message?.content ?? "";
      tokens = completion.usage?.total_tokens ?? 0;
      modelUsed = completion.model;
    }

    const prompt = promptId
      ? await prisma.prompt.update({
          where: { id: promptId },
          data: { refined, strategy },
        })
      : await prisma.prompt.create({
          data: { rawText, refined, strategy, userId: req.user.id },
        });

    const latency = Date.now() - start;

    res.status(200).json({
      prompt,
      metadata: { tokens, model: modelUsed, latencyMs: latency },
    });
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