import { Page } from "@/shared/pagination/page.js";
import type { ProductService } from "./product.service.js";
import type { Product } from "./types.js";
import type { Pageable } from "@/shared/pagination/pageable.js";
import { products } from "./product.mock.js";
import { NotFoundException } from "@/shared/exception/common.exception.js";
import { ProductRequest } from "./product.schema.js";

export class InMemoryProductService implements ProductService {
  constructor(private products: Product[]) {}
  async create(input: ProductRequest): Promise<Product> {
    const newProduct: Product = {
      ...input,
      id: Math.random().toString(36).substring(2, 11),
      rating: 0,
      stock: 0,
      sold: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reviewCount: 0,
    };

    products.push(newProduct);
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
