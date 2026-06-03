/**
 * Represents the standard and custom claims contained within an Access Token payload.
 */
export interface AccessTokenClaims {
  // --- Standard Registered Claims ---
  sub: string; // User Identity ID (Subject)
  iss?: string; // Token Issuer
  aud?: string; // Token Audience

  // --- Custom Context & Authorization Claims ---
  roles: string[]; // User access roles
  sid: string; // session id
}

export type MeResponse = {
  id: string;
  email: string;
  roles: ReadonlyArray<string>;
  fullname: string;
};

export interface LoginResponse {
  accessToken: string;
  user: MeResponse;
}
