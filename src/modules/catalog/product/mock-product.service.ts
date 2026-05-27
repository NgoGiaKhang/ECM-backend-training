import { Page } from "@/shared/pagination/page.js";
import type { ProductService } from "./product.service.js";
import type { Product } from "./types.js";
import type { Pageable } from "@/shared/pagination/pageable.js";
import { NotFoundException } from "@/shared/exception/common.exception.js";
import { ProductRequest } from "./product.schema.js";
import { randomUUID } from "crypto";

export class InMemoryProductService implements ProductService {
  constructor(private products: Product[]) {}
  async create(input: ProductRequest): Promise<Product> {
    const now = new Date().toISOString();

    const newProduct: Product = {
      id: randomUUID(),

      sku: input.sku,
      name: input.name,
      slug: input.slug,

      description: input.description,

      originalPrice: input.originalPrice ?? 0,
      price: input.price,

      discountPercent: input.discountPercent,

      currency: input.currency,

      stock: input.stock,
      sold: input.sold,

      isAvailable: input.isAvailable,

      rating: input.rating,
      reviewCount: input.reviewCount,

      categoryId: input.categoryId,
      brandName: "", // chưa resolve brand từ DB
      brandId: input.brandId,
      thumbnail: input.thumbnail,

      tags: input.tags,

      createdAt: now,
      updatedAt: now,
    };

    this.products.push(newProduct);

    return newProduct;
  }

  async findAll(pageable: Pageable): Promise<Page<Product>> {
    const { page, limit: size } = pageable;

    const start = (page - 1) * size;
    const end = start + size;

    const items = this.products.slice(start, end);

    const total = this.products.length;

    return new Page(items, total, page, size);
  }

  async findById(id: string): Promise<Product> {
    const product = this.products.find((p) => p.id === id);

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  async update(id: string, input: ProductRequest): Promise<Product> {
    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const existingProduct = this.products[productIndex];

    const updatedProduct: Product = {
      ...existingProduct!,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    this.products[productIndex] = updatedProduct;

    return updatedProduct;
  }
  async deleteById(id: string): Promise<void> {
    const index = this.products.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new NotFoundException("Product not found");
    }
    this.products.splice(index, 1);
  }
}
