import { BadRequestException } from "@/shared/exception/common.exception.js";
import { extractPageable } from "@/shared/pagination/extract-pageable.js";
import type { Request } from "express";

import { describe, expect, it } from "vitest";

describe("extractPageable", () => {
  describe("success cases", () => {
    it("should extract pageable from query", () => {
      const request = {
        query: {
          page: "2",
          limit: "25",
          sort: "-name",
        },
      } as Partial<Request>;

      const pageable = extractPageable(request as Request);

      expect(pageable.page).toBe(2);

      expect(pageable.limit).toBe(25);

      expect(pageable.sort.toString()).toBe("-name");
    });

    it("should use default pagination values", () => {
      const request = {
        query: {},
      } as Partial<Request>;

      const pageable = extractPageable(request as Request);

      expect(pageable.page).toBe(1);

      expect(pageable.limit).toBe(10);

      expect(pageable.sort.isUnsorted).toBe(true);
    });

    it("should allow valid sort fields", () => {
      const request = {
        query: {
          sort: "-name,createdAt",
        },
      } as Partial<Request>;

      const pageable = extractPageable(request as Request, [
        "name",
        "createdAt",
      ]);

      expect(pageable.sort.orders).toEqual([
        {
          property: "name",
          direction: "desc",
        },
        {
          property: "createdAt",
          direction: "asc",
        },
      ]);
    });

    it("should allow empty whitelist", () => {
      const request = {
        query: {
          sort: "-name",
        },
      } as Partial<Request>;

      expect(() => extractPageable(request as Request, [])).not.toThrow();
    });

    it("should allow undefined whitelist", () => {
      const request = {
        query: {
          sort: "-name",
        },
      } as Partial<Request>;

      expect(() => extractPageable(request as Request)).not.toThrow();
    });

    it("should support multiple sort fields", () => {
      const request = {
        query: {
          sort: "-name,age",
        },
      } as Partial<Request>;

      const pageable = extractPageable(request as Request);

      expect(pageable.sort.orders).toEqual([
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
  });

  describe("pagination validation", () => {
    it("should throw when page is invalid", () => {
      const request = {
        query: {
          page: "0",
        },
      } as Partial<Request>;

      expect(() => extractPageable(request as Request)).toThrow(
        BadRequestException,
      );
    });

    it("should throw when limit is invalid", () => {
      const request = {
        query: {
          limit: "0",
        },
      } as Partial<Request>;

      expect(() => extractPageable(request as Request)).toThrow(
        BadRequestException,
      );
    });

    it("should throw when page is not numeric", () => {
      const request = {
        query: {
          page: "abc",
        },
      } as Partial<Request>;

      expect(() => extractPageable(request as Request)).toThrow(
        BadRequestException,
      );
    });

    it("should throw when limit is not numeric", () => {
      const request = {
        query: {
          limit: "abc",
        },
      } as Partial<Request>;

      expect(() => extractPageable(request as Request)).toThrow(
        BadRequestException,
      );
    });

    it("should throw when page is decimal", () => {
      const request = {
        query: {
          page: "1.5",
        },
      } as Partial<Request>;

      expect(() => extractPageable(request as Request)).toThrow(
        BadRequestException,
      );
    });

    it("should throw when limit is decimal", () => {
      const request = {
        query: {
          limit: "10.5",
        },
      } as Partial<Request>;

      expect(() => extractPageable(request as Request)).toThrow(
        BadRequestException,
      );
    });

    it("should include invalid field names in error message", () => {
      const request = {
        query: {
          page: "abc",
          limit: "invalid",
        },
      } as Partial<Request>;

      expect(() => extractPageable(request as Request)).toThrowError(
        /page|limit/,
      );
    });
  });

  describe("sort field validation", () => {
    it("should throw when sort field is not allowed", () => {
      const request = {
        query: {
          sort: "-password",
        },
      } as Partial<Request>;

      expect(() =>
        extractPageable(request as Request, ["name", "email"]),
      ).toThrow(BadRequestException);
    });

    it("should include allowed fields in error message", () => {
      const request = {
        query: {
          sort: "-password",
        },
      } as Partial<Request>;

      expect(() =>
        extractPageable(request as Request, ["name", "email"]),
      ).toThrowError(/Allowed fields: name, email/);
    });

    it("should include invalid sort field in error message", () => {
      const request = {
        query: {
          sort: "-password",
        },
      } as Partial<Request>;

      expect(() => extractPageable(request as Request, ["name"])).toThrowError(
        /password/,
      );
    });

    it("should throw when one of multiple sort fields is invalid", () => {
      const request = {
        query: {
          sort: "-name,password",
        },
      } as Partial<Request>;

      expect(() => extractPageable(request as Request, ["name"])).toThrow(
        BadRequestException,
      );
    });

    it("should allow all valid sort fields", () => {
      const request = {
        query: {
          sort: "-name,createdAt",
        },
      } as Partial<Request>;

      expect(() =>
        extractPageable(request as Request, ["name", "createdAt"]),
      ).not.toThrow();
    });
  });

  describe("edge cases", () => {
    it("should handle whitespace sort values", () => {
      const request = {
        query: {
          sort: "  -name  ",
        },
      } as Partial<Request>;

      const pageable = extractPageable(request as Request);

      expect(pageable.sort.toString()).toBe("-name");
    });

    it("should handle empty sort string", () => {
      const request = {
        query: {
          sort: "",
        },
      } as Partial<Request>;

      const pageable = extractPageable(request as Request);

      expect(pageable.sort.isUnsorted).toBe(true);
    });

    it("should handle undefined sort", () => {
      const request = {
        query: {},
      } as Partial<Request>;

      const pageable = extractPageable(request as Request);

      expect(pageable.sort.isUnsorted).toBe(true);
    });
  });
});
