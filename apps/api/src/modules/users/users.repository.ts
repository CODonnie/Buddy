import { prisma } from "../../config/db";

export class UsersRepository {
  static findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static updateUser(id: string, data: any) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}