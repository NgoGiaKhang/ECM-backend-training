import { Router } from "express";
import { productRouter } from "./modules/catalog/product/index.js";
import { categoryRouter } from "./modules/catalog/category/category.router.js";
import { brandRouter } from "./modules/catalog/brand/brand.router.js";
import { authRouter } from "./modules/auth/index.js";

// Create main application router
const router: Router = Router();

// Register product routes under /products path
router.use("/products", productRouter);

// Register Brand routes under /brands path
router.use("/brands", brandRouter);

router.use("/categories", categoryRouter);
router.use("/auth", authRouter);

// Export aggregated router
export default router;
