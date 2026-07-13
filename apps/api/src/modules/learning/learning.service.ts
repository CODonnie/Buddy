import { Prisma } from "@prisma/client";
import { AppError } from "../../shared/errors/AppErrors";
import { HTTP_STATUS } from "../../shared/constants/http-status";
import { LearningProfileService } from "../learning-profile/learning-profile.service";
import { LearningRepository } from "./learning.repository";
import {
  CreateLearningEntryDto,
  UpdateLearningEntryDto,
} from "./learning.types";

export class LearningService {
  static async createEntry(userId: string, data: CreateLearningEntryDto) {
    const studySession = await this.getOwnedStudySession(data.studySessionId, userId);
    const existingEntry = await LearningRepository.findByStudySessionId(studySession.id);

    if (existingEntry) {
      throw new AppError(
        HTTP_STATUS.CONFLICT,
        "A learning entry already exists for this study session.",
      );
    }

    const createData: Prisma.LearningEntryCreateInput = {
      topic: data.topic ?? data.content ?? "Untitled learning entry",
      notes: data.notes ?? null,
      difficulty: data.difficulty ?? "MEDIUM",
      understanding: data.understanding ?? null,
      mood: data.mood ?? null,
      usedAI: data.usedAI ?? false,
      studySession: {
        connect: { id: studySession.id },
      },
    };

    const entry = await LearningRepository.create(createData);

    await LearningProfileService.recalculateProfile(userId);

    return this.toLearningEntry(entry);
  }

  static async getEntry(userId: string, studySessionId: string) {
    await this.getOwnedStudySession(studySessionId, userId);

    const entry = await LearningRepository.findByStudySessionId(studySessionId);

    if (!entry) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, "Learning entry not found.");
    }

    return this.toLearningEntry(entry);
  }

  static async updateEntry(
    userId: string,
    studySessionId: string,
    data: UpdateLearningEntryDto,
  ) {
    await this.getOwnedStudySession(studySessionId, userId);

    const entry = await LearningRepository.findByStudySessionId(studySessionId);

    if (!entry) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, "Learning entry not found.");
    }

    const updateData: Prisma.LearningEntryUpdateInput = {};

    if (data.topic !== undefined || data.content !== undefined) {
      updateData.topic = data.topic ?? data.content ?? "";
    }

    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }

    if (data.difficulty !== undefined) {
      updateData.difficulty = data.difficulty;
    }

    if (data.understanding !== undefined) {
      updateData.understanding = data.understanding;
    }

    if (data.mood !== undefined) {
      updateData.mood = data.mood;
    }

    if (data.usedAI !== undefined) {
      updateData.usedAI = data.usedAI;
    }

    const updatedEntry = await LearningRepository.update(entry.id, updateData);

    await LearningProfileService.recalculateProfile(userId);

    return this.toLearningEntry(updatedEntry);
  }

  private static async getOwnedStudySession(studySessionId: string, userId: string) {
    const studySession = await LearningRepository.findStudySessionById(studySessionId);

    if (!studySession) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, "Study session not found.");
    }

    if (studySession.userId !== userId) {
      throw new AppError(HTTP_STATUS.FORBIDDEN, "Unauthorized.");
    }

    return studySession;
  }

  private static toLearningEntry(entry: {
    id: string;
    studySessionId: string;
    createdAt: Date;
    updatedAt?: Date;
    content?: string;
    topic?: string;
    notes?: string | null;
    difficulty?: string;
    understanding?: number | null;
    mood?: string | null;
    usedAI?: boolean;
  }) {
    return {
      id: entry.id,
      topic: entry.topic ?? "",
      content: entry.notes ?? entry.topic ?? entry.content ?? "",
      notes: entry.notes ?? null,
      difficulty: entry.difficulty ?? "MEDIUM",
      understanding: entry.understanding ?? null,
      mood: entry.mood ?? null,
      usedAI: entry.usedAI ?? false,
      studySessionId: entry.studySessionId,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt ?? entry.createdAt,
    };
  }
}
