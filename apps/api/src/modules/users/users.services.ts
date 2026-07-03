import { prisma } from "../../config/db";
import bcrypt from "bcrypt";
import { AppError } from "../../shared/errors/AppErrors";

export class UsersService {
    static async getCurrentUser(userId: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) throw new AppError(404, "User not found");

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    static async updateProfile(userId: string, data: {
        name?: string; bio?: string; avatarUrl?: string;}) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) throw new AppError(404, "User not found");

        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data,
        });

        return {
            message: "Profile updated successfully",
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                bio: updatedUser.bio,
                avatarUrl: updatedUser.avatarUrl,
                updatedAt: updatedUser.updatedAt,
            },
        };
    }

    static async changePassword(
        userId: string, currentPassword: string, newPassword: string
    ) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) throw new AppError(404, "User not found");

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if(!isPasswordValid) throw new AppError(400, "Current password is incorrect");

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password: hashedPassword
            },
        });

        return {
            message: "Password changed successfully",
        };
    }
}