import { beforeEach, afterAll, describe, expect, it } from "vitest";
import { testPrisma } from "./prisma.js";
import { prismaExistsExtension } from "@/shared/database/prisma-exist.extension.js";


const prisma = testPrisma.$extends(prismaExistsExtension);

describe("prismaExistsExtension - exists", () => {
  beforeEach(async () => {
    await prisma.testUser.deleteMany();

    await prisma.testUser.create({
      data: {
        email: "existing@example.com",
        name: "Test User",
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return true when record exists", async () => {
    const result = await prisma.testUser.exists({
      email: "existing@example.com",
    });

    expect(result).toBe(true);
  });

  it("should return false when record does not exist", async () => {
    const result = await prisma.testUser.exists({
      email: "missing@example.com",
    });

    expect(result).toBe(false);
  });

  it("should work with id query", async () => {
    const user = await prisma.testUser.findFirstOrThrow();

    const result = await prisma.testUser.exists({
      id: user.id,
    });

    expect(result).toBe(true);
  });

  it("should return false when table is empty", async () => {
    await prisma.testUser.deleteMany();

    const result = await prisma.testUser.exists({
      email: "any@example.com",
    });

    expect(result).toBe(false);
  });
});
