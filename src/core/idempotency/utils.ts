import { IDEMPOTENCY_PREFIX } from "./constant.js";
import crypto from "crypto";
import type { Request } from "express";

function stableStringify(obj: unknown): string {
  if (obj === null || typeof obj !== "object") {
    return JSON.stringify(obj);
  }

  const sorted = Object.keys(obj as object)
    .sort()
    .reduce(
      (acc, key) => {
        (acc as any)[key] = (obj as any)[key];
        return acc;
      },
      {} as Record<string, unknown>,
    );

  return JSON.stringify(sorted);
}

export function hashKey(input: unknown): string {
  return crypto
    .createHash("sha256")
    .update(stableStringify(input))
    .digest("hex");
}

export function buildFingerprint(req: Request, key: string): unknown {
  return {
    method: req.method,
    url: req.originalUrl,
    key,
    body: req.body,
    query: req.query,
  };
}
