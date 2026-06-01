import { env } from "@/env.js";
import { JwtServiceImpl } from "./jsonwebtoken.service.js";
import { JwtService } from "./jwt.service.js";
import { JwtAuthProvider } from "./jwt-auth.provider.js";
import { AuthProvider } from "@/shared/auth/index.js";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";
import { userFacade } from "@/modules/user/index.js";

export const jwtService: JwtService = new JwtServiceImpl(env.JWT_SECRET, {
  expiresIn: env.JWT_EXPIRES_IN,
  audience: env.JWT_AUDIENCE,
  issuer: env.JWT_ISSUER,
});

export const authProvider: AuthProvider = new JwtAuthProvider(jwtService);

const authService = new AuthService(userFacade, jwtService);
export const authController = new AuthController(authService);
