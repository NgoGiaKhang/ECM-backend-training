import { Sort } from "@/shared/pagination/sort.js";

interface User {
  id: number;
  name: string;
  age: number;
  createdAt: Date;
}

describe("Sort", () => {
  describe("UNSORTED", () => {
    it("should return empty orders", () => {
      expect(Sort.UNSORTED.orders).toEqual([]);
    });

    it("should be unsorted", () => {
      expect(Sort.UNSORTED.isUnsorted).toBe(true);
    });

    it("should serialize to empty string", () => {
      expect(Sort.UNSORTED.toString()).toBe("");
    });
  });

  describe("constructor", () => {
    it("should create sort with provided orders", () => {
      const sort = new Sort<User>([
        {
          property: "name",
          direction: "asc",
        },
      ]);

      expect(sort.orders).toEqual([
        {
          property: "name",
          direction: "asc",
        },
      ]);
    });

    it("should create unsorted instance with empty orders", () => {
      const sort = new Sort<User>([]);

      expect(sort.isUnsorted).toBe(true);
    });
  });

  describe("isUnsorted", () => {
    it("should return true when orders are empty", () => {
      const sort = new Sort<User>([]);

      expect(sort.isUnsorted).toBe(true);
    });

    it("should return false when orders exist", () => {
      const sort = Sort.by<User>("name");

      expect(sort.isUnsorted).toBe(false);
    });
  });

  describe("object", () => {
    it("should convert single order to object", () => {
      const sort = Sort.by<User>("name", "asc");

      expect(sort.object).toEqual({
        name: "asc",
      });
    });

    it("should convert multiple orders to object", () => {
      const sort = Sort.by<User>("name", "asc").and("age", "desc");

      expect(sort.object).toEqual({
        name: "asc",
        age: "desc",
      });
    });

    it("should return empty object for unsorted", () => {
      const sort = new Sort<User>([]);

      expect(sort.object).toEqual({});
    });
  });

  describe("by", () => {
    it("should create ascending sort by default", () => {
      const sort = Sort.by<User>("name");

      expect(sort.orders).toEqual([
        {
          property: "name",
          direction: "asc",
        },
      ]);
    });

    it("should create descending sort", () => {
      const sort = Sort.by<User>("age", "desc");

      expect(sort.orders).toEqual([
        {
          property: "age",
          direction: "desc",
        },
      ]);
    });
  });

  describe("and", () => {
    it("should append new order", () => {
      const sort = Sort.by<User>("name").and("age", "desc");

      expect(sort.orders).toEqual([
        {
          property: "name",
          direction: "asc",
        },
        {
          property: "age",
          direction: "desc",
        },
      ]);
    });

    it("should keep existing orders immutable", () => {
      const original = Sort.by<User>("name");

      const result = original.and("age", "desc");

      expect(original.orders).toEqual([
        {
          property: "name",
          direction: "asc",
        },
      ]);

      expect(result.orders).toEqual([
        {
          property: "name",
          direction: "asc",
        },
        {
          property: "age",
          direction: "desc",
        },
      ]);
    });

    it("should use ascending direction by default", () => {
      const sort = Sort.by<User>("name").and("age");

      expect(sort.orders[1]).toEqual({
        property: "age",
        direction: "asc",
      });
    });
  });

  describe("desc", () => {
    it("should convert all orders to descending", () => {
      const sort = Sort.by<User>("name", "asc").and("age", "asc");

      const result = sort.desc();

      expect(result.orders).toEqual([
        {
          property: "name",
          direction: "desc",
        },
        {
          property: "age",
          direction: "desc",
        },
      ]);
    });

    it("should keep original instance immutable", () => {
      const original = Sort.by<User>("name", "asc");

      const result = original.desc();

      expect(original.orders).toEqual([
        {
          property: "name",
          direction: "asc",
        },
      ]);

      expect(result.orders).toEqual([
        {
          property: "name",
          direction: "desc",
        },
      ]);
    });

    it("should return empty sort for unsorted instance", () => {
      const sort = new Sort<User>([]);

      const result = sort.desc();

      expect(result.orders).toEqual([]);
    });
  });

  describe("asc", () => {
    it("should convert all orders to ascending", () => {
      const sort = Sort.by<User>("name", "desc").and("age", "desc");

      const result = sort.asc();

      expect(result.orders).toEqual([
        {
          property: "name",
          direction: "asc",
        },
        {
          property: "age",
          direction: "asc",
        },
      ]);
    });

    it("should keep original instance immutable", () => {
      const original = Sort.by<User>("name", "desc");

      const result = original.asc();

      expect(original.orders).toEqual([
        {
          property: "name",
          direction: "desc",
        },
      ]);

      expect(result.orders).toEqual([
        {
          property: "name",
          direction: "asc",
        },
      ]);
    });

    it("should return empty sort for unsorted instance", () => {
      const sort = new Sort<User>([]);

      const result = sort.asc();

      expect(result.orders).toEqual([]);
    });
  });

  describe("toString", () => {
    it("should serialize ascending order", () => {
      const sort = Sort.by<User>("name", "asc");

      expect(sort.toString()).toBe("name");
    });

    it("should serialize descending order", () => {
      const sort = Sort.by<User>("name", "desc");

      expect(sort.toString()).toBe("-name");
    });

    it("should serialize multiple orders", () => {
      const sort = Sort.by<User>("name", "desc").and("age", "asc");

      expect(sort.toString()).toBe("-name,age");
    });

    it("should return empty string for unsorted", () => {
      const sort = new Sort<User>([]);

      expect(sort.toString()).toBe("");
    });

    it("should handle uppercase direction values safely", () => {
      const sort = new Sort<User>([
        {
          property: "name",
          direction: "DESC" as any,
        },
      ]);

      expect(sort.toString()).toBe("-name");
    });
  });

  describe("from", () => {
    it("should parse ascending property", () => {
      const sort = Sort.from<User>("name");

      expect(sort.orders).toEqual([
        {
          property: "name",
          direction: "asc",
        },
      ]);
    });

    it("should parse descending property", () => {
      const sort = Sort.from<User>("-name");

      expect(sort.orders).toEqual([
        {
          property: "name",
          direction: "desc",
        },
      ]);
    });

    it("should parse multiple properties", () => {
      const sort = Sort.from<User>("-name,age");

      expect(sort.orders).toEqual([
        {
          property: "name",
          direction: "desc",
        },
        {
          property: "age",
          direction: "asc",
        },
      ]);
    });

    it("should trim whitespace", () => {
      const sort = Sort.from<User>("  -name , age  ");

      expect(sort.orders).toEqual([
        {
          property: "name",
          direction: "desc",
        },
        {
          property: "age",
          direction: "asc",
        },
      ]);
    });

    it("should ignore empty tokens", () => {
      const sort = Sort.from<User>("-name,,age,");

      expect(sort.orders).toEqual([
        {
          property: "name",
          direction: "desc",
        },
        {
          property: "age",
          direction: "asc",
        },
      ]);
    });

    it("should return unsorted for undefined", () => {
      const sort = Sort.from<User>();

      expect(sort.orders).toEqual([]);
    });

    it("should return unsorted for empty string", () => {
      const sort = Sort.from<User>("");

      expect(sort.orders).toEqual([]);
    });

    it("should return unsorted for whitespace string", () => {
      const sort = Sort.from<User>("   ");

      expect(sort.orders).toEqual([]);
    });

    it("should preserve property names exactly", () => {
      const sort = Sort.from<User>("-createdAt");

      expect(sort.orders).toEqual([
        {
          property: "createdAt",
          direction: "desc",
        },
      ]);
    });
  });
});
