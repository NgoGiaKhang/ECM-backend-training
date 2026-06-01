import { UserRole, UserStatus } from "@/generated/prisma/enums.js";

export interface UserFacadeDto {
  id: string;
  email: string;
  fullname: string;
  roles: UserRole[];
  status: UserStatus;
  verifiedAt?: Date | null;
}

export interface CreateUserFacadeDto {
  email: string;
  passwordHash: string;
  fullname: string;
}

export interface UserFacade {
  existByEmail(email: string): Promise<boolean>;
  /**
   * Finds a user by email and returns their profile alongside the password hash for login verification.
   * @returns The user data and hash, or null if not found.
   */
  findByEmailWithPassword(
    email: string,
  ): Promise<(UserFacadeDto & { passwordHash: string }) | null>;

  /**
   * Registers a new user into the identity system.
   */
  createUser(dto: CreateUserFacadeDto): Promise<UserFacadeDto>;

  /**
   * Checks if a user is valid and active by their ID.
   */
  findById(id: string): Promise<UserFacadeDto | null>;
}
