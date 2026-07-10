import { prisma } from "../../config/db";
import { Prisma } from "@prisma/client";

export class UsersRepository {
  static findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static updateUser(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}
