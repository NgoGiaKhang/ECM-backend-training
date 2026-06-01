import express from "express";
import { env } from "@/env.js";
import {
  globalExceptionHandler,
  malformedErrorHandler,
  NotFoundException,
} from "./shared/exception/index.js";
import { loggingMiddleware, logger } from "./shared/logger/index.js";
import router from "@/router.js";
import { apiCors, apiLimiter } from "@/shared/middleware/index.js";
import { healthRoute } from "@/modules/health/index.js";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./shared/docs/index.js";
import { authenticate } from "./shared/auth/index.js";
import { authProvider } from "./modules/auth/auth.module.js";

const app = express();

/* ==========================================================================
   1. GLOBAL INFRASTRUCTURE & SECURITY MIDDLEWARES
   ========================================================================== */

// Global request rate limiting (Shield against Brute Force/DDoS)
app.use(apiLimiter);

// Enable Cross-Origin Resource Sharing (CORS)
app.use(apiCors);

// Incoming request body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parses url-encoded bodies (form-data)

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

// HTTP request logging (Tracks incoming traffic)
app.use(loggingMiddleware);

/* ==========================================================================
   2. SYSTEM & BUSINESS ROUTES
   ========================================================================== */

// Liveness/Readiness probe endpoint (Exempt from global prefix)
app.use(healthRoute);

// 2. Auth middleware (global)
app.use(
  authenticate(authProvider, {
    publicRoutes: [
      // {
      //   path: "/api/v1/products",
      //   methods: ["GET"],
      // },
      // {
      //   path: "/api/v1/products/*",
      //   methods: ["GET"],
      // },
      {
        path: "/api/v1/auth/login",
        methods: ["POST"],
      },
      {
        path: "/api/v1/auth/register",
        methods: ["POST"],
      },
    ],
  }),
);

// Core application API routing under a global prefix (e.g., /api/v1)
app.use(env.APP_PREFIX, router);

/* ==========================================================================
   3. ERROR HANDLING MIDDLEWARES
   ========================================================================== */

// Catch-all handler for undefined routes (Triggers 404)
app.use((req) => {
  throw new NotFoundException(`Cannot ${req.method} ${req.originalUrl}`);
});

app.use(malformedErrorHandler);
// Centralized global error handling interceptor (Must be the final middleware)
app.use(globalExceptionHandler);

export { app };
