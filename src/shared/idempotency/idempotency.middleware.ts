import type { NextFunction, Request, Response } from "express";
import type { Cache } from "../cache/cache.interface.js";
import { IDEMPOTENCY_HEADER } from "./constant.js";
import { buildFingerprint, hashKey } from "./utils.js";
import {
  IdempotencyInProgressException,
  MissingIdempotencyKeyException,
} from "./exception.js";
import { logger } from "../logger/logger.js";

type IdempotencyState = "IN_PROGRESS" | "COMPLETED";
type IdempotentCacheEntry<T = unknown> = {
  status: number;
  body: T;
  state: IdempotencyState;
};
/**
 * Creates an idempotency middleware.
 *
 * Prevents duplicate request processing by:
 * - locking the request using a cache key
 * - returning cached responses for completed requests
 * - rejecting concurrent duplicate requests
 */
export function idempotency(cache: Cache, ttlSeconds = 60) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const key = req.header(IDEMPOTENCY_HEADER);

    if (!key) {
      return next(new MissingIdempotencyKeyException());
    }

    try {
      const cacheKey = hashKey(buildFingerprint(req, key));

      // Acquire a lock for the current request.
      // If the key already exists, another identical request is already running
      // or has already completed.
      const locked = await cache.setIfNotExists(
        cacheKey,
        {
          state: "IN_PROGRESS",
        },
        ttlSeconds,
      );

      if (!locked) {
        return handleCachedRequest(cache, cacheKey, res, next);
      }

      // Capture the response body before sending it.
      interceptResponse(res);

      // Persist or clean up the cache entry after request completion.
      attachCleanupHandlers({
        cache,
        cacheKey,
        res,
        ttlSeconds,
      });

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Handles duplicate requests.
 *
 * - Returns the cached response if the request already completed.
 * - Rejects the request if another identical request is still in progress.
 */
async function handleCachedRequest(
  cache: Cache,
  cacheKey: string,
  res: Response,
  next: NextFunction,
) {
  const cached = await cache.get<IdempotentCacheEntry>(cacheKey);

  if (cached?.state === "COMPLETED") {
    return res.status(cached.status).json(cached.body);
  }

  return next(new IdempotencyInProgressException());
}

/**
 * Intercepts res.json() to capture the response body
 * for later caching.
 */
function interceptResponse(res: Response) {
  const originalJson = res.json.bind(res);

  res.json = function (body: unknown): Response {
    res.locals.idempotencyBody = body;

    return originalJson(body);
  } as typeof res.json;
}

/**
 * Registers response lifecycle handlers.
 *
 * - finish:
 *   Persist successful responses or remove failed locks.
 *
 * - close:
 *   Clean up unfinished requests caused by aborted connections.
 */
function attachCleanupHandlers({
  cache,
  cacheKey,
  res,
  ttlSeconds,
}: {
  cache: Cache;
  cacheKey: string;
  res: Response;
  ttlSeconds: number;
}) {
  res.on("finish", () => {
    void persistResponse({
      cache,
      cacheKey,
      res,
      ttlSeconds,
    });
  });

  res.on("close", () => {
    if (!res.writableEnded) {
      void cache.delete(cacheKey);
    }
  });
}

/**
 * Persists successful responses into cache.
 *
 * Failed responses are not cached so clients
 * can safely retry the request.
 */
async function persistResponse({
  cache,
  cacheKey,
  res,
  ttlSeconds,
}: {
  cache: Cache;
  cacheKey: string;
  res: Response;
  ttlSeconds: number;
}) {
  try {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      await cache.set(
        cacheKey,
        {
          state: "COMPLETED",
          status: res.statusCode,
          body: res.locals.idempotencyBody,
        },
        ttlSeconds,
      );

      return;
    }

    await cache.delete(cacheKey);
  } catch (error) {
    logger.error({
      message: "Failed to persist idempotency response",
      cause: error,
    });
  }
}
