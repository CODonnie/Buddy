import dotenv from "dotenv";
import { PrismaClient } from "../generated/prisma";

dotenv.config();

const prisma = new PrismaClient();

beforeAll(async () => {
  // optional: clean test db
  await prisma.user.deleteMany();
  await prisma.prompt.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
