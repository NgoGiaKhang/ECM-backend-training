import type { NextFunction, Request, Response } from "express";
import { env } from "@/config/env.js";
import { logger } from "../logger/logger.js";
import {
  HttpException,
} from "@/common/exception/http.exception.js";
import type { ErrorResponse } from "@/common/http/api-response.types.js";
import { HttpStatus } from "@/common/http/http-status.js";

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
