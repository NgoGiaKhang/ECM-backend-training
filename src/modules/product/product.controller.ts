import { serialize } from "@/common/http/index.js";
import type { Request, Response } from "express";
import type { ProductService } from "./product.service.js";
import { extractPageable } from "@/common/pagination/pagination.helper.js";
import { getBody, getParam, getParams } from "@/common/http/request.helper.js";
import { ProductSchema } from "./product.schema.js";

export class ProductController {
  private count: number = 0;
  constructor(private readonly service: ProductService) {}

  findAll = async (req: Request, res: Response) => {
    const pageable = extractPageable(req);
    console.log(pageable);

    const products = await this.service.findAll(pageable);
    return res.json(serialize(products));
  };

  findById = async (req: Request, res: Response) => {
    const id = getParam(req, "id");
    const product = await this.service.findById(id);
    return res.json(serialize(product));
  };

  create = async (req: Request, res: Response) => {
    const product = getBody(req, ProductSchema)

    this.count = this.count + 1;
    return res.json(
      serialize({
        count: this.count,
      }),
    );
  };
}

