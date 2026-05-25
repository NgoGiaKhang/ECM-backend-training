import { Page } from "../pagination/page.js";
import type { ApiResponse, PaginatedResponse } from "./api-response.types.js";

export function serialize<T>(value: T): ApiResponse<T>;

export function serialize<T>(value: Page<T>): PaginatedResponse<T>;

export function serialize<T>(value: T | Page<T>) {
  if (value instanceof Page) {
    return {
      data: value.items,
      pagination: {
        page: value.page,
        limit: value.limit,
        total: value.totalItems,
        totalPages: value.totalPages,
      },
    };
  }
  return {
    data: value,
  };
}
