import { prisma } from "../../config/db";

export class StudyRepository {
  static async create(data: {
    title: string;
    subject?: string;
    goal?: string;
    userId: string;
  }) {
    return prisma.studySession.create({
      data,
    });
  }

  static async findActiveByUser(userId: string) {
    return prisma.studySession.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
    });
  }

  static async findById(id: string) {
    return prisma.studySession.findUnique({
      where: { id },
    });
  }

  static async update(id: string, data: any) {
    return prisma.studySession.update({
      where: { id },
      data,
    });
  }

  static async findHistory(userId: string) {
    return prisma.studySession.findMany({
      where: {
        userId,
      },
      orderBy: {
        startedAt: "desc",
      },
    });
  }
}