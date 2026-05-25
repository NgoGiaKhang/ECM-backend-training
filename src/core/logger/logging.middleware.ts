import { env } from "@/config/env.js";
import type { NextFunction, Request, Response } from "express";
import { LogScope, logger } from "./logger.js";

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
    logger.info(
      `${LogScope.REQUEST} ${req.ip} ${req.method} ${req.originalUrl} ${res.statusCode} ${duration.toFixed(2)}ms`,
    );
    return;
  });
  next();
}
