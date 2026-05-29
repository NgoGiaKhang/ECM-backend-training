import { PrismaService } from "@/shared/database/index.js";
import { ProductFilterRequest, ProductRequest } from "./product.schema.js";
import {
  BadRequestException,
  NotFoundException,
} from "@/shared/exception/common.exception.js";
import { Prisma } from "@/generated/prisma/client.js";
import { Product } from "@/modules/catalog/product/types.js";
import { ProductService } from "./product.service.js";
import { Page } from "@/shared/pagination/page.js";
import { Pageable } from "@/shared/pagination/pageable.js";
import { logger } from "@/shared/logger/logger.js";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true;
    brand: true;
  };
}>;

export class PrismaProductService implements ProductService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(
    pageable: Pageable,
    filter?: ProductFilterRequest,
  ): Promise<Page<Product>> {
    const where = this.buildProductWhere(filter);

    const page = await this.prisma.product.paginate({
      pageable: pageable,
      include: {
        category: true,
        brand: true,
      },
      where,
    });

    return page.map((i) => this.mapProduct(i));
  }

  private buildProductWhere(
    filter?: ProductFilterRequest,
  ): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
    };

    // SEARCH
    if (filter?.query) {
      where.OR = [
        {
          name: {
            contains: filter.query,
            mode: "insensitive",
          },
        },
        {
          sku: {
            contains: filter.query,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains: filter.query,
            mode: "insensitive",
          },
        },
      ];
    }

    // CATEGORY
    if (filter?.categoryId) {
      where.categoryId = filter.categoryId;
    }

    // PRICE RANGE
    const priceWhere: Prisma.ProductWhereInput["price"] = {};

    if (filter?.minPrice) {
      priceWhere.gte = filter.minPrice;
    }

    if (filter?.maxPrice) {
      priceWhere.lte = filter.maxPrice;
    }

    if (Object.keys(priceWhere).length > 0) {
      where.price = priceWhere;
    }

    logger.debug(where);

    return where;
  }

  async deleteById(id: string): Promise<void> {
    const product = await this.prisma.product.exists({ id, deletedAt: null });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    await this.prisma.product.update({
      data: {
        deletedAt: new Date(),
      },
      where: { id },
    });
  }
  /**
   * Find product by id
   */
  async findById(id: string) {
    const res = await this.prisma.product.findUnique({
      where: { id, deletedAt: null },
      include: {
        category: true,
        brand: true,
      },
    });

    if (!res) throw new NotFoundException("Product not found");

    return this.mapProduct(res);
  }

  /**
   * Create product
   */
  async create(data: ProductRequest) {
    await this.validateRequest(data);
    const [skuExist, slugExist] = await Promise.all([
      this.prisma.product.exists({
        sku: data.sku,
      }),
      this.prisma.product.exists({
        slug: data.slug,
      }),
    ]);

    if (skuExist) {
      throw new BadRequestException("SKU already used");
    }

    if (slugExist) {
      throw new BadRequestException("Slug already used");
    }
    const rs = await this.prisma.product.create({
      data: {
        sku: data.sku,
        slug: data.slug,
        name: data.name,
        description: data.description,
        originalPrice: data.originalPrice,
        price: data.price,
        currency: data.currency,

        discountPercent: data.discountPercent,

        stock: 0,
        sold: 0,

        isAvailable: data.isAvailable,

        rating: 0,
        reviewCount: 0,

        thumbnail: data.thumbnail,
        images: data.images,
        categoryId: data.categoryId,
        brandId: data.brandId,
        tags: data.tags,
      },
      include: {
        category: true,
        brand: true,
      },
    });

    return this.mapProduct(rs);
  }

  async validateRequest(data: ProductRequest) {
    const [category, brand] = await Promise.all([
      data.categoryId
        ? this.prisma.category.exists({ id: data.categoryId, deletedAt: null })
        : Promise.resolve(1),
      this.prisma.brand.exists({ id: data.brandId, deletedAt: null }),
    ]);

    if (data.categoryId && !category) {
      throw new NotFoundException("Category not found");
    }

    if (!brand) {
      throw new NotFoundException("Brand not found");
    }
  }

  /**
   * Update product
   */
  async update(id: string, data: ProductRequest) {
    const exist = await this.prisma.product.exists({
      id,
      deletedAt: null,
    });

    if (!exist) throw new NotFoundException("Product ");

    await this.validateRequest(data);

    const res = await this.prisma.product.update({
      where: { id },
      data: {
        ...data,
      },
      include: {
        category: true,
        brand: true,
      },
    });

    return this.mapProduct(res);
  }

  /**
   * Delete product
   */
  async delete(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  private mapProduct(entity: ProductWithRelations): Product {
    return {
      id: entity.id,
      sku: entity.sku,
      name: entity.name,
      slug: entity.slug,
      description: entity.description ?? undefined,
      originalPrice: entity.originalPrice?.toNumber() ?? 0,
      price: entity.price.toNumber(),
      discountPercent: entity.discountPercent ?? undefined,
      currency: entity.currency ?? undefined,
      stock: entity.stock ?? undefined,
      sold: entity.sold ?? undefined,
      isAvailable: entity.isAvailable ?? undefined,
      rating: entity.rating,
      reviewCount: entity.reviewCount ?? undefined,
      categoryId: entity.categoryId ?? undefined,
      categoryName: entity.category?.name ?? undefined,
      brandName: entity.brand.name,
      brandId: entity.brand.id,
      thumbnail: entity.thumbnail,
      tags: entity.tags ?? [],
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
    };
  }
}
