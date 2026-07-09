import { AppError } from "../../shared/errors/AppErrors";
import { HTTP_STATUS } from "../../shared/constants/http-status";
import { StudyRepository } from "./study.repository";

export class StudyService {
    static async startSession(data: {
        title: string;
        subject?: string;
        goal?: string;
        userId: string;
    }) {
        const active = await StudyRepository.findActiveByUser(data.userId);

        if (active) {
            throw new AppError(
                HTTP_STATUS.BAD_REQUEST,
                "You already have an active study session."
            );
        }

        return StudyRepository.create(data);
    }

    static async getCurrentSession(userId: string) {
        return StudyRepository.findActiveByUser(userId);
    }

    static async endSession(id: string, userId: string) {
        const session = await StudyRepository.findById(id);

        if (!session) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, "Study session not found.");
        }

        if (session.userId !== userId) {
            throw new AppError(HTTP_STATUS.FORBIDDEN,
                "Unauthorized."
            );
        }

        if (session.status !== "ACTIVE") {
            throw new AppError(
                HTTP_STATUS.BAD_REQUEST,
                "Study session has already ended.",
            );
        }

        const endedAt = new Date();

        const duration = Math.floor(
            (endedAt.getTime() - session.startedAt.getTime()) / 1000
        );

        return StudyRepository.update(id, {
            endedAt,
            duration,
            status: "COMPLETED",
        });
    }

    static async getHistory(userId: string) {
        return StudyRepository.findHistory(userId);
    }
}