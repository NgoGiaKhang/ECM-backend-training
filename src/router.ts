import { Router } from "express";
import { productRouter } from "./modules/catalog/product/index.js";
import { categoryRouter } from "./modules/catalog/category/category.router.js";
import { brandRouter } from "./modules/catalog/brand/brand.router.js";

// Create main application router
const router: Router = Router();

// Register product routes under /products path
router.use("/v1/products", productRouter);

// Register Brand routes under /brands path
router.use("/v1/brands", brandRouter);

router.use("/v1/categories", categoryRouter);

// Export aggregated router
export default router;
