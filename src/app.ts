import express from "express";
import { env } from "@/config/env.js";
import { NotFoundException } from "./common/exception/index.js";
import { loggingMiddleware, logger } from "./core/logger/index.js";
import { exceptionMiddleware } from "./core/middleware/index.js";
import router from "@/router.js";
import cors from "cors";
import { corsOptions } from "@/config/cors.js";
import { healthRoute } from "@/modules/health/index.js";

const app = express();
// 1. Mount extracted core middleware infrastructure
app.use(cors(corsOptions));
app.use(express.json());

app.use(healthRoute);

// Request logging middleware
app.use(loggingMiddleware);

// API routing (global prefix applied)
app.use(env.APP_PREFIX, router);

app.use((req) => {
  throw new NotFoundException(`Cannot ${req.method} ${req.originalUrl}`);
});

// Global error handling middleware (must be last)
app.use(exceptionMiddleware);

export { app };
