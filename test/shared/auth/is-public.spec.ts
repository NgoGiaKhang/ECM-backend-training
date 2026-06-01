import { isPublicRoute } from "@/shared/auth/auth.helper.js";

describe("isPublicRoute", () => {
  const makeReq = (path: string, method: string = "GET") => ({
    path,
    method,
  } as any);

  describe("exact path match", () => {
    it("should match exact path with no methods constraint", () => {
      const publicRoutes = [{ path: "/health" }];

      expect(isPublicRoute(makeReq("/health"), publicRoutes)).toBe(true);
    });

    it("should not match different path", () => {
      const publicRoutes = [{ path: "/health" }];

      expect(isPublicRoute(makeReq("/healthz"), publicRoutes)).toBe(false);
    });

    it("should match exact many path with no methods constraint", () => {
      const publicRoutes = [{ path: "/api/v1/health" }];

      expect(isPublicRoute(makeReq("/api/v1/health"), publicRoutes)).toBe(true);
    });
  });

  describe("method filtering", () => {
    it("should match when method is included", () => {
      const publicRoutes = [
        { path: "/users", methods: ["GET", "POST"] as const},
      ];

      expect(isPublicRoute(makeReq("/users", "GET"), publicRoutes)).toBe(true);
      expect(isPublicRoute(makeReq("/users", "POST"), publicRoutes)).toBe(true);
    });

    it("should not match when method is not included", () => {
      const publicRoutes = [
        { path: "/users", methods: ["GET"] as const },
      ];

      expect(isPublicRoute(makeReq("/users", "POST"), publicRoutes)).toBe(false);
    });

    it("should allow all methods when methods is undefined", () => {
      const publicRoutes = [{ path: "/users" }];

      expect(isPublicRoute(makeReq("/users", "GET"), publicRoutes)).toBe(true);
      expect(isPublicRoute(makeReq("/users", "DELETE"), publicRoutes)).toBe(true);
    });
  });

  describe("wildcard matching /*", () => {
    it("should match single level wildcard /*", () => {
      const publicRoutes = [{ path: "/users/*" }];

      expect(isPublicRoute(makeReq("/users/123"), publicRoutes)).toBe(true);
      expect(isPublicRoute(makeReq("/users/abc"), publicRoutes)).toBe(true);
    });

    it("should not match deeper level for /*", () => {
      const publicRoutes = [{ path: "/users/*" }];

      expect(isPublicRoute(makeReq("/users/123/profile"), publicRoutes)).toBe(false);
    });
  });

  describe("wildcard matching /**", () => {
    it("should match multiple nested levels /**", () => {
      const publicRoutes = [{ path: "/files/**" }];

      expect(isPublicRoute(makeReq("/files/a/b/c"), publicRoutes)).toBe(true);
      expect(isPublicRoute(makeReq("/files/a"), publicRoutes)).toBe(true);
    });
  });

  describe("combined path + method", () => {
    it("should match wildcard path + method constraint", () => {
      const publicRoutes = [
        { path: "/users/*", methods: ["GET"] as const },
      ];

      expect(isPublicRoute(makeReq("/users/1", "GET"), publicRoutes)).toBe(true);
      expect(isPublicRoute(makeReq("/users/1", "POST"), publicRoutes)).toBe(false);
    });
  });

  describe("multiple routes priority", () => {
    it("should match if any route matches", () => {
      const publicRoutes = [
        { path: "/admin/*", methods: ["GET"] as const },
        { path: "/users/**" },
      ];

      expect(isPublicRoute(makeReq("/users/anything/deep"), publicRoutes)).toBe(true);
    });

    it("should return false if none match", () => {
      const publicRoutes = [
        { path: "/admin/*", methods: ["GET"] as const },
        { path: "/users/*", methods: ["POST"] as const },
      ];

      expect(isPublicRoute(makeReq("/private/data", "GET"), publicRoutes)).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle trailing slash differences", () => {
      const publicRoutes = [{ path: "/health" }];

      expect(isPublicRoute(makeReq("/health/"), publicRoutes)).toBe(true);
    });

    it("should ignore query string (if req.path includes only path)", () => {
      const publicRoutes = [{ path: "/search" }];

      expect(isPublicRoute(makeReq("/search?q=1"), publicRoutes)).toBe(false);
    });
  });
});