import { describe, it, expect, beforeEach } from "vitest";
import jwt from "jsonwebtoken";
import { JwtServiceImpl } from "@/modules/auth/jsonwebtoken.service.js";
describe("JwtServiceImpl (full cases)", () => {
  const secret = "test-secret";
  
  let service: JwtServiceImpl;

  beforeEach(() => {
    service = new JwtServiceImpl(secret, {
      expiresIn: "1h",
    });
  });

  // =========================
  // SIGN
  // =========================
  describe("sign", () => {
    it("should sign object payload", async () => {
      const token = await service.sign({ userId: "1" });

      expect(typeof token).toBe("string");
      
      const decoded = jwt.decode(token) as any;
      expect(decoded.userId).toBe("1");
    });


    it("should respect default expiresIn", async () => {
      const token = await service.sign({ userId: "1" });

      const decoded = jwt.decode(token) as any;

      expect(decoded.exp).toBeDefined();
    });

    it("should override expiresIn per call", async () => {
      const token = await service.sign(
        { userId: "1" },
        { expiresIn: "2s" },
      );

      expect(typeof token).toBe("string");
    });

    it("should throw when payload is invalid", async () => {
      // circular object -> should fail
      const obj: any = {};
      obj.self = obj;

      await expect(service.sign(obj)).rejects.toThrow();
    });
  });

  // =========================
  // VERIFY
  // =========================
  describe("verify", () => {
    it("should verify valid token", async () => {
      const token = await service.sign({ userId: "123" });

      const payload = await service.verify<{ userId: string }>(token);

      expect(payload.userId).toBe("123");
    });

    it("should verify with issuer option", async () => {
      const token = await service.sign(
        { userId: "123" },
        { issuer: "app" },
      );

      const payload = await service.verify(token, {
        issuer: "app",
      });

      expect(payload.userId).toBe("123");
    });

    it("should throw on wrong issuer", async () => {
      const token = await service.sign(
        { userId: "123" },
        { issuer: "app" },
      );

      await expect(
        service.verify(token, { issuer: "wrong" }),
      ).rejects.toThrow();
    });

    it("should throw on invalid token", async () => {
      await expect(service.verify("invalid.token")).rejects.toThrow();
    });

    it("should throw on expired token", async () => {
      const shortService = new JwtServiceImpl(secret, {
        expiresIn: "1s",
      });

      const token = await shortService.sign({ userId: "123" });

      await new Promise((r) => setTimeout(r, 1200));

      await expect(shortService.verify(token)).rejects.toThrow();
    });

    it("should respect audience option", async () => {
      const token = await service.sign(
        { userId: "123" },
        { audience: "client" },
      );

      const payload = await service.verify(token, {
        audience: "client",
      });

      expect(payload.userId).toBe("123");
    });
  });
});