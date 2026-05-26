import rateLimit from "express-rate-limit";
import { env } from "@/env.js";
import { TooManyRequestsException } from "../exception/index.js";

/**
 * Global API Rate Limiter Middleware
 */
export const apiLimiter = rateLimit({
  // The time window in milliseconds during which requests are tracked
  windowMs: env.RATE_LIMIT_WINDOW_MS,

  // Maximum number of connections a single IP can make within the windowMs period
  limit: env.RATE_LIMIT_MAX_REQUESTS,

  // Returns rate limit info in the `RateLimit-*` HTTP headers (Recommended for modern APIs)
  standardHeaders: true,

  // Disables the legacy `X-RateLimit-*` headers to avoid redundant payload data
  legacyHeaders: false,

  /**
   * Custom rate limit violation interceptor
   * Instead of sending a generic text response, this bypasses the default handler
   * and forwards a specialized HTTP 429 exception down to the centralized global error middleware.
   */
  handler: (_req, _res, next) => {
    next(new TooManyRequestsException());
  },
});
