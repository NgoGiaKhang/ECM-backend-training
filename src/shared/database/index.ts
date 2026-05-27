import { Prisma } from "@prisma/client/extension";
import { prismaPaginationExtension } from "./prisma-pagination.extension.js";
import { prismaExistsExtension } from "./prisma-exist.extension.js";
import { prisma } from "./prisma.js";
import { Pageable } from "../pagination/pageable.js";

export const prismaInstance = prisma
  .$extends(prismaExistsExtension)
  .$extends(prismaPaginationExtension);
  
  

export type PrismaService = typeof prismaInstance;
