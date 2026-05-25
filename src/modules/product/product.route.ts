import { Router } from "express";
import { ProductController } from "./product.controller.js";
import { idempotency } from "@/core/idempotency/idempotency.middleware.js";
import { cacheInstance } from "@/core/cache/index.js";
import { InMemoryProductService } from "./mock-product.service.js";
import { products } from './product.mock.js';

const router: Router = Router();

const inMemoryProductService = new InMemoryProductService(products);
const productController = new ProductController(inMemoryProductService);



router.get("/", productController.findAll);
router.get("/:id", productController.findById);
router.post("/", idempotency(cacheInstance, 60 * 5), productController.create);

export default router;
