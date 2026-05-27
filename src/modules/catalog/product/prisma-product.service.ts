import { PrismaService } from "@/shared/database/index.js";
import { ProductRequest } from "./product.schema.js";
import {
  BadRequestException,
  NotFoundException,
} from "@/shared/exception/common.exception.js";
import { Prisma } from "@/generated/prisma/client.js";
import { Product } from "@/modules/catalog/product/types.js";
import { ProductService } from "./product.service.js";
import { Page } from "@/shared/pagination/page.js";
import { Pageable } from "@/shared/pagination/pageable.js";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true;
    brand: true;
  };
}>;

export class PrismaProductService implements ProductService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(pageable: Pageable): Promise<Page<Product>> {
    const page = await this.prisma.product.paginate({
      pageable: pageable,
      include: {
        category: true,
        brand: true,
      },
    });
    page.items;

    return page.map((i) => this.mapProduct(i));
  }
  deleteById(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  /**
   * Find product by id
   */
  async findById(id: string) {
    const res = await this.prisma.product.findUnique({
      where: { id },
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

        stock: data.stock,
        sold: data.sold,

        isAvailable: data.isAvailable,

        rating: data.rating,
        reviewCount: data.reviewCount,

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
    const [category, brand, product] = await Promise.all([
      data.categoryId
        ? this.prisma.category.exists({ id: data.categoryId })
        : Promise.resolve(1),
      this.prisma.brand.exists({ id: data.brandId }),
      this.prisma.product.exists({ sku: data.sku }),
    ]);

    if (data.categoryId && !category) {
      throw new NotFoundException("Category not found");
    }

    if (!brand) {
      throw new NotFoundException("Brand not found");
    }

    if (product) {
      throw new BadRequestException("SKU already used");
    }
  }

  /**
   * Update product
   */
  async update(id: string, data: Partial<ProductRequest>) {
    const exist = this.prisma.product.exists({
      id,
    });

    if (!exist) throw new NotFoundException("Product ");
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
