import { Router } from "express";
import { ProductController } from "./product.controller.js";
import { idempotency } from "@/shared/idempotency/idempotency.middleware.js";
import { cacheInstance } from "@/shared/cache/index.js";
import { InMemoryProductService } from "./mock-product.service.js";
import { products } from "./product.mock.js";

const router: Router = Router();

const inMemoryProductService = new InMemoryProductService(products);
const productController = new ProductController(inMemoryProductService);

router.get("/", productController.findAll);
router.get("/:id", productController.findById);
router.post("/", idempotency(cacheInstance, 60 * 30), productController.create);
router.put("/:id", productController.update);
router.delete("/:id", productController.delete);

export default router;
