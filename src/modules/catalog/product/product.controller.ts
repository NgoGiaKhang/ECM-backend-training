import { extractQuery, serialize } from "@/shared/http/index.js";
import type { Request, Response } from "express";
import type { ProductService } from "./product.service.js";
import { extractPageable } from "@/shared/pagination/index.js";
import { extractBody, extractParam } from "@/shared/http/index.js";
import { HttpStatus } from "@/shared/http/http-status.js";
import { ProductFilterSchema, ProductRequestSchema } from "./product.schema.js";
import { logger } from "@/shared/logger/logger.js";

export class ProductController {
  constructor(private readonly service: ProductService) {}

  findAll = async (req: Request, res: Response) => {
    const pageable = extractPageable(req, [
      "name",
      "sold",
      "createdAt",
      "price",
    ]);
    const filter = extractQuery(req, ProductFilterSchema);
    logger.debug(filter)
    const products = await this.service.findAll(pageable, filter);
    return res.json(serialize(products));
  };

  findById = async (req: Request, res: Response) => {
    const id = extractParam(req, "id");
    const product = await this.service.findById(id);
    return res.json(serialize(product));
  };

  create = async (req: Request, res: Response) => {
    const body = extractBody(req, ProductRequestSchema);
    const data = await this.service.create(body);
    return res.status(HttpStatus.CREATED).json(serialize(data));
  };

  delete = async (req: Request, res: Response) => {
    const id = extractParam(req, "id");
    await this.service.deleteById(id);
    return res.status(HttpStatus.NO_CONTENT).send();
  };

  update = async (req: Request, res: Response) => {
    const id = extractParam(req, "id");
    const body = extractBody(req, ProductRequestSchema);
    const data = await this.service.update(id, body);
    return res.status(HttpStatus.OK).json(serialize(data));
  };
}
