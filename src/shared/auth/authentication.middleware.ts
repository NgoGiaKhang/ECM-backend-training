import { NextFunction, Request, Response } from "express";
import { AuthProvider } from "./auth.interface.js";
import { UnauthorizedException } from "../exception/common.exception.js";
import { isPublicRoute, setAuthenticatedUser } from "./auth.helper.js";
import { PublicRoute } from "./types.js";
import { logger } from "../logger/logger.js";

type AuthMiddlewareOptions = {
  publicRoutes?: PublicRoute[];
};
export function authenticate(
  provider: AuthProvider,
  options: AuthMiddlewareOptions = {},
) {
  const publicRoutes = options.publicRoutes ?? [];

  return async (req: Request, _res: Response, next: NextFunction) => {
    // 1. Skip public routes

    logger.debug("auth");
    // 2. Authenticate
    const user = await provider.authenticate(req);

    // 3. Not authenticated
    if (!user) {
      if (isPublicRoute(req, publicRoutes)) {
        return next();
      }
      return next(new UnauthorizedException("You are not authenticated"));
    }

    // 4. Attach user to
    setAuthenticatedUser(req, user);
    next();
  };
}
