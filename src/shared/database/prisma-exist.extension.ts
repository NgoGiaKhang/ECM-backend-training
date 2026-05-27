// src/lib/prisma.extension.ts

import { Prisma } from "@/generated/prisma/client.js";

/**
 * Shared Prisma client extensions.
 */
export const prismaExistsExtension = Prisma.defineExtension({
  name: "exists-prisma",

  model: {
    $allModels: {
      /**
       * Checks whether a record exists.
       */
      async exists<T>(
        this: T,
        where: Prisma.Args<T, "findFirst">["where"],
      ): Promise<boolean> {
        const context = Prisma.getExtensionContext(this);

        const count = await (
          context as {
            count: (args: any) => Promise<number>;
          }
        ).count({
          where,
          take: 1, // optional optimization (ignored by prisma in many cases)
        });

        return count > 0;
      },
    },
  },
});
