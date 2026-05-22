import "dotenv/config";

import { z } from "zod";

export const env = z
  .object({
    DEFAULT_PAGE:
      z.coerce.number().default(1),

    DEFAULT_SIZE:
      z.coerce.number().default(10),

    MAX_SIZE:
      z.coerce.number().default(100),

    NODE_ENV: z
      .enum([
        "production",
        "development",
        "test",
      ])
      .default("development"),
    PORT: z.coerce
      .number()
      .int()
      .nonnegative()
      .default(3000),
  })
  .parse(process.env);