import { Prisma } from "@/generated/prisma/client.js";
import { Page, Pageable } from "../pagination/index.js";

type FindManyArgs<T> = Prisma.Args<T, "findMany">;

/**
 * Prisma pagination extension.
 */
export const prismaPaginationExtension = Prisma.defineExtension({
  name: "prisma-pagination",
  model: {
    $allModels: {
      async paginate<T, A>(
        this: T,
        args: Prisma.Exact<
          A,
          Prisma.Args<T, "findMany"> & { pageable: Pageable }
        >,
      ): Promise<Page<Prisma.Result<T, A, "findMany">[number]>> {
        const context = Prisma.getExtensionContext(this);

        const { pageable, ...queryArgs } = args as Prisma.Args<
          T,
          "findMany"
        > & {
          pageable: Pageable;
        };

        const [items, totalItems] = await Promise.all([
          (context as { findMany: Function }).findMany({
            ...queryArgs,
            skip: pageable.skip,
            take: pageable.take,
            orderBy: pageable.sort.object ?? (queryArgs as any).orderBy,
          }),
          (context as { count: Function }).count({
            where: (queryArgs as any).where,
          }),
        ]);

        return Page.of(items, totalItems, pageable);
      },
    },
  },
});
