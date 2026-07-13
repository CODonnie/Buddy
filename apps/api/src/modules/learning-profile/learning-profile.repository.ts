import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

export class LearningProfileRepository {
  static async findByUserId(userId: string) {
    return prisma.learningProfile.findUnique({
      where: { userId },
    });
  }

  static async findUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
  }

  static async create(data: Prisma.LearningProfileCreateInput) {
    return prisma.learningProfile.create({ data });
  }

  static async update(userId: string, data: Prisma.LearningProfileUpdateInput) {
    return prisma.learningProfile.update({
      where: { userId },
      data,
    });
  }

  static async findCompletedSessionsByUser(userId: string) {
    return prisma.studySession.findMany({
      where: {
        userId,
        status: "COMPLETED",
      },
      select: {
        duration: true,
        endedAt: true,
      },
    });
  }

  static async findLearningEntriesByUser(userId: string) {
    return prisma.learningEntry.findMany({
      where: {
        studySession: {
          userId,
        },
      },
      select: {
        understanding: true,
      },
    });
  }
}
