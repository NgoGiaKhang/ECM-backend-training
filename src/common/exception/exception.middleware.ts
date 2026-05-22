import type { NextFunction, Request, Response } from "express";
import type { ErrorResponse } from "./types.js";
import { HttpException, HttpStatus } from "./http.exception.js";
import { env } from "@/env.js";
import { logger } from "../log/logger.js";

export const GENERIC_ERROR_RESPONSE: ErrorResponse = {
  status: HttpStatus.INTERNAL,
  code: "UNKNOWN_ERROR",
  message: "Unknown error",
};

const isProduction = env.NODE_ENV === "production";

export function exceptionMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof HttpException) {
    logger.warn({
      code: err.code,
      status: err.status,
      message: err.message,
      method: req.method,
      path: req.originalUrl,
    });
    const shouldExpose = !isProduction || err.expose;
    const response: ErrorResponse = {
      status: err.status,
      code: err.code,
      message: shouldExpose ? err.message : GENERIC_ERROR_RESPONSE.message,
    };
    return res.status(err.status).json(response);
  }

  // Unknown error
  logger.error({
    err,
    method: req.method,
    path: req.originalUrl,
  });
  // Development mode
  if (!isProduction && err instanceof Error) {
    return res.status(HttpStatus.INTERNAL).json({
      status: HttpStatus.INTERNAL,
      code: "UNKNOWN_ERROR",
      message: err.message,
      stack: err.stack,
    });
  }
  // Production mode
  return res.status(GENERIC_ERROR_RESPONSE.status).json(GENERIC_ERROR_RESPONSE);
}
