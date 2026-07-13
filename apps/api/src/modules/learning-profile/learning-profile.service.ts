import { LearningProfile } from "@prisma/client";
import { AppError } from "../../shared/errors/AppErrors";
import { HTTP_STATUS } from "../../shared/constants/http-status";
import { LearningProfileRepository } from "./learning-profile.repository";

export class LearningProfileService {
  static async getMyProfile(userId: string) {
    const user = await LearningProfileRepository.findUserById(userId);

    if (!user) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found.");
    }

    return this.recalculateProfile(userId);
  }

  static async recalculateProfile(userId: string) {
    const user = await LearningProfileRepository.findUserById(userId);

    if (!user) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found.");
    }

    const completedSessions = await LearningProfileRepository.findCompletedSessionsByUser(userId);
    const learningEntries = await LearningProfileRepository.findLearningEntriesByUser(userId);

    const totalSessions = completedSessions.length;
    const totalStudyMinutes = Math.round(
      completedSessions.reduce((sum, session) => sum + (session.duration ?? 0), 0) / 60,
    );
    const studyStreak = this.calculateStudyStreak(completedSessions);
    const averageUnderstanding = this.calculateAverageUnderstanding(learningEntries);
    const lastStudyDate = this.calculateLastStudyDate(completedSessions);

    const profileData = {
      totalSessions,
      totalStudyMinutes,
      studyStreak,
      averageUnderstanding,
      lastStudyDate,
    };

    const existingProfile = await LearningProfileRepository.findByUserId(userId);

    if (existingProfile) {
      const updatedProfile = await LearningProfileRepository.update(userId, profileData);
      return this.toLearningProfile(updatedProfile);
    }

    const createdProfile = await LearningProfileRepository.create({
      user: {
        connect: { id: userId },
      },
      ...profileData,
    });

    return this.toLearningProfile(createdProfile);
  }

  private static calculateAverageUnderstanding(
    entries: Array<{ understanding: number | null }>,
  ) {
    const knownEntries = entries.filter((entry) => entry.understanding !== null);

    if (knownEntries.length === 0) {
      return 0;
    }

    const total = knownEntries.reduce((sum, entry) => sum + (entry.understanding ?? 0), 0);

    return Number((total / knownEntries.length).toFixed(2));
  }

  private static calculateLastStudyDate(sessions: Array<{ endedAt: Date | null }>) {
    return sessions.reduce<Date | null>((latestDate, session) => {
      if (!session.endedAt) {
        return latestDate;
      }

      if (!latestDate || session.endedAt > latestDate) {
        return session.endedAt;
      }

      return latestDate;
    }, null);
  }

  private static calculateStudyStreak(
    sessions: Array<{ endedAt: Date | null }>,
  ) {
    const uniqueDays = Array.from(
      new Set(
        sessions
          .filter((session) => session.endedAt)
          .map((session) => this.toDayKey(session.endedAt as Date)),
      ),
    ).sort();

    if (uniqueDays.length === 0) {
      return 0;
    }

    let streak = 1;
    let previousDay = new Date(uniqueDays[uniqueDays.length - 1]);

    for (let index = uniqueDays.length - 2; index >= 0; index -= 1) {
      const currentDay = new Date(uniqueDays[index]);
      const expectedPreviousDay = new Date(previousDay);
      expectedPreviousDay.setDate(expectedPreviousDay.getDate() - 1);

      if (this.toDayKey(currentDay) === this.toDayKey(expectedPreviousDay)) {
        streak += 1;
        previousDay = currentDay;
      } else {
        break;
      }
    }

    return streak;
  }

  private static toDayKey(date: Date) {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized.toISOString().split("T")[0];
  }

  private static toLearningProfile(profile: LearningProfile) {
    return {
      id: profile.id,
      userId: profile.userId,
      totalSessions: profile.totalSessions,
      totalStudyMinutes: profile.totalStudyMinutes,
      studyStreak: profile.studyStreak,
      averageUnderstanding: profile.averageUnderstanding,
      lastStudyDate: profile.lastStudyDate,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
