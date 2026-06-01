import { prismaInstance } from "@/shared/database/index.js";
import { PrismaUserFacade } from "./prisma-user.facade.js";
export const userFacade = new PrismaUserFacade(prismaInstance);
