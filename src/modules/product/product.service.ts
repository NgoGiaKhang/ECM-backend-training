import type { Pageable } from "@/common/pagination/pageable.js";
import type { Product } from "./types.js";
import { Page } from "@/common/pagination/page.js";

export interface ProductService {
  findAll(pageable: Pageable): Promise<Page<Product>>;

  findById(id: string): Promise<Product>;

  delete(id: string): Promise<void>;

  
}
