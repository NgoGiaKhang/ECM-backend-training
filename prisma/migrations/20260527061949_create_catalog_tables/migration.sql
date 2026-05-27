-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "catalog";

-- CreateTable
CREATE TABLE "catalog"."Product" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "originalPrice" DECIMAL(10,2),
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "discountPercent" INTEGER,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "sold" INTEGER NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "thumbnail" TEXT NOT NULL,
    "images" TEXT[],
    "categoryId" TEXT,
    "brandId" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "catalog"."Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "catalog"."Product"("slug");

-- CreateIndex
CREATE INDEX "Product_sku_idx" ON "catalog"."Product"("sku");

-- CreateIndex
CREATE INDEX "Product_slug_idx" ON "catalog"."Product"("slug");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "catalog"."Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_brandId_idx" ON "catalog"."Product"("brandId");

-- CreateIndex
CREATE INDEX "Product_createdAt_idx" ON "catalog"."Product"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "catalog"."Category"("slug");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "catalog"."Category"("slug");

-- CreateIndex
CREATE INDEX "Category_parentId_idx" ON "catalog"."Category"("parentId");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "catalog"."Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "catalog"."Brand"("slug");

-- CreateIndex
CREATE INDEX "Brand_slug_idx" ON "catalog"."Brand"("slug");

-- CreateIndex
CREATE INDEX "Brand_name_idx" ON "catalog"."Brand"("name");

-- AddForeignKey
ALTER TABLE "catalog"."Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "catalog"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog"."Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "catalog"."Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog"."Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "catalog"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
