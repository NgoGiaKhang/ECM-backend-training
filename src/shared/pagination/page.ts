import type { Pageable } from "./pageable.js";

/**
 * Represents a paginated response containing a list of items and metadata.
 * Includes helper methods for data transformation and UI navigation logic.
 *
 * @template T The type of items in the page.
 */
export class Page<T> {
  readonly items: T[];
  readonly totalItems: number;
  readonly page: number;
  readonly limit: number;

  /**
   * Creates a new Page instance.
   *
   * @param items The list of items for the current page.
   * @param totalItems The total number of items available in the database.
   * @param page The current page number (1-based index). Defaults to 1.
   * @param limit The number of items per page. Defaults to 10.
   */
  constructor(items: T[], totalItems: number, page = 1, limit = 10) {
    this.items = items;
    this.totalItems = totalItems;
    this.page = page;
    this.limit = limit;
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.limit);
  }

  // --- Transformation Methods ---

  /**
   * Transforms the items in the page using a callback function,
   * while preserving the pagination metadata.
   *
   * @template U The type of the new items.
   * @param callback A function that accepts an item of type T and returns an item of type U.
   * @returns A new Page instance containing the transformed items.
   * @example
   * const userDtos = userPage.map(user => new UserDto(user));
   */
  map<U>(callback: (item: T) => U): Page<U> {
    return new Page<U>(
      this.items.map(callback),
      this.totalItems,
      this.page,
      this.limit,
    );
  }

  // --- Static Factories ---

  /**
   * Creates an empty page.
   * Useful for initial states or error handling fallback.
   *
   * @returns An empty Page instance.
   */
  static empty<T>(): Page<T> {
    return new Page<T>([], 0, 1, 10);
  }

  static of<T>(data: T[], total: number, pageable: Pageable) {
    return new Page<T>(data, total, pageable.page, pageable.limit);
  }
}
