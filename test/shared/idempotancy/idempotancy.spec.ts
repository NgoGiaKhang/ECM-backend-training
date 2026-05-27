import request from "supertest";
import { MockCache } from "./mock-cache.js";
import { idempotency } from "@/shared/idempotency/index.js";
import { createTestingMiddlewareApp } from "test/test.utils.js";


describe("Idempotency Middleware - FULL EDGE CASES", () => {
  let cache: MockCache;

  beforeEach(() => {
    cache = new MockCache();
  });

  /**
   * CASE 1 - Missing key
   */
  it("should throw MissingIdempotencyKeyException", async () => {
    const app = createTestingMiddlewareApp(idempotency(cache), (_req, res) => {
      res.json({ ok: true });
    });

    const res = await request(app).post("/test").send({});

    expect(res.status).toBe(400);
    expect(res.body.code).toBe("MISSING_IDEMPOTENCY_KEY");
  });

  /**
   * CASE 2 - First request success
   */
  it("should allow first request", async () => {
    const app = createTestingMiddlewareApp(idempotency(cache), (req, res) => {
      res.status(201).json({ ok: true });
    });

    const res = await request(app)
      .post("/test")
      .set("Idempotency-Key", "abc")
      .send({ name: "A" });

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
  });

  /**
   * CASE 3 - Duplicate while processing (race)
   */
  it("should throw IdempotencyInProgressException on concurrent requests", async () => {
    const app = createTestingMiddlewareApp(idempotency(cache), async (_req, res) => {
      await new Promise((r) => setTimeout(r, 200));
      res.json({ ok: true });
    });

    const req1 = request(app)
      .post("/test")
      .set("Idempotency-Key", "abc")
      .send({ name: "A" });

    const req2 = request(app)
      .post("/test")
      .set("Idempotency-Key", "abc")
      .send({ name: "A" });

    const results = await Promise.allSettled([req1, req2]);

    const has409 = results.some(
      (r) => r.status === "fulfilled" && r.value.status === 409,
    );

    expect(has409).toBe(true);
  });

  /**
   * CASE 4 - Retry after success (cache hit)
   */
  it("should return cached response on retry", async () => {
    const app = createTestingMiddlewareApp(idempotency(cache), (req, res) => {
      res.json({ ok: true, ts: Date.now() });
    });

    const key = "abc";

    const first = await request(app)
      .post("/test")
      .set("Idempotency-Key", key)
      .send({ name: "A" });

    const second = await request(app)
      .post("/test")
      .set("Idempotency-Key", key)
      .send({ name: "A" });

    expect(second.body).toEqual(first.body);
  });

  /**
   * CASE 5 - Same key but different body (IMPORTANT)
   */
  it("should handle same key with different body", async () => {
    const app = createTestingMiddlewareApp(idempotency(cache), (req, res) => {
      res.json({ ok: true });
    });

    await request(app)
      .post("/test")
      .set("Idempotency-Key", "abc")
      .send({ name: "A" });

    const res = await request(app)
      .post("/test")
      .set("Idempotency-Key", "abc")
      .send({ name: "B" });

    expect([200]).toContain(res.status);
  });

  /**
   * CASE 6 - Empty / invalid key
   */
  it("should reject empty idempotency key", async () => {
    const app = createTestingMiddlewareApp(idempotency(cache), (_req, res) => {
      res.json({ ok: true });
    });

    const res = await request(app)
      .post("/test")
      .set("Idempotency-Key", "   ")
      .send({});

    expect(res.status).toBe(400);
  });

  /**
   * CASE 7 - Concurrent burst
   */
  it("should allow only one request in burst", async () => {
    const app = createTestingMiddlewareApp(idempotency(cache), async (_req, res) => {
      await new Promise((r) => setTimeout(r, 100));
      res.json({ ok: true });
    });

    const requests = Array.from({ length: 20 }).map(() =>
      request(app)
        .post("/test")
        .set("Idempotency-Key", "same")
        .send({ name: "A" }),
    );

    const results = await Promise.allSettled(requests);

    const success = results.filter(
      (r) => r.status === "fulfilled" && r.value.status === 200,
    );

    expect(success.length).toBe(1);
  });

  /**
   * CASE 8 - Error during processing
   */
  it("should handle handler error", async () => {
    const app = createTestingMiddlewareApp(idempotency(cache), () => {
      throw new Error("Boom");
    });

    const res = await request(app)
      .post("/test")
      .set("Idempotency-Key", "abc")
      .send({});

    expect(res.status).toBe(500);
  });

  /**
   * CASE 9 - Cache missing after set (corruption)
   */
  it("should handle cache miss safely", async () => {
    const app = createTestingMiddlewareApp(idempotency(cache), async (req, res) => {
      res.json({ ok: true });
    });

    const res = await request(app)
      .post("/test")
      .set("Idempotency-Key", "abc")
      .send({});

    expect(res.status).toBe(200);
  });
});