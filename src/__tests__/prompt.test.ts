import request from "supertest";
import app from "../app";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

const testUser = {
  email: "prompt@example.com",
  password: "password123",
  name: "Prompt Tester",
};

let token: string;

describe("Prompt Routes", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
    await prisma.prompt.deleteMany();

    // signup & login
    await request(app).post("/api/auth/signup").send(testUser);
    const loginRes = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should ask a prompt and save it", async () => {
    const res = await request(app)
      .post("/api/prompt/ask")
      .set("Authorization", `Bearer ${token}`)
      .send({ rawText: "Explain gravity in simple terms" });

    expect(res.status).toBe(201);
    expect(res.body.prompt.rawText).toBe("Explain gravity in simple terms");
    expect(res.body.prompt.response).toBeDefined();
  });

  it("should fetch prompt history", async () => {
    const res = await request(app)
      .get("/api/prompt/history")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.prompts)).toBe(true);
    expect(res.body.prompts.length).toBeGreaterThan(0);
  });
});
