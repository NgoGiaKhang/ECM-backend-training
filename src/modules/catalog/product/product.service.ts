import type { Pageable } from "@/shared/pagination/pageable.js";
import type { Product } from "./types.js";
import { Page } from "@/shared/pagination/page.js";
import { ProductFilterRequest, ProductRequest } from "./product.schema.js";

export interface ProductService {
  update(id: string, data: ProductRequest): Promise<Product>;
  create(input: ProductRequest): Promise<Product>;
  findAll(
    pageable: Pageable,
    filter?: ProductFilterRequest,
  ): Promise<Page<Product>>;
  findById(id: string): Promise<Product>;
  deleteById(id: string): Promise<void>;
}
