import { Pageable } from "@/shared/pagination/pageable.js";
import { Sort } from "@/shared/pagination/sort.js";
import { describe, expect, it } from "vitest";


describe("Pageable", () => {
  describe("constructor", () => {
    it("should create pageable with provided values", () => {
      const sort = Sort.from("-name");

      const pageable = new Pageable(
        2,
        20,
        sort,
      );

      expect(pageable.page).toBe(2);
      expect(pageable.limit).toBe(20);
      expect(pageable.sort).toBe(sort);
    });

    it("should use unsorted sort by default", () => {
      const pageable = new Pageable(
        1,
        10,
      );

      expect(
        pageable.sort.isUnsorted,
      ).toBe(true);
    });

    it("should throw when page is less than 1", () => {
      expect(() => {
        new Pageable(0, 10);
      }).toThrow(
        "Page must be a positive integer",
      );
    });

    it("should throw when limit is less than 1", () => {
      expect(() => {
        new Pageable(1, 0);
      }).toThrow(
        "Limit must be a positive integer",
      );
    });

    it("should throw when page is negative", () => {
      expect(() => {
        new Pageable(-1, 10);
      }).toThrow(
        "Page must be a positive integer",
      );
    });

    it("should throw when limit is negative", () => {
      expect(() => {
        new Pageable(1, -10);
      }).toThrow(
        "Limit must be a positive integer",
      );
    });

    it("should throw when page is decimal", () => {
      expect(() => {
        new Pageable(1.5, 10);
      }).toThrow(
        "Page must be a positive integer",
      );
    });

    it("should throw when limit is decimal", () => {
      expect(() => {
        new Pageable(1, 10.5);
      }).toThrow(
        "Limit must be a positive integer",
      );
    });

    it("should throw when page is NaN", () => {
      expect(() => {
        new Pageable(Number.NaN, 10);
      }).toThrow(
        "Page must be a positive integer",
      );
    });

    it("should throw when limit is NaN", () => {
      expect(() => {
        new Pageable(1, Number.NaN);
      }).toThrow(
        "Limit must be a positive integer",
      );
    });

    it("should throw when page is Infinity", () => {
      expect(() => {
        new Pageable(
          Number.POSITIVE_INFINITY,
          10,
        );
      }).toThrow(
        "Page must be a positive integer",
      );
    });

    it("should throw when limit is Infinity", () => {
      expect(() => {
        new Pageable(
          1,
          Number.POSITIVE_INFINITY,
        );
      }).toThrow(
        "Limit must be a positive integer",
      );
    });
  });

  describe("skip", () => {
    it("should calculate skip correctly", () => {
      const pageable = new Pageable(
        3,
        10,
      );

      expect(pageable.skip).toBe(20);
    });

    it("should return zero for first page", () => {
      const pageable = new Pageable(
        1,
        10,
      );

      expect(pageable.skip).toBe(0);
    });

    it("should calculate skip with custom limit", () => {
      const pageable = new Pageable(
        5,
        25,
      );

      expect(pageable.skip).toBe(100);
    });
  });

  describe("take", () => {
    it("should return limit value", () => {
      const pageable = new Pageable(
        1,
        50,
      );

      expect(pageable.take).toBe(50);
    });
  });

  describe("withPage", () => {
    it("should return new pageable with updated page", () => {
      const pageable = new Pageable(
        1,
        10,
      );

      const result = pageable.withPage(5);

      expect(result).not.toBe(pageable);

      expect(result.page).toBe(5);
      expect(result.limit).toBe(10);
      expect(result.sort).toBe(
        pageable.sort,
      );
    });

    it("should throw when page is invalid", () => {
      const pageable = new Pageable(
        1,
        10,
      );

      expect(() => {
        pageable.withPage(0);
      }).toThrow(
        "Page must be a positive integer",
      );
    });
  });

  describe("withSize", () => {
    it("should return new pageable with updated limit", () => {
      const pageable = new Pageable(
        5,
        10,
      );

      const result = pageable.withSize(50);

      expect(result).not.toBe(pageable);

      expect(result.page).toBe(1);
      expect(result.limit).toBe(50);
    });

    it("should throw when limit is invalid", () => {
      const pageable = new Pageable(
        1,
        10,
      );

      expect(() => {
        pageable.withSize(0);
      }).toThrow(
        "Limit must be a positive integer",
      );
    });

    it("should preserve sort configuration", () => {
      const sort = Sort.from("-name");

      const pageable = new Pageable(
        1,
        10,
        sort,
      );

      const result = pageable.withSize(25);

      expect(result.sort).toBe(sort);
    });
  });

  describe("withSort", () => {
    it("should return new pageable with updated sort", () => {
      const pageable = new Pageable(
        5,
        10,
      );

      const sort = Sort.from("-name");

      const result = pageable.withSort(
        sort,
      );

      expect(result).not.toBe(pageable);

      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.sort).toBe(sort);
    });
  });

  describe("next", () => {
    it("should return next page", () => {
      const pageable = new Pageable(
        1,
        10,
      );

      const result = pageable.next();

      expect(result.page).toBe(2);
    });
  });

  describe("previous", () => {
    it("should return previous page", () => {
      const pageable = new Pageable(
        5,
        10,
      );

      const result = pageable.previous();

      expect(result.page).toBe(4);
    });

    it("should throw when current page is 1", () => {
      const pageable = new Pageable(
        1,
        10,
      );

      expect(() => {
        pageable.previous();
      }).toThrow(
        "Page must be a positive integer",
      );
    });
  });

  describe("toParams", () => {
    it("should convert pageable to params object", () => {
      const pageable = new Pageable(
        2,
        20,
        Sort.from("-name"),
      );

      expect(
        pageable.toParams(),
      ).toEqual({
        page: 2,
        size: 20,
        sort: "-name",
      });
    });

    it("should omit sort when unsorted", () => {
      const pageable = new Pageable(
        1,
        10,
      );

      expect(
        pageable.toParams(),
      ).toEqual({
        page: 1,
        size: 10,
      });
    });
  });

  describe("from", () => {
    it("should create pageable from raw values", () => {
      const pageable = Pageable.from(
        "2",
        "25",
        "-name",
      );

      expect(pageable.page).toBe(2);
      expect(pageable.limit).toBe(25);

      expect(
        pageable.sort.toString(),
      ).toBe("-name");
    });


    it("should throw when page is invalid", () => {
      expect(() => {
        Pageable.from(0, 10);
      }).toThrow(
        "Page must be a positive integer",
      );
    });

    it("should throw when limit is invalid", () => {
      expect(() => {
        Pageable.from(1, 0);
      }).toThrow(
        "Limit must be a positive integer",
      );
    });

    it("should throw when page is not numeric", () => {
      expect(() => {
        Pageable.from("abc", 10);
      }).toThrow(
        "Page must be a positive integer",
      );
    });

    it("should throw when limit is not numeric", () => {
      expect(() => {
        Pageable.from(1, "abc");
      }).toThrow(
        "Limit must be a positive integer",
      );
    });

    it("should parse sort correctly", () => {
      const pageable = Pageable.from(
        1,
        10,
        "-createdAt,name",
      );

      expect(
        pageable.sort.orders,
      ).toEqual([
        {
          property: "createdAt",
          direction: "desc",
        },
        {
          property: "name",
          direction: "asc",
        },
      ]);
    });
  });

  describe("of", () => {
    it("should create pageable instance", () => {
      const sort = Sort.from("-name");

      const pageable = Pageable.of(
        3,
        15,
        sort,
      );

      expect(pageable.page).toBe(3);
      expect(pageable.limit).toBe(15);
      expect(pageable.sort).toBe(sort);
    });

    it("should throw when page is invalid", () => {
      expect(() => {
        Pageable.of(0, 10);
      }).toThrow(
        "Page must be a positive integer",
      );
    });

    it("should throw when limit is invalid", () => {
      expect(() => {
        Pageable.of(1, 0);
      }).toThrow(
        "Limit must be a positive integer",
      );
    });
  });

  describe("immutability", () => {
    it("should not mutate original instance when changing page", () => {
      const pageable = new Pageable(
        1,
        10,
      );

      pageable.withPage(5);

      expect(pageable.page).toBe(1);
    });

    it("should not mutate original instance when changing limit", () => {
      const pageable = new Pageable(
        1,
        10,
      );

      pageable.withSize(50);

      expect(pageable.limit).toBe(10);
    });

    it("should not mutate original instance when changing sort", () => {
      const pageable = new Pageable(
        1,
        10,
      );

      pageable.withSort(
        Sort.from("-name"),
      );

      expect(
        pageable.sort.isUnsorted,
      ).toBe(true);
    });
  });
});