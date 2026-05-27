import { UnauthorizedException } from "@/shared/exception/common.exception.js";
import { env } from "@/env.js";
import cors, { type CorsOptions } from "cors";

const CORE_HEADERS = ["Content-Type", "Accept", "X-Requested-With"];
const AUTH_HEADERS = ["Authorization", "X-API-Key"];
const SECURITY_HEADERS = ["Idempotency-Key", "If-Match", "If-None-Match"];
const MONITORING_HEADERS = ["X-Correlation-ID", "X-Request-ID", "traceparent"];
const APP_HEADERS = ["X-Client-Version", "X-Device-Id", "Accept-Language"];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Grant execution requests coming from standalone server proxies or testing units (no origin header)
    if (!origin) {
      return callback(null, true);
    }

    // Evaluate matching rules against the parsed allowedOrigins array structure
    if (env.CORS_ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(
        new UnauthorizedException(
          `[CORS Blocked]: Target client origin unauthorized: ${origin}`,
        ),
      );
    }
  },
  credentials: env.CORS_CREDENTIALS,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    ...CORE_HEADERS,
    ...AUTH_HEADERS,
    ...SECURITY_HEADERS,
    ...MONITORING_HEADERS,
    ...APP_HEADERS,
  ],
  optionsSuccessStatus: 200,
};

export const apiCors = cors(corsOptions);
