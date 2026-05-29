import { Prisma } from "@/generated/prisma/client.js";
import { Direction, Page, Pageable, Sort } from "../pagination/index.js";

export function toPrismaOrderBy<T>(
  sort?: Sort<T>,
): Array<Partial<Record<keyof T, Direction>>> | undefined {
  if (!sort || sort.isUnsorted) {
    return undefined;
  }

  return sort.orders.map((order) => ({
    [order.property]: order.direction,
  })) as Array<Partial<Record<keyof T, Direction>>>;
}

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
            orderBy: toPrismaOrderBy(pageable.sort) ?? (queryArgs as any).orderBy,
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
