import { Router } from "express";
import { authController } from "./auth.module.js";

const authRouter = Router();

authRouter.post("/register", authController.register);

authRouter.post("/login", authController.login);

authRouter.get("/me", authController.me);

export { authRouter };
