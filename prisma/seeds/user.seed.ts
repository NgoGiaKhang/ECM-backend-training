import { UserRole, UserStatus } from "@/generated/prisma/enums.js";
import { prisma } from "@/shared/database/prisma.js";
import * as bcrypt from "bcrypt";
import { ulid } from "ulid";

async function main() {
  console.log("Starting database seeding...");

  console.log("Cleaned existing users.");

  const saltRounds = 10;
  const commonPasswordHash = await bcrypt.hash("Password123@", saltRounds);

  const seedUsers = [
    {
      id: ulid(),
      email: "superadmin@system.com",
      fullname: "System Super Admin",
      passwordHash: commonPasswordHash,
      roles: [UserRole.super_admin, UserRole.admin],
      status: UserStatus.active,
      verifiedAt: new Date(),
    },
    {
      id: ulid(),
      email: "admin@system.com",
      fullname: "Alex Manager",
      passwordHash: commonPasswordHash,
      roles: [UserRole.admin],
      status: UserStatus.active,
      verifiedAt: new Date(),
    },
    {
      id: ulid(),
      email: "unverified.user@gmail.com",
      fullname: "John Unverified",
      passwordHash: commonPasswordHash,
      roles: [UserRole.user],
      status: UserStatus.active,
    },
    {
      id: ulid(),
      email: "banned.user@gmail.com",
      fullname: "Bad Actor",
      passwordHash: commonPasswordHash,
      roles: [UserRole.user],
      status: UserStatus.banned, // Tài khoản bị khóa để test BannedAccountException
      verifiedAt: new Date(),
    },
  ];

  for (const user of seedUsers) {
    const createdUser = await prisma.user.create({
      data: user,
    });
    console.log(
      `✅ Created user: ${createdUser.email} (Status: ${createdUser.status})`,
    );
  }

  console.log("🎉 Seeding successfully completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
