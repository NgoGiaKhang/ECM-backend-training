-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "test";

-- CreateTable
CREATE TABLE "test"."TestUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TestUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TestUser_email_key" ON "test"."TestUser"("email");
