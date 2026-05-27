// test/lib/prisma.pagination.extension.test.ts

import { Page, Pageable, Sort } from "@/shared/pagination/index.js";
import { describe, expect, it, vi } from "vitest";
import { testPrisma } from "./prisma.js";
import { prismaPaginationExtension } from "@/shared/database/prisma-pagination.extension.js";

const prisma = testPrisma.$extends(prismaPaginationExtension);

describe("prismaPaginationExtension", () => {
  beforeEach(async () => {
    
    await prisma.testUser.deleteMany();

    await prisma.testUser.createMany({
      data: [
        {
          email: "user1@example.com",
          name: "User 1",
        },
        {
          email: "user2@example.com",
          name: "User 2",
        },
        {
          email: "user3@example.com",
          name: "User 3",
        },
        {
          email: "user4@example.com",
          name: "User 4",
        },
        {
          email: "user5@example.com",
          name: "User 5",
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return paginated result", async () => {
    const pageable = Pageable.of(1, 2);

    const result = await prisma.testUser.paginate({
      pageable,
    });

    expect(result.items).toHaveLength(2);

    expect(result.totalItems).toBe(5);

    expect(result.page).toBe(1);

    expect(result.limit).toBe(2);

    expect(result.totalPages).toBe(3);
  });

  it("should paginate second page correctly", async () => {
    const pageable = Pageable.of(2, 2);

    const result = await prisma.testUser.paginate({
      pageable,
    });

    expect(result.items).toHaveLength(2);

    expect(result.page).toBe(2);

    expect(result.totalPages).toBe(3);
  });

  it("should paginate last page correctly", async () => {
    const pageable = Pageable.of(3, 2);

    const result = await prisma.testUser.paginate({
      pageable,
    });

    expect(result.items).toHaveLength(1);

    expect(result.page).toBe(3);

    expect(result.totalPages).toBe(3);

  });

  it("should support where clause", async () => {
    const pageable = Pageable.of(1, 10);

    const result = await prisma.testUser.paginate({
      where: {
        email: {
          contains: "user1",
        },
      },

      pageable,
    });

    expect(result.items).toHaveLength(1);

    expect(result.totalItems).toBe(1);

    expect(result.items[0]?.email).toBe("user1@example.com");
  });

  it("should support sorting", async () => {
    const pageable = Pageable.of(1, 5, Sort.by("email", "desc"));

    const result = await prisma.testUser.paginate({
      pageable,
    });

    expect(result.items[0]?.email).toBe("user5@example.com");

    expect(result.items[4]?.email).toBe("user1@example.com");
  });

  it("should return empty page when no records found", async () => {
    const pageable = Pageable.of(1, 10);

    const result = await prisma.testUser.paginate({
      where: {
        email: "missing@example.com",
      },

      pageable,
    });

    expect(result.items).toEqual([]);

    expect(result.totalItems).toBe(0);

    expect(result.totalPages).toBe(0);
  });
});
