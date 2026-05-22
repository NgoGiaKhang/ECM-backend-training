import { env } from "@/env.js";
import pino, { type LoggerOptions } from "pino";

const loggerConfig: Record<string, LoggerOptions> = {
  development: {
    level: "debug",

    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "yyyy-mm-dd HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  },

  production: {
    level: "info",
  },

  test: {
    level: "silent",
  },
};

export const LogScope = {
  REQUEST: "[REQUEST]",
  ERROR: "[ERROR]",
  WARN: "[WARN]",
  AUTH: "[AUTH]",
  DATABASE: "[DATABASE]",
} as const;

const config = loggerConfig[env.NODE_ENV] ?? loggerConfig.development;
export const logger = pino(config);
