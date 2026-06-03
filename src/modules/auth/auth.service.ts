import { type UserFacade } from "@/modules/user/index.js";
import { JwtService } from "./jwt.service.js";
import * as bcrypt from "bcrypt";
import { AccessTokenClaims, LoginResponse, MeResponse } from "./types.js";
import {
  BadCredentialsException,
  BannedAccountException,
  InactiveAccountException,
  UnverifiedAccountException,
} from "./auth.exception.js";
import { RegisterRequest } from "./auth.schema.js";
import {
  NotFoundException,
  ValidationException,
} from "@/shared/exception/common.exception.js";
import { env } from "@/env.js";
import { AuthenticatedUser } from "@/shared/auth/auth.interface.js";



export class AuthService {
  constructor(
    private readonly userFacade: UserFacade,
    private readonly jwtService: JwtService,
  ) {}
  async register(body: RegisterRequest) {
    const existingUser = await this.userFacade.existByEmail(body.email);
    if (existingUser) {
      throw new ValidationException("This email address is already used", {
        email: "This email address is already used",
      });
    }

    const passwordHash = await bcrypt.hash(
      body.password,
      env.BCRYPT_SALT_ROUNDS,
    );

    await this.userFacade.createUser({
      email: body.email,
      passwordHash,
      fullname: body.fullname,
    });
  }

  public async login(email: string, passwordRaw: string): Promise<LoginResponse> {
    // 1. Fetch user profile along with password hash via the clean UserFacade contract
    const user = await this.userFacade.findByEmailWithPassword(email);

    // Generic error message for both non-existent emails and wrong passwords to protect security (anti-enumeration)
    if (!user) {
      throw new BadCredentialsException();
    }

    // 2. Validate user lifecycle conditions using the strong Prisma-defined enums
    if (user.status === "banned") {
      throw new BannedAccountException();
    }

    if (user.status === "inactive") {
      throw new InactiveAccountException();
    }

    if (!user.verifiedAt) {
      throw new UnverifiedAccountException();
    }

    // 3. Verify the input password against the secured cryptographic database hash
    const isPasswordValid = await bcrypt.compare(
      passwordRaw,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new BadCredentialsException();
    }

    // 4. Construct the formal type-safe payload using the explicit AccessTokenClaims interface
    const claims: AccessTokenClaims = {
      sub: user.id,
      roles: user.roles,
      sid: crypto.randomUUID().toString(),
    };

    // 5. Sign and issue the final stateless access token string
    const token = await this.jwtService.sign(claims);
    console.log(token);

    return {
      accessToken: token,
      user: {
        id: user.id,
        roles: user.roles as string[],
        fullname: user.fullname,
        email: user.email,
      },
    };
  }

  async me(user: AuthenticatedUser): Promise<MeResponse> {
    const u = await this.userFacade.findById(user.id);
    if (!u) throw new NotFoundException();

    return {
      id: u.id,
      roles: u.roles as string[],
      fullname: u.fullname,
      email: u.email,
    };
  }
}
