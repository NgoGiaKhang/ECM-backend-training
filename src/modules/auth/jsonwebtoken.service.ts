import jwt from "jsonwebtoken";
import { JwtService, SignOptions, VerifyOptions } from "./jwt.service.js";
import {
  ExpiredTokenException,
  InvalidTokenException,
  TokenGenerationException,
} from "./auth.exception.js";
import { logger } from "@/shared/logger/logger.js";
export const JWT_ERROR_NAMES = {
  TOKEN_EXPIRED: "TokenExpiredError",
  JSON_WEB_TOKEN: "JsonWebTokenError",
  NOT_BEFORE: "NotBeforeError",
} as const;
export class JwtServiceImpl implements JwtService {
  /**
   * @param secretOrPrivateKey - The secret key for HMAC or private key for RSA/ECDSA
   * @param defaultSignOptions - Global fallback options (e.g., default 1-hour expiration)
   */
  constructor(
    private readonly secretOrPrivateKey: string | Buffer,
    private readonly defaultSignOptions: SignOptions = { expiresIn: "1h" },
  ) {}

  /**
   * Signs a payload and returns a JSON Web Token string.
   * @throws {TokenGenerationException} For payload errors or signing failures.
   */
  public async sign(payload: object, options?: SignOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      // Merge global defaults with specific execution options
      const mergedOptions = { ...this.defaultSignOptions, ...options };
      logger.debug(payload);
      logger.debug(mergedOptions)
      jwt.sign(
        payload,
        this.secretOrPrivateKey,
        mergedOptions as jwt.SignOptions,
        (error, token) => {
          if (error) {
            return reject(
              new TokenGenerationException(
                "Failed to generate JWT token",
                error,
              ),
            );
          }
          // The token is guaranteed to be a string if no error occurred
          resolve(token!);
        },
      );
    });
  }

  /**
   * Verifies a token and returns the decoded payload if valid.
   * @throws {ExpiredTokenException} If token has expired.
   * @throws {InvalidTokenException} If signature, issuer, or structural integrity is broken.
   */
  public async verify<T extends object = any>(
    token: string,
    options?: VerifyOptions,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        this.secretOrPrivateKey,
        options as jwt.VerifyOptions,
        (error, decoded) => {
          if (error) {
            if (error) {
              // Use the clean constants instead of magic strings
              if (error.name === JWT_ERROR_NAMES.TOKEN_EXPIRED) {
                return reject(new ExpiredTokenException());
              }

              if (error.name === JWT_ERROR_NAMES.JSON_WEB_TOKEN) {
                return reject(new InvalidTokenException());
              }

              if (error.name === JWT_ERROR_NAMES.NOT_BEFORE) {
                return reject(
                  new InvalidTokenException("Token is not active yet"),
                );
              }
              return reject(
                new InvalidTokenException("Token verification failed"),
              );
            }
            // Generic safety fallback
            return reject(
              new InvalidTokenException("Token verification failed"),
            );
          }
          // Return the typed payload
          resolve(decoded as T);
        },
      );
    });
  }

  /**
   * Decodes a token's payload without verifying its signature.
   * Does not throw validation exceptions.
   */
  public decode<T = any>(token: string): T | null {
    try {
      const decoded = jwt.decode(token);
      return decoded as T | null;
    } catch {
      // Return null silently if the string is structurally impossible to decode
      return null;
    }
  }
}
