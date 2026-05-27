import { PrismaClient } from "@/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

export const testPrisma = new PrismaClient({
  adapter,
});
/**
 * Gracefully closes database connections.
 */
async function shutdown() {
  await testPrisma.$disconnect();
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
