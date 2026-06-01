-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "identity";

-- CreateEnum
CREATE TYPE "identity"."UserRole" AS ENUM ('super_admin', 'admin', 'manager', 'user', 'guest');

-- CreateEnum
CREATE TYPE "identity"."UserStatus" AS ENUM ('active', 'inactive', 'banned');

-- CreateTable
CREATE TABLE "identity"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "roles" "identity"."UserRole"[] DEFAULT ARRAY['user']::"identity"."UserRole"[],
    "status" "identity"."UserStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "verified_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "identity"."users"("email");
