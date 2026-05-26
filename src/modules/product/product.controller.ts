import { serialize } from "@/shared/http/index.js";
import type { Request, Response } from "express";
import type { ProductService } from "./product.service.js";
import { extractPageable } from "@/shared/pagination/index.js";
import { getBody, getParam, getParams } from "@/shared/http/index.js";
import { ProductSchema } from "./product.schema.js";

export class ProductController {
  constructor(private readonly service: ProductService) {}

  findAll = async (req: Request, res: Response) => {
    const pageable = extractPageable(req);
    const products = await this.service.findAll(pageable);
    return res.json(serialize(products));
  };

  findById = async (req: Request, res: Response) => {
    const id = getParam(req, "id");
    const product = await this.service.findById(id);
    return res.json(serialize(product));
  };

  create = async (req: Request, res: Response) => {
    const id = getParam(req, "id");
    const product = await this.service.findById(id);
    return res.json(serialize(product));
  };
}
