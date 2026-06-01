import { UnauthorizedException } from "../exception/common.exception.js";
import { AuthenticatedUser } from "./auth.interface.js";
import { Request } from "express";
import { PublicRoute } from "./types.js";
import { logger } from "../logger/logger.js";

/**
 * Get authenticated user from request.
 * Throws UnauthorizedException if user is not authenticated.
 */
export function getAuthenticatedUser(
  req: Request & { user?: AuthenticatedUser },
): AuthenticatedUser {
  const user = req.user as AuthenticatedUser | undefined;
  logger.debug({ user: user });
  if (!user) {
    throw new UnauthorizedException();
  }
  return user;
}

export function setAuthenticatedUser(
  req: Request & { user?: AuthenticatedUser },
  user: AuthenticatedUser,
): void {
  req.user = user;
}

/**
 * Utility to determine if an incoming HTTP request matches any configured public routes.
 * Utilizes an isolated string-swapping algorithm to safely convert standard
 * Glob pattern wildcards (`*` and `**`) into rigorous JavaScript Regular Expressions.
 */
export function isPublicRoute(
  req: Request,
  publicRoutes: PublicRoute[],
): boolean {
  // Normalize incoming paths by cutting off trailing slashes to prevent matching mismatches
  // Example: Treating '/api/v1/health/' identical to '/api/v1/health'
  const currentPath = req.path === "/" ? "/" : req.path.replace(/\/$/, "");
  const currentMethod = req.method.toUpperCase();

  return publicRoutes.some((route) => {
    // 1. HTTP Method Validation Verification
    if (route.methods && !route.methods.includes(currentMethod as any)) {
      return false;
    }

    // Normalize the configured route path string matching pattern
    const normalizedRoutePath =
      route.path === "/" ? "/" : route.path.replace(/\/$/, "");

    // 2. Convert Glob Wildcard Pattern String to a Native RegExp Instance

    // Step A: Escape all core regex-native special control characters
    // strictly keeping the asterisk (*) intact for subsequent parsing
    let regexPattern = normalizedRoutePath.replace(/[.+^${}()|[\]\\]/g, "\\$&");

    // Step B: Target global recursive deep-wildcards (**), translating them into
    // an isolated, unique temporary placeholder token to prevent cross-overwrite collisions
    regexPattern = regexPattern.replace(/\*\*/g, "___ANYTHING_PLACEHOLDER___");

    // Step C: Convert single-level wildcards (*) into a localized block match notation.
    // The sequence `[[^/]*]` temporary wrapper guards against recurring structural mutations.
    regexPattern = regexPattern.replace(/\*/g, "[[^/]*]");

    // Step D: Rehydrate the deep-wildcard placeholders back into full operational regex wildcards.
    // `.*` handles matching absolutely any character sequence across multi-level directory levels.
    regexPattern = regexPattern.replace(/___ANYTHING_PLACEHOLDER___/g, ".*");

    // Convert the isolated character block sequence wrappers back to a clean single URL segment look-ahead matcher
    regexPattern = regexPattern.replace(/\[\[\^\/\]\*\]/g, "[^/]*");

    // Enforce definitive exact string-boundaries from anchor start (^) to anchor finish ($)
    const routeRegex = new RegExp(`^${regexPattern}$`);

    return routeRegex.test(currentPath);
  });
}
