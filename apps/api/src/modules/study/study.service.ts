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

        const session = await StudyRepository.create(data);

        return this.toStudySession(session);
    }

    static async getCurrentSession(userId: string) {
        const session = await StudyRepository.findActiveByUser(userId);

        return session ? this.toStudySession(session) : null;
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

        const updatedSession = await StudyRepository.update(id, {
            endedAt,
            duration,
            status: "COMPLETED",
        });

        return this.toStudySession(updatedSession);
    }

    static async getHistory(userId: string) {
        const sessions = await StudyRepository.findHistory(userId);

        return sessions.map((session) => this.toStudySession(session));
    }

    private static toStudySession(session: {
        id: string;
        title: string;
        subject: string | null;
        goal: string | null;
        startedAt: Date;
        endedAt: Date | null;
        duration: number | null;
        status: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }) {
        return {
            id: session.id,
            title: session.title,
            subject: session.subject,
            goal: session.goal,
            startedAt: session.startedAt,
            endedAt: session.endedAt,
            duration: session.duration,
            status: session.status,
            userId: session.userId,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
        };
    }
}
