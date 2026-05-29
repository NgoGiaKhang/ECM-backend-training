import { Router } from "express";

import { prismaInstance } from "@/shared/database/index.js";
import { BrandService } from "./brand.service.js";
import { BrandController } from "./brand.controller.js";

const brandRouter = Router();
const brandService = new BrandService(prismaInstance);
const brandController = new BrandController(brandService);
brandRouter.get("/", brandController.findAll);

export { brandRouter };
