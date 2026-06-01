// Note: You can map these to your own types if you want to abstract away the underlying library completely.

import { StringValue } from "ms";

export type SignOptions = {
  expiresIn?: StringValue;
  notBefore?: string | number;
  audience?: string | string[];
  issuer?: string;
  jwtid?: string;
  subject?: string;
};

export type VerifyOptions = {
  audience?: string | RegExp | (string | RegExp)[];
  issuer?: string | string[];
  subject?: string;
};

export interface JwtService {
  /**
   * Signs a payload and returns a JSON Web Token string.
   * @param payload - The data to encode into the token (usually user ID, roles, etc.)
   * @param options - Optional overrides for this specific token (e.g., custom expiration)
   * @returns A promise that resolves to the signed JWT string.
   *  @throws {TokenGenerationException} If signing fails due to misconfiguration, invalid payload, or internal crypto issues.   */
  sign(payload: object, options?: SignOptions): Promise<string>;

  /**
   * Verifies a token and returns the decoded payload if valid.
   * @template T - The expected type shape of the decoded payload.
   * @param token - The JWT string to verify.
   * @param options - Validation constraints (e.g., expected issuer or audience).
   * @returns A promise that resolves to the verified and decoded payload.
   * @throws {ExpiredTokenException} If the token's expiration time (`exp`) has passed.
   * @throws {InvalidTokenException} If the token is malformed, has an invalid signature, or fails structural checks.
   */
  verify<T extends object = any>(
    token: string,
    options?: VerifyOptions,
  ): Promise<T>;
}
