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
 * Idempotency middleware to prevent duplicate request execution.
 *
 * This middleware ensures that identical requests (same fingerprint + idempotency key):
 * - Are executed only once
 * - Return cached response for completed requests
 * - Reject concurrent in-progress duplicates
 *
 * Flow:
 * 1. Extract idempotency key from request header
 * 2. Build request fingerprint and hash it into a cache key
 * 3. Try to acquire lock in cache (IN_PROGRESS state)
 * 4. If lock exists:
 *    - If COMPLETED → return cached response
 *    - If IN_PROGRESS → throw IdempotencyInProgressException
 * 5. If lock acquired:
 *    - Intercept response body
 *    - Attach cleanup handlers
 *    - Continue request execution
 *
 * @param cache Cache implementation used for storing idempotency state
 * @param ttlSeconds Time-to-live for idempotency cache entry (default: 60s)
 *
 * @throws MissingIdempotencyKeyException
 * Thrown when request does not contain idempotency header
 *
 * @throws IdempotencyInProgressException
 * Thrown when an identical request is already being processed
 *
 * @throws Error
 * Any unexpected internal cache or hashing errors will be forwarded via next(err)
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
        logger.debug({
          message: "Duplicate idempotent request detected",
          cacheKey,
          path: req.originalUrl,
          method: req.method,
        });

        return handleCachedRequest(cache, cacheKey, res, next);
      }

      // Capture the response body before sending it.
      interceptResponse(res);

      // Persist or clean up the cache entry after request completion.
      attachCleanupHandlers({ cache, cacheKey, res, ttlSeconds });

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
    logger.debug({
      message: "Returning cached idempotent response",
      cacheKey,
      status: cached.status,
    });
    return res.status(cached.status).json(cached.body);
  }
  logger.debug({
    message: "Idempotent request already in progress",
    cacheKey,
  });

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
      logger.warn({
        message: "Request aborted before completion",
        cacheKey,
      });
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
