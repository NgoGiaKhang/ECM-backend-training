import { AuthenticatedUser, AuthProvider } from "@/shared/auth/index.js";
import { JwtService } from "./jwt.service.js";
import { type Request } from "express";
import { AccessTokenClaims } from "./types.js";
import { AuthenticationException } from "./auth.exception.js";
import { logger } from "@/shared/logger/logger.js";

export class JwtAuthProvider implements AuthProvider {
  constructor(private readonly jwtService: JwtService) {}

  public async authenticate(
    request: Request,
  ): Promise<AuthenticatedUser | null> {
    // 1. Extract the Authorization header safely (handles both lowercase and uppercase variants)
    const authHeader =
      request.headers["authorization"] || request.headers["Authorization"];

    if (!authHeader || typeof authHeader !== "string") {
      return null; // No token provided -> Allow anonymous access or handle via Guards/Middleware later
    }

    // 2. Split the header string to verify the "Bearer <token>" format
    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      return null; // Invalid token format according to OAuth2/JWT standards
    }

    try {
      // 3. Verify the token and map the underlying payload into the AccessTokenClaims interface
      const claims = await this.jwtService.verify<AccessTokenClaims>(token);
      // 4. Map the token claims data onto the application's internal AuthenticatedUser domain structure
      return {
        id: claims.sub, // The 'sub' (Subject) claim maps directly to the Database User ID
        roles: claims.roles, // Array of access roles (e.g., ['admin', 'user'])
        sid: claims.sid,
      };
    } catch (error) {
      // 5. Forward token-specific business exceptions (Expired, Invalid) up the stack.
      // This allows your Global Exception Filters to automatically respond with an HTTP 401
      // alongside the explicit machine-readable error codes.
      if (error instanceof AuthenticationException) {
        throw error;
      }

      // Fallback safeguard for any unexpected system errors during verification
      return null;
    }
  }
}
