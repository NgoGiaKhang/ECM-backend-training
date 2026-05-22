import { env } from "@/env.js";
import type { NextFunction, Request, Response } from "express";
import { LogScope, logger } from "./logger.js";

const REQUEST_LOG_SCOPE = "[REQUEST]";

const isProduction = env.NODE_ENV === "production";

export function loggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const start = performance.now();

  res.on("finish", () => {
    // Error already logged
    if (res.statusCode >= 400) {
      return;
    }

    const duration = performance.now() - start;

    // Production
    if (isProduction) {
      logger.info(
        `${LogScope.AUTH} ${req.method} ${req.originalUrl} ${res.statusCode} ${duration.toFixed(2)}ms`,
      );

      return;
    }

    // Development
    logger.info({
      scope: REQUEST_LOG_SCOPE,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration: `${duration.toFixed(2)}ms`,
      ip: req.ip,
    });
  });

  next();
}
