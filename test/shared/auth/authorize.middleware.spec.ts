import type { NextFunction, Request, Response } from "express";
import { authorize } from "@/shared/auth/authorize.middleware.js";
import { ROLES } from "@/shared/auth/role.enum.js";
import { ForbiddenException } from "@/shared/exception/common.exception.js";

describe("authorize", () => {
  const res = {} as Response;

  it("should allow SUPER_ADMIN", () => {
    const req = {
      user: {
        id: "1",
        roles: [ROLES.SUPER_ADMIN],
      },
    } as unknown as Request;

    const next = vi.fn();

    authorize({ exact: [ROLES.ADMIN] })(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it("should allow when role meets minimum requirement", () => {
    const req = {
      user: {
        id: "1",
        roles: [ROLES.ADMIN],
      },
    } as unknown as Request;

    const next = vi.fn();

    authorize({ minimum: ROLES.ADMIN })(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it("should deny when role is below minimum requirement", () => {
    const req = {
      user: {
        id: "1",
        roles: [ROLES.USER],
      },
    } as unknown as Request;

    const next = vi.fn();

    expect(() => authorize({ minimum: ROLES.ADMIN })(req, res, next)).toThrow(
      ForbiddenException,
    );

    expect(next).not.toHaveBeenCalled();
  });

  it("should allow exact role match", () => {
    const req = {
      user: {
        id: "1",
        roles: [ROLES.MANAGER],
      },
    } as unknown as Request;

    const next = vi.fn();

    authorize({
      exact: [ROLES.ADMIN, ROLES.MANAGER],
    })(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it("should deny when exact role does not match", () => {
    const req = {
      user: {
        id: "1",
        roles: [ROLES.USER],
      },
    } as unknown as Request;

    const next = vi.fn();

    expect(() =>
      authorize({
        exact: [ROLES.ADMIN, ROLES.MANAGER],
      })(req, res, next),
    ).toThrow(ForbiddenException);

    expect(next).not.toHaveBeenCalled();
  });

  it("should allow if one of multiple roles satisfies minimum requirement", () => {
    const req = {
      user: {
        id: "1",
        roles: [ROLES.USER, ROLES.ADMIN],
      },
    } as unknown as Request;

    const next = vi.fn();

    authorize({ minimum: ROLES.ADMIN })(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it("should allow if one of multiple roles matches exact list", () => {
    const req = {
      user: {
        id: "1",
        roles: [ROLES.USER, ROLES.MANAGER],
      },
    } as unknown as Request;

    const next = vi.fn();

    authorize({
      exact: [ROLES.ADMIN, ROLES.MANAGER],
    })(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });
});
describe("authorize - advanced cases", () => {
  const res = {} as Response;

  it("should allow SUPER_ADMIN even when exact roles do not match", () => {
    const req = {
      user: {
        id: "1",
        roles: [ROLES.SUPER_ADMIN],
      },
    } as unknown as Request;

    const next = vi.fn();

    authorize({
      exact: [ROLES.ADMIN],
    })(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it("should allow SUPER_ADMIN even when minimum role is higher than all roles", () => {
    const req = {
      user: {
        id: "1",
        roles: [ROLES.USER, ROLES.SUPER_ADMIN],
      },
    } as unknown as Request;

    const next = vi.fn();

    authorize({
      minimum: ROLES.ADMIN,
    })(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it("should authorize when one role satisfies minimum and another does not", () => {
    const req = {
      user: {
        id: "1",
        roles: [ROLES.USER, ROLES.ADMIN],
      },
    } as unknown as Request;

    const next = vi.fn();

    authorize({
      minimum: ROLES.ADMIN,
    })(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it("should authorize when one role matches exact list among many roles", () => {
    const req = {
      user: {
        id: "1",
        roles: [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
      },
    } as unknown as Request;

    const next = vi.fn();

    authorize({
      exact: [ROLES.ADMIN],
    })(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it("should deny when none of multiple roles satisfy minimum requirement", () => {
    const req = {
      user: {
        id: "1",
        roles: [ROLES.USER, ROLES.MODERATOR],
      },
    } as unknown as Request;

    const next = vi.fn();

    expect(() =>
      authorize({
        minimum: ROLES.ADMIN,
      })(req, res, next),
    ).toThrow(ForbiddenException);
  });

  it("should deny when none of multiple roles match exact list", () => {
    const req = {
      user: {
        id: "1",
        roles: [ROLES.USER, ROLES.MODERATOR],
      },
    } as unknown as Request;

    const next = vi.fn();

    expect(() =>
      authorize({
        exact: [ROLES.ADMIN, ROLES.MANAGER],
      })(req, res, next),
    ).toThrow(ForbiddenException);
  });

  it("should handle duplicate roles", () => {
    const req = {
      user: {
        id: "1",
        roles: [ROLES.ADMIN, ROLES.ADMIN],
      },
    } as unknown as Request;

    const next = vi.fn();

    authorize({
      minimum: ROLES.ADMIN,
    })(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it("should preserve middleware flow by calling next exactly once", () => {
    const req = {
      user: {
        id: "1",
        roles: [ROLES.ADMIN],
      },
    } as unknown as Request;

    const next = vi.fn();

    authorize({
      minimum: ROLES.ADMIN,
    })(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should throw exact error message for minimum mode", () => {
    const req = {
      user: {
        id: "1",
        roles: [ROLES.USER],
      },
    } as unknown as Request;

    const next = vi.fn();

    expect(() =>
      authorize({
        minimum: ROLES.ADMIN,
      })(req, res, next),
    ).toThrow(
      `Insufficient privileges. This resource requires at least a '${ROLES.ADMIN}' clearance level.`,
    );
  });

  it("should throw exact error message for exact mode", () => {
    const req = {
      user: {
        id: "1",
        roles: [ROLES.USER],
      },
    } as unknown as Request;

    const next = vi.fn();

    expect(() =>
      authorize({
        exact: [ROLES.ADMIN],
      })(req, res, next),
    ).toThrow(
      "Access denied. Your role classification does not have permission to access this endpoint.",
    );
  });

  it("should work with a large role set", () => {
    const req = {
      user: {
        id: "1",
        roles: [ROLES.USER, ROLES.MODERATOR, ROLES.MANAGER, ROLES.ADMIN],
      },
    } as unknown as Request;

    const next = vi.fn();

    authorize({
      exact: [ROLES.ADMIN],
    })(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });
});
