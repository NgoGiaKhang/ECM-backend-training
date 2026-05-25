import type { Request, Response } from "express";
import z from "zod";
import { ValidationException } from "@/common/exception/index.js";

export function getBody<T>(req: Request, schema?: z.ZodType<T>): T {
  return validateOrThrow<T>(req.body, schema);
}

export function getParams<T>(req: Request, schema?: z.ZodType<T>): T {
  return validateOrThrow<T>(req.params, schema);
}

export function getParam(req: Request, key: string): string {
  const result = getParams(
    req,
    z.object({
      [key]: z.string().min(1),
    }),
  );

  return result[key]!;
}

export function extractQuery<T>(req: Request, schema?: z.ZodType<T>): T {
  return validateOrThrow<T>(req.query, schema);
}
export function validateOrThrow<T>(data: unknown, schema?: z.ZodType<T>): T {
  if (!schema) return data as T;

  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = z.flattenError(result.error);
    //todo: format error
    throw new ValidationException("Validation error", {
  });
  }

  return result.data;
}
