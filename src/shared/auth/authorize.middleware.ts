import { Request, Response, NextFunction } from "express";
import { getAuthenticatedUser } from "./auth.helper.js";
import { hasPrivilege, ROLES, RoleType } from "./role.enum.js";
import { ForbiddenException } from "../exception/index.js";

type AuthorizeOptions =
  | { minimum: RoleType; exact?: never } // Hierarchical mode
  | { exact: RoleType[]; minimum?: never }; // Strict explicit array mode
/**
 * Flexible Authorization Guard
 * Supports both Hierarchical baseline scoring and Explicit exact role matching.
 */
export const authorize = (options: AuthorizeOptions) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = getAuthenticatedUser(req); 
    // 1. Super Admin absolute bypass (Matches your system blueprint)
    const hasSuperAdmin = user.roles.includes(ROLES.SUPER_ADMIN);
  
    if (hasSuperAdmin) {
      return next();
    }
    let isAuthorized = false;
    const userRoles = user.roles as RoleType[];
    // 2. Branching Logic based on configuration type
    if (options.minimum) {
      isAuthorized = userRoles.some((userRole) =>
        hasPrivilege(userRole, options.minimum),
      );
    } else if (options.exact) {
      isAuthorized = userRoles.some((role) => options.exact!.includes(role));
    }
    if (!isAuthorized) {
      throw new ForbiddenException(
        options.minimum
          ? `Insufficient privileges. This resource requires at least a '${options.minimum}' clearance level.`
          : `Access denied. Your role classification does not have permission to access this endpoint.`,
      );
    }

    next();
  };
};
