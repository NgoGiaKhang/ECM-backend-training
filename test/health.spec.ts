import request from "supertest";
import express from "express";
import { healthRoute } from "@/modules/health/index.js";
// Setup a mini express app just to test this specific router
const app = express();
app.use(healthRoute);

describe("GET /health", () => {
  it("should return 200 OK with server health metrics", async () => {
    const response = await request(app).get("/health");

    // 1. Assert HTTP Status Code
    expect(response.status).toBe(200);

    // 2. Assert Response Body Structure
    expect(response.body).toEqual({
      status: "ok",
      timestamp: expect.any(String), // Validates it's a string since the time changes every millisecond
      env: expect.toBeOneOf([undefined, "development", "production", "test"]),
      uptime: expect.any(Number),
      memory: {
        rss: expect.any(Number),
        heapTotal: expect.any(Number),
        heapUsed: expect.any(Number),
        external: expect.any(Number),
        arrayBuffers: expect.any(Number),
      },
    });

    // 3. Optional: Validate timestamp format strictly
    expect(Date.parse(response.body.timestamp)).not.toBeNaN();
  });
});
