-- AlterTable
ALTER TABLE "catalog"."Brand" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "catalog"."Category" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "catalog"."Product" ADD COLUMN     "deletedAt" TIMESTAMP(3);
