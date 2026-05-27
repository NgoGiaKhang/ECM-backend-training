import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

import { env } from "@/env.js";

import { PrismaClient } from "@/generated/prisma/client.js";

const logLevels: ("query" | "info" | "warn" | "error")[] =
  env.NODE_ENV === "development"
    ? ["info", "warn", "error"]
    : ["warn", "error"];

if (env.DATABASE_LOG_QUERY) {
  logLevels.unshift("query");
}

/**
 * Shared PostgreSQL connection pool.
 */
const pool = new Pool({
  connectionString: env.DATABASE_URL,

  /**
   * Maximum number of clients in the pool.
   */
  max: env.DATABASE_POOL_MAX,

  /**
   * Close idle clients after a period of inactivity.
   */
  idleTimeoutMillis: env.DATABASE_POOL_IDLE_TIMEOUT_MS,

  /**
   * Fail if connection is not established in time.
   */
  connectionTimeoutMillis: env.DATABASE_POOL_CONNECTION_TIMEOUT_MS,
});

/**
 * Prisma PostgreSQL driver adapter.
 */
const adapter = new PrismaPg(pool);

/**
 * Shared Prisma Client instance.
 */
export const prisma = new PrismaClient({
  adapter,

  /**
   * Prisma query logging configuration.
   */
  log: logLevels,
});

/**
 * Gracefully closes database connections.
 */
async function shutdown() {
  await prisma.$disconnect();
  await pool.end();
}

/**
 * Handle application shutdown signals.
 */
process.on("SIGINT", async () => {
  await shutdown();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await shutdown();
  process.exit(0);
});
