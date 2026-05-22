import express from "express";
import dotenv from "dotenv";
import "./env.js";
import { exceptionMiddleware } from "./common/exception/exception.middleware.js";
import { logger } from "./common/log/logger.js";
import { loggingMiddleware } from "./common/log/logging.middleware.js";
import { env } from "./env.js";
dotenv.config();
const PORT = env.PORT;
const ENV = env.NODE_ENV;
const app = express();
app.use(loggingMiddleware);
app.get("/", (_req, res) => {
  res.json({
    data: "hello world",
  });
});

app.listen(PORT, () => {
  logger.info(`Server running in ${ENV} on port ${PORT}`);
});

app.use(exceptionMiddleware);
