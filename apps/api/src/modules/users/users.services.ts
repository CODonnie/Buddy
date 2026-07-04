import { prisma } from "../../config/db";
import bcrypt from "bcrypt";
import { AppError } from "../../shared/errors/AppErrors";
import { HTTP_STATUS } from "../../shared/constants/http-status";
import { UpdateProfileDto, ChangePasswordDto } from "./users.types";
import { UsersRepository } from "./users.repository";

export class UsersService {
    static async getCurrentUser(userId: string) {
        const user = await UsersRepository.findById(userId);

        if (!user) throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found");

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

    static async updateProfile(userId: string, data: UpdateProfileDto) {
        const user = await UsersRepository.findById(userId);

        if (!user) throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found");

        const updatedUser = await UsersRepository.updateUser(userId, data);

        return updatedUser;
    }

    static async changePassword(userId: string, data: ChangePasswordDto) {
        const { currentPassword, newPassword } = data;

        const user = await UsersRepository.findById(userId);

        if (!user) throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found");

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Current password is incorrect");

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await UsersRepository.updateUser(userId, {password: hashedPassword});
    }
}