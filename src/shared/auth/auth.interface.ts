import { Request } from "express";

export interface AuthenticatedUser {
  id: string;
  roles: string[];
  sid: string
}

export interface AuthProvider {
  authenticate(request: Request): Promise<AuthenticatedUser | null>;
}

