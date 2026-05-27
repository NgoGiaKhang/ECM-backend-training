import { exceptionMiddleware } from "@/shared/exception/exception.middleware.js";
import express, { RequestHandler } from "express";

export function createTestingMiddlewareApp(middleware: RequestHandler, handler: RequestHandler) {
  const app = express();

  app.use(express.json());
  app.post("/test", middleware, handler);

  app.use(exceptionMiddleware);

  return app;
}
