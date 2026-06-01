import { PrismaService } from "@/shared/database/index.js";
import {
  CreateUserFacadeDto,
  UserFacade,
  UserFacadeDto,
} from "./user.facade.js";

export class PrismaUserFacade implements UserFacade {
  constructor(private readonly prisma: PrismaService) {}
  existByEmail(email: string): Promise<boolean> {
    return this.prisma.user.exists({ email: email });
  }

  public async findByEmailWithPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      roles: user.roles,
      status: user.status,
      verifiedAt: user.verifiedAt,
      passwordHash: user.passwordHash, // Trả về hash chỉ để Auth Service đối chiếu password
    };
  }

  public async createUser(dto: CreateUserFacadeDto): Promise<UserFacadeDto> {
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: dto.passwordHash,
        fullname: dto.fullname,
      },
    });

    return {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      roles: user.roles,
      status: user.status,
    };
  }

  public async findById(id: string): Promise<UserFacadeDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      roles: user.roles,
      status: user.status,
    };
  }
}
