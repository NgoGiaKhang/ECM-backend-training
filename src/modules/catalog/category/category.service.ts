import { PrismaService } from "@/shared/database/index.js";
import { Page } from "@/shared/pagination/page.js";
import { Pageable } from "@/shared/pagination/pageable.js";
import { Category } from "./types.js";
import { Prisma } from "@/generated/prisma/client.js";

export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pageable: Pageable): Promise<Page<Category>> {
    const page = await this.prisma.category.paginate({
      pageable,
      where: {
        deletedAt: null,
      },
    });

    return page.map((item) => this.mapCategory(item));
  }
  private mapCategory(category: Prisma.CategoryGetPayload<{}>): Category {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? undefined,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
