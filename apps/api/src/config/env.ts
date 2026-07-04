import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
    PORT: z.coerce.number().default(5000),
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(32, {
        message: "JWT_SECRET should be at least 32 characters long."
    }),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("Invalid environment variables");
    console.error(parsed.error.format());
    process.exit(1);
}

export const env = parsed.data;