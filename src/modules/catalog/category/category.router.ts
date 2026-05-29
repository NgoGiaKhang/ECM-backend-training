import { Router } from "express";

import { CategoryController } from "./category.controller.js";
import { CategoryService } from "./category.service.js";
import { prismaInstance } from "@/shared/database/index.js";

export const categoryRouter = Router();
const categoryService = new CategoryService(prismaInstance);
const categoryController = new CategoryController(categoryService);
categoryRouter.get("/", categoryController.findAll);
