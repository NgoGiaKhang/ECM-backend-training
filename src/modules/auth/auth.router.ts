import { Router } from "express";
import { authController } from "./auth.module.js";
import { loginRateLimiter } from "./auth-limit.js";

const authRouter = Router();

authRouter.post("/register", authController.register);

authRouter.post("/login", loginRateLimiter, authController.login);

authRouter.get("/me", authController.me);

export { authRouter };
