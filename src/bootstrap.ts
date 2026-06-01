import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import "dotenv/config";
import dotenv from "dotenv";
import path from "path";
extendZodWithOpenApi(z);

const nodeEnv = process.env.NODE_ENV ?? "development";
const envFile = `.env.${nodeEnv}`;

const resolvedPath = path.resolve(envFile);
console.log("Loading env file:", resolvedPath);

const result = dotenv.config({
  path: envFile,
});
dotenv.config({
  path: envFile,
  override: false,
});
if (result.error) {
  console.error("❌ Failed to load env file:", result.error);
}
