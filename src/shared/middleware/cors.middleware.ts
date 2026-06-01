import { UnauthorizedException } from "@/shared/exception/common.exception.js";
import { env } from "@/env.js";
import cors, { type CorsOptions } from "cors";

const CORE_HEADERS = ["Content-Type", "Accept", "X-Requested-With"];
const AUTH_HEADERS = ["Authorization", "X-API-Key"];
const SECURITY_HEADERS = ["Idempotency-Key", "If-Match", "If-None-Match"];
const MONITORING_HEADERS = ["X-Correlation-ID", "X-Request-ID", "traceparent"];
const APP_HEADERS = ["Accept-Language"];

export const corsOptions: CorsOptions = {
  origin: env.CORS_ALLOWED_ORIGINS,
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
