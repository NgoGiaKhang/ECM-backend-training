import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string(),
  sku: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  originalPrice: z.number().nonnegative(),
  price: z.number().nonnegative(),
  discountPercent: z.number().min(0).max(100).optional(),
  currency: z.string().default("VND"),
  isAvailable: z.boolean().default(true),
  categoryId: z.string().optional(),
  categoryName: z.string().optional(),
  brandId: z.string(),
  brandName: z.string(),
  thumbnail: z.url(),
  tags: z.array(z.string()).optional(),
});
