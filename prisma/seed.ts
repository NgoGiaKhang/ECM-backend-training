import { prisma } from "@/shared/database/prisma.js";

async function seed() {
  /**
   * Categories
   */
  const electronics = await prisma.category.create({
    data: {
      name: "Electronics",
      slug: "electronics",
      description: "Electronic devices and accessories",
    },
  });

  const smartphones = await prisma.category.create({
    data: {
      name: "Smartphones",
      slug: "smartphones",
      parentId: electronics.id,
    },
  });

  const laptops = await prisma.category.create({
    data: {
      name: "Laptops",
      slug: "laptops",
      parentId: electronics.id,
    },
  });

  const audio = await prisma.category.create({
    data: {
      name: "Audio",
      slug: "audio",
      parentId: electronics.id,
    },
  });

  /**
   * Brands
   */
  const apple = await prisma.brand.create({
    data: {
      name: "Apple",
      slug: "apple",
      logo:
        "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    },
  });

  const samsung = await prisma.brand.create({
    data: {
      name: "Samsung",
      slug: "samsung",
    },
  });

  const sony = await prisma.brand.create({
    data: {
      name: "Sony",
      slug: "sony",
    },
  });

  const dell = await prisma.brand.create({
    data: {
      name: "Dell",
      slug: "dell",
    },
  });

  /**
   * Products
   */
  await prisma.product.createMany({
    data: [
      {
        sku: "IPHONE-15-PRO-256",
        slug: "iphone-15-pro-256gb",
        name: "iPhone 15 Pro 256GB",
        description: "Apple flagship smartphone.",
        originalPrice: 1299.99,
        price: 1199.99,
        currency: "USD",
        discountPercent: 8,
        stock: 120,
        sold: 35,
        rating: 4.9,
        reviewCount: 420,
        thumbnail:
          "https://example.com/images/iphone-15-pro-thumb.jpg",
        images: [
          "https://example.com/images/iphone-15-pro-1.jpg",
          "https://example.com/images/iphone-15-pro-2.jpg",
        ],
        categoryId: smartphones.id,
        brandId: apple.id,
        tags: ["iphone", "apple", "ios", "smartphone"],
      },

      {
        sku: "IPHONE-15-128",
        slug: "iphone-15-128gb",
        name: "iPhone 15 128GB",
        description: "Latest iPhone 15 base model.",
        originalPrice: 999.99,
        price: 949.99,
        currency: "USD",
        discountPercent: 5,
        stock: 150,
        sold: 60,
        rating: 4.8,
        reviewCount: 300,
        thumbnail:
          "https://example.com/images/iphone-15-thumb.jpg",
        images: [
          "https://example.com/images/iphone-15-1.jpg",
          "https://example.com/images/iphone-15-2.jpg",
        ],
        categoryId: smartphones.id,
        brandId: apple.id,
        tags: ["iphone", "apple", "smartphone"],
      },

      {
        sku: "S24-ULTRA-512",
        slug: "samsung-galaxy-s24-ultra-512gb",
        name: "Samsung Galaxy S24 Ultra 512GB",
        description: "Samsung premium Android smartphone.",
        originalPrice: 1499.99,
        price: 1399.99,
        currency: "USD",
        discountPercent: 7,
        stock: 90,
        sold: 25,
        rating: 4.8,
        reviewCount: 250,
        thumbnail:
          "https://example.com/images/s24-ultra-thumb.jpg",
        images: [
          "https://example.com/images/s24-ultra-1.jpg",
          "https://example.com/images/s24-ultra-2.jpg",
        ],
        categoryId: smartphones.id,
        brandId: samsung.id,
        tags: ["samsung", "android", "smartphone"],
      },

      {
        sku: "MACBOOK-PRO-M3",
        slug: "macbook-pro-m3-14",
        name: "MacBook Pro M3 14-inch",
        description: "Apple laptop with M3 chip.",
        originalPrice: 2499.99,
        price: 2299.99,
        currency: "USD",
        discountPercent: 8,
        stock: 45,
        sold: 12,
        rating: 4.9,
        reviewCount: 180,
        thumbnail:
          "https://example.com/images/macbook-pro-m3-thumb.jpg",
        images: [
          "https://example.com/images/macbook-pro-m3-1.jpg",
          "https://example.com/images/macbook-pro-m3-2.jpg",
        ],
        categoryId: laptops.id,
        brandId: apple.id,
        tags: ["macbook", "apple", "laptop"],
      },

      {
        sku: "DELL-XPS-15",
        slug: "dell-xps-15",
        name: "Dell XPS 15",
        description: "Premium Windows ultrabook.",
        originalPrice: 1999.99,
        price: 1849.99,
        currency: "USD",
        discountPercent: 7,
        stock: 35,
        sold: 10,
        rating: 4.7,
        reviewCount: 120,
        thumbnail:
          "https://example.com/images/dell-xps-15-thumb.jpg",
        images: [
          "https://example.com/images/dell-xps-15-1.jpg",
          "https://example.com/images/dell-xps-15-2.jpg",
        ],
        categoryId: laptops.id,
        brandId: dell.id,
        tags: ["dell", "windows", "laptop"],
      },

      {
        sku: "SONY-WH1000XM5",
        slug: "sony-wh-1000xm5",
        name: "Sony WH-1000XM5",
        description: "Wireless noise cancelling headphones.",
        originalPrice: 449.99,
        price: 399.99,
        currency: "USD",
        discountPercent: 11,
        stock: 200,
        sold: 90,
        rating: 4.9,
        reviewCount: 980,
        thumbnail:
          "https://example.com/images/sony-xm5-thumb.jpg",
        images: [
          "https://example.com/images/sony-xm5-1.jpg",
          "https://example.com/images/sony-xm5-2.jpg",
        ],
        categoryId: audio.id,
        brandId: sony.id,
        tags: ["sony", "headphones", "audio"],
      },

      {
        sku: "AIRPODS-PRO-2",
        slug: "airpods-pro-2",
        name: "AirPods Pro 2",
        description: "Apple wireless earbuds.",
        originalPrice: 299.99,
        price: 249.99,
        currency: "USD",
        discountPercent: 16,
        stock: 250,
        sold: 140,
        rating: 4.8,
        reviewCount: 850,
        thumbnail:
          "https://example.com/images/airpods-pro-2-thumb.jpg",
        images: [
          "https://example.com/images/airpods-pro-2-1.jpg",
          "https://example.com/images/airpods-pro-2-2.jpg",
        ],
        categoryId: audio.id,
        brandId: apple.id,
        tags: ["apple", "airpods", "audio"],
      },
    ],
  });

  console.log("Database seeded successfully.");
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });