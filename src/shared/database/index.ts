import { Prisma } from "@prisma/client/extension";
import { prismaPaginationExtension } from "./prisma-pagination.extension.js";
import { prismaExistsExtension } from "./prisma-exist.extension.js";
import { prisma } from "./prisma.js";
import { Pageable } from "../pagination/pageable.js";


// Create a Prisma client instance with extensions applied
// - prismaExistsExtension: adds custom "exists" helper methods
// - prismaPaginationExtension: adds pagination utilities
export const prismaInstance = prisma
  .$extends(prismaExistsExtension)
  .$extends(prismaPaginationExtension);

// Export the extended Prisma client type for better type safety
// This allows services to use all extended methods with full TypeScript support
export type PrismaService = typeof prismaInstance;
