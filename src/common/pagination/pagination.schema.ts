import { env } from "@/config/env.js";
import z from "zod";

export const PageableSchema = z.object({
  page: z.coerce.number().int().min(1).default(env.DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(env.MAX_SIZE)
    .default(env.DEFAULT_SIZE),
  sort: z.string().optional().default(""),
});
