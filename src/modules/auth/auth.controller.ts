import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";
import { serialize } from "@/shared/http/serialize.js";
import { extractBody } from "@/shared/http/request.helper.js";
import { LoginRequestSchema, RegisterRequestSchema } from "./auth.schema.js";
import { HttpStatus } from "@/shared/http/http-status.js";
import { getAuthenticatedUser } from "@/shared/auth/auth.helper.js";
import { MeResponse } from "./types.js";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/login
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = extractBody(req, LoginRequestSchema);
    const result = await this.authService.login(email, password);
    res.status(HttpStatus.OK).json(serialize(result));
  };

  /**
   * POST /auth/register
   */
  public register = async (req: Request, res: Response): Promise<void> => {
    const body = extractBody(req, RegisterRequestSchema);
    const data = await this.authService.register(body);
    res.status(HttpStatus.CREATED).json(serialize(data));
  };

  public me = async (req: Request, res: Response): Promise<void> => {
    const user = getAuthenticatedUser(req);
    const data: MeResponse = await this.authService.me(user);
    res.status(HttpStatus.CREATED).json(serialize(data));
  };
}
