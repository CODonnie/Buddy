import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env"
import { AppError } from "../../shared/errors/AppErrors";
import { HTTP_STATUS } from "../../shared/constants/http-status";
import { AuthRepository } from "./auth.repository";


export class AuthService {
    static async register(name: string, email: string, password: string) {
        const existingUser = await AuthRepository.findByEmail(email);

        if (existingUser) {
            throw new AppError(HTTP_STATUS.CONFLICT, "User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await AuthRepository.createUser(
            {
                name,
                email,
                password: hashedPassword,
            },
        );

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
        const user = await AuthRepository.findByEmail(email);

        if (!user) {
            throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Invalid Credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Invalid Credentials");
        }

        const accessToken = jwt.sign(
            { userId: user.id },
            env.JWT_SECRET,
            { expiresIn: "15m" }
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

        const user =
            await AuthRepository.findById(userId);

        if (!user) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "User not found"
            );
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
        };
    }
}
