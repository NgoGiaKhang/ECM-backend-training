import { Router } from "express";
import { ProductController } from "./product.controller.js";
import { idempotency } from "@/shared/idempotency/idempotency.middleware.js";
import { cacheInstance } from "@/shared/cache/index.js";
import { PrismaProductService } from "./prisma-product.service.js";
import { prismaInstance } from "@/shared/database/index.js";

const productRouter: Router = Router();

const inMemoryProductService = new PrismaProductService(prismaInstance);
const productController = new ProductController(inMemoryProductService);

productRouter.get("/", productController.findAll);
productRouter.get("/:id", productController.findById);
productRouter.post(
  "/",
  idempotency(cacheInstance, 60 * 30),
  productController.create,
);
productRouter.put("/:id", productController.update);
productRouter.delete("/:id", productController.delete);

export { productRouter };
