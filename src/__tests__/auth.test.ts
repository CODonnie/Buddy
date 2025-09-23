import request from "supertest";
import app from "../app";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();
const testUser = {
  name: "Test User",
  email: "test@example.com",
  password: "password123",
};

describe("Auth Routes", () => {
  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("should sign up a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.token).toBeDefined();
  });

  it("should log in the user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.token).toBeDefined();
  });

  it("should fetch the logged in user", async () => {
    const loginRes = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    const token = loginRes.body.token;
    const res = await request(app)
      .get("/api/auth/user")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
  });
});
