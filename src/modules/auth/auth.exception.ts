import { HttpException } from "@/shared/exception/index.js";
/**
 * Thrown when token generation or signing fails due to internal crypto issues or invalid payload structures.
 * Returns HTTP Status 500 (Internal Server Error).
 */
export class TokenGenerationException extends HttpException {
  constructor(
    message: string = "Failed to generate security token",
    errorDetails?: any,
  ) {
    // Invoke HttpException: status = 500, code = 'TOKEN_GENERATION_FAILED'
    // expose = false (Crucial for 500 errors to avoid leaking system logs/crypto errors to users)
    super(500, "TOKEN_GENERATION_FAILED", message, false);

    // Optional: Log technical details internally for debugging purposes
    if (errorDetails) {
      this.stack += `\nCaused By: ${errorDetails.stack || errorDetails}`;
    }

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Base Exception for all Authentication-related errors.
 * Automatically sets the HTTP status to 401 (Unauthorized) and exposes the error to the client.
 */
export class AuthenticationException extends HttpException {
  constructor(code: string, message: string) {
    // Invoke HttpException: status = 401, expose = true
    super(401, code, message, true);

    // Maintain proper prototype chain for multi-level inheritance
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when a JSON Web Token (JWT) has expired.
 */
export class ExpiredTokenException extends AuthenticationException {
  constructor(message: string = "Token has expired") {
    super("TOKEN_EXPIRED", message);
  }
}

/**
 * Thrown when a JSON Web Token (JWT) is invalid, malformed, or has a bad signature.
 */
export class InvalidTokenException extends AuthenticationException {
  constructor(message: string = "Token is invalid") {
    super("TOKEN_INVALID", message);
  }
}

export class BadCredentialsException extends AuthenticationException {
  constructor(message: string = "Bad credentials!") {
    super("BAD_CREDENTIAL", message);
  }
}

/**
 * Thrown when an authenticated user attempts to log in but their account status is explicitly set to BANNED.
 */
export class BannedAccountException extends AuthenticationException {
  constructor(message: string = "This account has been permanently suspended") {
    super("BANNED_ACCOUNT", message);
  }
}

/**
 * Thrown when a user attempts to log in but has not verified their identity (e.g., email/phone OTP).
 */
export class UnverifiedAccountException extends AuthenticationException {
  constructor(
    message: string = "Account verification is required. Please check your email inbox",
  ) {
    super("UNVERIFIED_ACCOUNT", message);
  }
}

/**
 * Thrown when a user attempts to log in but their account status is explicitly set to INACTIVE.
 */
export class InactiveAccountException extends AuthenticationException {
  constructor(
    message: string = "This account is currently deactivated. Please verify your email or contact support",
  ) {
    // Pass the specific error code and human-readable message up to the base class
    super("INACTIVE_ACCOUNT", message);
  }
}
