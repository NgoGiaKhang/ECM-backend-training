import { Page, Pageable } from "@/shared/pagination/index.js";
import { describe, expect, it } from "vitest";

interface User {
  id: number;
  name: string;
}

describe("Page", () => {
  describe("constructor", () => {
    it("should create page with provided values", () => {
      const items: User[] = [
        {
          id: 1,
          name: "John",
        },
      ];

      const page = new Page(items, 100, 2, 20);

      expect(page.items).toEqual(items);

      expect(page.totalItems).toBe(100);

      expect(page.page).toBe(2);

      expect(page.limit).toBe(20);
    });

    it("should use default page and limit", () => {
      const page = new Page([], 0);

      expect(page.page).toBe(1);

      expect(page.limit).toBe(10);
    });
  });

  describe("totalPages", () => {
    it("should calculate total pages correctly", () => {
      const page = new Page([], 100, 1, 10);

      expect(page.totalPages).toBe(10);
    });

    it("should round up total pages", () => {
      const page = new Page([], 101, 1, 10);

      expect(page.totalPages).toBe(11);
    });

    it("should return zero when total items is zero", () => {
      const page = new Page([], 0, 1, 10);

      expect(page.totalPages).toBe(0);
    });

    it("should handle limit larger than total items", () => {
      const page = new Page([], 5, 1, 10);

      expect(page.totalPages).toBe(1);
    });
  });

  describe("map", () => {
    it("should transform items", () => {
      const page = new Page<User>(
        [
          {
            id: 1,
            name: "John",
          },
          {
            id: 2,
            name: "Jane",
          },
        ],
        2,
        1,
        10,
      );

      const result = page.map((user) => user.name);

      expect(result.items).toEqual(["John", "Jane"]);
    });

    it("should preserve pagination metadata", () => {
      const page = new Page<User>([], 100, 5, 20);

      const result = page.map((user) => user.name);

      expect(result.totalItems).toBe(100);

      expect(result.page).toBe(5);

      expect(result.limit).toBe(20);
    });

    it("should return new page instance", () => {
      const page = new Page<User>([], 0);

      const result = page.map((user) => user.name);

      expect(result).not.toBe(page);
    });

    it("should support type transformation", () => {
      const page = new Page<number>([1, 2, 3], 3);

      const result = page.map((value) => ({
        id: value,
      }));

      expect(result.items).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });

    it("should handle empty items", () => {
      const page = new Page<User>([], 0);

      const result = page.map((user) => user.name);

      expect(result.items).toEqual([]);
    });
  });

  describe("empty", () => {
    it("should create empty page", () => {
      const page = Page.empty<User>();

      expect(page.items).toEqual([]);

      expect(page.totalItems).toBe(0);

      expect(page.page).toBe(1);

      expect(page.limit).toBe(10);
    });

    it("should create valid page instance", () => {
      const page = Page.empty<User>();

      expect(page).toBeInstanceOf(Page);
    });

    it("should return zero total pages", () => {
      const page = Page.empty<User>();

      expect(page.totalPages).toBe(0);
    });
  });

  describe("of", () => {
    it("should create page from pageable", () => {
      const pageable = new Pageable(2, 25);

      const items: User[] = [
        {
          id: 1,
          name: "John",
        },
      ];

      const page = Page.of(items, 100, pageable);

      expect(page.items).toEqual(items);

      expect(page.totalItems).toBe(100);

      expect(page.page).toBe(2);

      expect(page.limit).toBe(25);
    });

    it("should preserve item references", () => {
      const pageable = new Pageable(1, 10);

      const items: User[] = [
        {
          id: 1,
          name: "John",
        },
      ];

      const page = Page.of(items, 1, pageable);

      expect(page.items).toBe(items);
    });

    it("should calculate total pages correctly", () => {
      const pageable = new Pageable(1, 10);

      const page = Page.of([], 95, pageable);

      expect(page.totalPages).toBe(10);
    });
  });

  describe("immutability", () => {
    it("should not mutate original page when mapping", () => {
      const page = new Page<User>(
        [
          {
            id: 1,
            name: "John",
          },
        ],
        1,
      );

      page.map((user) => user.name);

      expect(page.items).toEqual([
        {
          id: 1,
          name: "John",
        },
      ]);
    });
  });
});
