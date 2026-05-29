import { extractPageable } from "@/shared/pagination/index.js";
import { BrandService } from "./brand.service.js";
import { serialize } from "@/shared/http/index.js";
import { HttpStatus } from "@/shared/http/http-status.js";
import type { Request, Response } from "express";

export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  findAll = async (req: Request, res: Response) => {
    const pageable = extractPageable(req);
    const result = await this.brandService.findAll(pageable);
    return res.status(HttpStatus.OK).json(serialize(result));
  };
}
