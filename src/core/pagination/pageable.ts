import {Sort} from './sort.js';

/**
 * Represents pagination information including page number, page size, and sorting.
 * This class is immutable; all modification methods return a new instance.
 *
 */
export class Pageable{
    /**
     * Creates a new Pageable instance.
     *
     * @param page The page number (1-based index).
     * @param size The number of items per page.
     * @param sort The sorting configuration. Defaults to unsorted.
     */
    constructor(
        public readonly page: number,
        public readonly size: number,
        public readonly sort: Sort = new Sort([]),
    ) {
    }

    /**
     * Calculates the number of items to skip for database queries.
     * Formula: (page - 1) * size
     *
     * @returns The offset/skip value.
     */
    get skip(): number {
        return (this.page - 1) * this.size;
    }

    /**
     * Returns the number of items to take (limit) for database queries.
     * Equivalent to the page size.
     *
     * @returns The limit/take value.
     */
    get take(): number {
        return this.size;
    }

    /**
     * Returns a new Pageable instance with the specified page number.
     * The page number will be at least 1.
     *
     * @param page The new page number.
     * @returns A new Pageable instance with the updated page.
     */
    withPage(page: number): Pageable {
        return new Pageable(Math.max(1, page), this.size, this.sort);
    }

    /**
     * Returns a new Pageable instance with the specified page size.
     * Resets the page number to 1 to avoid out-of-bounds errors.
     *
     * @param size The new page size.
     * @returns A new Pageable instance with the updated size and page reset to 1.
     */
    withSize(size: number): Pageable {
        return new Pageable(1, Math.max(1, size), this.sort);
    }

    /**
     * Returns a new Pageable instance with the specified sorting configuration.
     * Resets the page number to 1.
     *
     * @param sort The new sorting configuration.
     * @returns A new Pageable instance with the updated sort and page reset to 1.
     */
    withSort(sort: Sort): Pageable {
        return new Pageable(1, this.size, sort);
    }

    /**
     * Returns a new Pageable instance for the next page.
     *
     * @returns A new Pageable instance with the page number incremented by 1.
     */
    next(): Pageable {
        return this.withPage(this.page + 1);
    }

    /**
     * Returns a new Pageable instance for the previous page.
     * If the current page is 1, it returns the same instance (or a new instance at page 1).
     *
     * @returns A new Pageable instance with the page number decremented by 1.
     */
    previous(): Pageable {
        return this.withPage(this.page - 1);
    }

    /**
     * Converts the pagination state into a plain object suitable for query parameters.
     *
     * @returns An object containing `page`, `size`, and optionally `sort` (if sorted).
     * @example
     * // returns { page: 2, size: 10, sort: "name,asc" }
     * pageable.toParams();
     */
    toParams(): Record<string, string | number> {
        const params: Record<string, string | number> = {
            page: this.page,
            size: this.size,
        };
        if (!this.sort.isUnsorted) params.sort = this.sort.toString();
        return params;
    }

    /**
     * Factory method to create a Pageable instance from raw query parameters.
     * Handles type conversion and default values safely.
     *
     * @param page The raw page number (can be string, number, or undefined). Defaults to 1.
     * @param size The raw page size (can be string, number, or undefined). Defaults to 10.
     * @param sort The raw sort string (e.g., "name,asc;age,desc").
     * @returns A new Pageable instance.
     */
    static from(page?: unknown, size?: unknown, sort?: string): Pageable {
        const p = Math.max(1, Number(page) || 1);
        const s = Math.max(1, Number(size) || 10);
        return new Pageable(p, s, Sort.from(sort));
    }

    /**
     * Static factory method to create a Pageable instance programmatically.
     *
     * @template T The entity type.
     * @param page The page number.
     * @param size The page size.
     * @param sort The sorting configuration (optional).
     * @returns A new Pageable instance.
     */
    static of(page: number, size: number, sort?: Sort): Pageable {
        return new Pageable(page, size, sort);
    }
}