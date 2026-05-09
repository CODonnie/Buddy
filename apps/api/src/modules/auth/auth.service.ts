import { prisma } from "../../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env"

const secret = env.JWT_SECRET;

if (!secret) throw new Error("JWT_SECRET not configured");

export class AuthService {
    static async register(name: string, email: string, password: string) {
        const existingUser = await prisma.user.findUnique({ 
            where: { email },
        });

        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            }
        };
    }

    static async login(email: string, password: string) {
        const user = await prisma.user.findUnique({ 
            where: { email },
        });

        if (!user) {
            throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Invalid Credentials");
        }

        const accessToken = jwt.sign(
            { userId: user.id },
            secret,
            { expiresIn: "15m"}
        );

        return {
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
    }

    static async getCurrentUser(userId: string) {
        const user = await prisma.user.findUnique({ where: { id: userId }});

        if (!user) throw new Error("User not found");

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
    }
}