import type { Request, Response } from "express";

import { CategoryService } from "./category.service.js";
import { extractPageable } from "@/shared/pagination/extract-pageable.js";
import { serialize } from "@/shared/http/serialize.js";
import { HttpStatus } from "@/shared/http/http-status.js";

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  findAll = async (req: Request, res: Response) => {
    const pageable = extractPageable(req);
    const result = await this.categoryService.findAll(pageable);
    return res.status(HttpStatus.OK).json(serialize(result));
  };
}
