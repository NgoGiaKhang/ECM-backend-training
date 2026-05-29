import { PrismaService } from "@/shared/database/index.js";
import { Pageable } from "@/shared/pagination/pageable.js";
import { Brand } from "./types.js";
import { Page } from "@/shared/pagination/page.js";

export class BrandService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pageable: Pageable): Promise<Page<Brand>> {
    const page = await this.prisma.brand.paginate({
      pageable,
      where: {
        deletedAt: null,
      },
    });

    return page.map(
      (b): Brand => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        description: b.description ?? undefined,
        logo: b.logo ?? undefined,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      }),
    );
  }
}
