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

  const tablets = await prisma.category.create({
    data: {
      name: "Tablets",
      slug: "tablets",
      description: "Tablet devices",
      parentId: electronics.id,
    },
  });

  const wearables = await prisma.category.create({
    data: {
      name: "Wearables",
      slug: "wearables",
      description: "Smart watches and wearable devices",
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
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    },
  });

  const samsung = await prisma.brand.create({
    data: {
      name: "Samsung",
      slug: "samsung",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    },
  });

  const dell = await prisma.brand.create({
    data: {
      name: "Dell",
      slug: "dell",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg",
    },
  });

  const sony = await prisma.brand.create({
    data: {
      name: "Sony",
      slug: "sony",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Sony_logo.svg",
    },
  });

  const microsoft = await prisma.brand.create({
    data: {
      name: "Microsoft",
      slug: "microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    },
  });

  const jbl = await prisma.brand.create({
    data: {
      name: "JBL",
      slug: "jbl",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/1c/JBL_logo.svg",
    },
  });

  const google = await prisma.brand.create({
    data: {
      name: "Google",
      slug: "google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    },
  });

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
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1000&q=80",
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
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1565630916779-e303be97b6f5?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1573148195900-7845dcb9b127?auto=format&fit=crop&w=1000&q=80",
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
          "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80",
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
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1000&q=80",
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
          "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80",
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
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80",
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
          "https://images.unsplash.com/photo-1588449668365-d15e397f6787?auto=format&fit=crop&w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1504274066654-52ff3a30476c?auto=format&fit=crop&w=1000&q=80",
        ],
        categoryId: audio.id,
        brandId: apple.id,
        tags: ["apple", "airpods", "audio"],
      },
      {
        sku: "IPAD-PRO-M2-11",
        slug: "ipad-pro-m2-11",
        name: "iPad Pro M2 11-inch",
        description: "Apple iPad Pro with M2 chip.",
        originalPrice: 1099,
        price: 999,
        currency: "USD",
        discountPercent: 9,
        stock: 80,
        sold: 40,
        rating: 4.9,
        reviewCount: 510,
        thumbnail:
          "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?auto=format&fit=crop&w=1000&q=80",
        ],
        categoryId: tablets.id,
        brandId: apple.id,
        tags: ["ipad", "apple", "tablet"],
      },
      {
        sku: "APPLE-WATCH-S9",
        slug: "apple-watch-series-9",
        name: "Apple Watch Series 9",
        description: "Smartwatch with health tracking.",
        originalPrice: 499,
        price: 449,
        currency: "USD",
        discountPercent: 10,
        stock: 200,
        sold: 120,
        rating: 4.8,
        reviewCount: 700,
        thumbnail:
          "https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=1000&q=80",
        ],
        categoryId: wearables.id,
        brandId: apple.id,
        tags: ["apple", "watch", "smartwatch"],
      },
      {
        sku: "GALAXY-WATCH-6",
        slug: "samsung-galaxy-watch-6",
        name: "Samsung Galaxy Watch 6",
        description: "Android smartwatch with fitness tracking.",
        originalPrice: 399,
        price: 349,
        currency: "USD",
        discountPercent: 12,
        stock: 180,
        sold: 95,
        rating: 4.7,
        reviewCount: 420,
        thumbnail:
          "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80",
        ],
        categoryId: wearables.id,
        brandId: samsung.id,
        tags: ["samsung", "watch", "android"],
      },
      {
        sku: "SURFACE-LAPTOP-5",
        slug: "microsoft-surface-laptop-5",
        name: "Microsoft Surface Laptop 5",
        description: "Premium Windows laptop from Microsoft.",
        originalPrice: 1799,
        price: 1599,
        currency: "USD",
        discountPercent: 11,
        stock: 60,
        sold: 22,
        rating: 4.6,
        reviewCount: 210,
        thumbnail:
          "https://bizweb.dktcdn.net/thumb/1024x1024/100/408/235/products/2-01c0bb7c-9edd-474d-a38a-15a2cc4bdb1a.png?v=1728640159880",
        images: [
          "https://bizweb.dktcdn.net/thumb/1024x1024/100/408/235/products/2-01c0bb7c-9edd-474d-a38a-15a2cc4bdb1a.png?v=1728640159880",
          "https://bizweb.dktcdn.net/thumb/1024x1024/100/408/235/products/2-01c0bb7c-9edd-474d-a38a-15a2cc4bdb1a.png?v=1728640159880",
        ],
        categoryId: laptops.id,
        brandId: microsoft.id,
        tags: ["microsoft", "surface", "laptop"],
      },
      {
        sku: "JBL-FLIP-6",
        slug: "jbl-flip-6",
        name: "JBL Flip 6",
        description: "Portable Bluetooth speaker.",
        originalPrice: 149,
        price: 129,
        currency: "USD",
        discountPercent: 13,
        stock: 300,
        sold: 200,
        rating: 4.8,
        reviewCount: 1500,
        thumbnail:
          "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80",
        ],
        categoryId: audio.id,
        brandId: jbl.id,
        tags: ["jbl", "speaker", "audio"],
      },
      {
        sku: "GOOGLE-Pixel-8-Pro",
        slug: "google-pixel-8-pro",
        name: "Google Pixel 8 Pro",
        description: "Google flagship Android smartphone.",
        originalPrice: 1099,
        price: 999,
        currency: "USD",
        discountPercent: 9,
        stock: 110,
        sold: 70,
        rating: 4.7,
        reviewCount: 380,
        thumbnail:
          "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80",
        ],
        categoryId: smartphones.id,
        brandId: google.id,
        tags: ["google", "pixel", "android"],
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
