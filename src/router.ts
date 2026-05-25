import { Router } from "express";
import productRoute from "./modules/product/product.route.js";

// Create main application router
const router: Router = Router();

// Register product routes under /products path
router.use("/v1/products", productRoute);

// Export aggregated router
export default router;
