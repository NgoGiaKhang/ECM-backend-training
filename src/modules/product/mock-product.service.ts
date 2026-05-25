import { Page } from "@/common/pagination/page.js";
import type { ProductService } from "./product.service.js";
import type { Product } from "./types.js";
import type { Pageable } from "@/common/pagination/pageable.js";
import { products } from "./product.mock.js";
import { NotFoundException } from "@/common/exception/common.exception.js";
import { HttpException } from "@/common/exception/http.exception.js";

export class InMemoryProductService implements ProductService {
  constructor(private readonly products: Product[]) {}

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

  async delete(id: string): Promise<void> {
    const index = this.products.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new HttpException(404, "Not_Found", "Product not found");
    }

    this.products.splice(index, 1);
  }
}

