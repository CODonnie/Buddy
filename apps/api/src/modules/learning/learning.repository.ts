import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

export class LearningRepository {
  static async create(data: Prisma.LearningEntryCreateInput) {
    return prisma.learningEntry.create({ data });
  }

  static async findByStudySessionId(studySessionId: string) {
    return prisma.learningEntry.findUnique({
      where: { studySessionId },
    });
  }

  static async update(entryId: string, data: Prisma.LearningEntryUpdateInput) {
    return prisma.learningEntry.update({
      where: { id: entryId },
      data,
    });
  }

  static async findStudySessionById(id: string) {
    return prisma.studySession.findUnique({
      where: { id },
    });
  }
}
