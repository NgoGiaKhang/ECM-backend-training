import { env } from "@/env.js";
import z from "zod";

const SORT_REGEX = /^(-?[a-zA-Z_][a-zA-Z0-9_]*)?(,-?[a-zA-Z_][a-zA-Z0-9_]*)*$/;

export const PageableSchema = z.object({
  page: z.coerce.number().int().min(1).default(env.DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(env.MAX_LIMIT)
    .default(env.DEFAULT_LIMIT),
  sort: z
    .string()
    .regex(SORT_REGEX, "Invalid sort format")
    .max(50, "Sort max length is 50 characters")
    .optional()
    .default(""),
});
