import "dotenv/config";
import dotenv from "dotenv";

import { z } from "zod";
// Trigger initialization of dot files before parsing values
dotenv.config();

/**
 * Structural schema layout enforcing correct data types
 * and boundary configurations across all environments.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(8080),

  // App routing prefix validation and sanitation
  APP_PREFIX: z
    .string()
    .default("/api")
    .transform((val) => {
      let prefix = val.trim();
      if (!prefix.startsWith("/")) prefix = `/${prefix}`;
      if (prefix.endsWith("/")) prefix = prefix.slice(0, -1);
      return prefix;
    }),

  // Security parameters
  CORS_ALLOWED_ORIGINS: z
    .string()
    .default("")
    .transform((val) =>
      val
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
  CORS_CREDENTIALS: z
    .string()
    .default("false")
    .transform((val) => val.toLowerCase() === "true"),

  /**
   * Global API rate limit time window in milliseconds.
   *
   * Example:
   * 900000 = 15 minutes
   */
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),

  /**
   * Maximum number of requests allowed
   * within the global rate limit window.
   */
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),

  /**
   * Validates supported database connection strings for Prisma.
   *
   * Supported protocols:
   * - postgresql://
   * - postgres://
   * - mysql://
   * - sqlserver://
   * - mongodb://
   * - file:
   */
  DATABASE_URL: z.string().refine(
    (value) => {
      try {
        const url = new URL(value);

        return [
          "postgresql:",
          "postgres:",
          "mysql:",
          "sqlserver:",
          "mongodb:",
          "file:",
        ].includes(url.protocol);
      } catch {
        return false;
      }
    },
    {
      message: "Invalid database connection string",
    },
  ),

  /**
   * Maximum PostgreSQL connections in the pool.
   */
  DATABASE_POOL_MAX: z.coerce.number().int().positive().default(20),

  /**
   * Idle client timeout in milliseconds.
   */
  DATABASE_POOL_IDLE_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(60_000),

  /**
   * Connection timeout in milliseconds.
   */
  DATABASE_POOL_CONNECTION_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(10_000),

  /**
   * Enable Prisma SQL query logging.
   */
  DATABASE_LOG_QUERY: z.coerce.boolean().default(false),

  // Global pagination defaults
  DEFAULT_PAGE: z.coerce.number().int().min(1).default(1),
  DEFAULT_SIZE: z.coerce.number().int().min(1).default(10),
  MAX_SIZE: z.coerce.number().int().min(1).default(100),
});

// Run synchronous configuration parsing
const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error("Invalid application configuration variables:");
  process.exit(1); // Abort execution immediately due to critical misconfiguration
}

/**
 * Read-only freeze guarding runtime configurations against mutation side effects.
 * Extensively autocompletes throughout your code architecture base.
 */
export const env = Object.freeze(parseResult.data);
