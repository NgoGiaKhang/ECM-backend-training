import type { Request, Response } from "express";
import z from "zod";
import { ValidationException } from "@/shared/exception/index.js";
import { formatValidationError } from "./validation.formatter.js";

/**
 * Extracts and validates request body using optional Zod schema.
 * If schema is provided, data will be validated and typed safely.
 *
 * @param req Express request object
 * @param schema Optional Zod schema for validation
 * @returns Parsed and validated body data
 */
export function extractBody<T>(req: Request, schema?: z.ZodType<T>): T {
  return validateOrThrow<T>(req.body, schema);
}

/**
 * Extracts and validates route params using optional Zod schema.
 *
 * @param req Express request object
 * @param schema Optional Zod schema for validation
 * @returns Parsed and validated params data
 */
export function extractParams<T>(req: Request, schema?: z.ZodType<T>): T {
  return validateOrThrow<T>(req.params, schema);
}

/**
 * Extracts a single route param by key with required validation.
 * Ensures the param exists and is a non-empty string.
 *
 * @param req Express request object
 * @param key Param key to extract
 * @returns The validated param value as string
 */
export function extractParam(req: Request, key: string): string {
  const result = extractParams(
    req,
    z.object({
      [key]: z.string().min(1, "Param cannot be empty"),
    }),
  );

  return result[key]!;
}

/**
 * Extracts and validates query parameters using optional Zod schema.
 *
 * @param req Express request object
 * @param schema Optional Zod schema for validation
 * @returns Parsed and validated query data
 */
export function extractQuery<T>(req: Request, schema?: z.ZodType<T>): T {
  return validateOrThrow<T>(req.query, schema);
}

/**
 * Validates arbitrary input data using a Zod schema.
 * Throws ValidationException if validation fails.
 *
 * Error format returned by formatValidationError:
 *
 * {
 *   "user.name": "message",
 *   "address.city": "message",
 *   "items[0].name": "message",
 *   "items[1].price": "message"
 * }
 *
 * Rules:
 * - Nested object paths are dot-separated (e.g. user.name)
 * - Array indexes are represented with bracket notation (e.g. items[0].name)
 * - Each key maps to a human-readable validation message
 *
 * @param data Input data to validate
 * @param schema Optional Zod schema
 * @returns Typed and validated data
 * @throws ValidationException when schema validation fails
 */
export function validateOrThrow<T>(data: unknown, schema?: z.ZodType<T>): T {
  if (!schema) return data as T;

  const result = schema.safeParse(data);

  if (!result.success) {
    throw new ValidationException(
      "Validation error",
      formatValidationError(result.error),
    );
  }

  return result.data;
}
