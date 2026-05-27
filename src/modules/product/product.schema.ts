import { z } from "zod";


export const ProductSchema = z.object({
  sku: z
    .string({ message: "SKU must be a string" })
    .trim()
    .min(1, "SKU cannot be empty")
    .max(50, "SKU must be at most 50 characters"),

  name: z
    .string({ message: "Name must be a string" })
    .trim()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),

  slug: z
    .string({ message: "Slug must be a string" })
    .trim()
    .min(1, "Slug cannot be empty")
    .max(255, "Slug must be less than 255 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase and hyphen-separated",
    ),

  description: z
    .string({ message: "Description must be a string" })
    .trim()
    .max(2000, "Description must be less than 2000 characters")
    .optional(),

  originalPrice: z
    .number({ message: "Original price must be a number" })
    .nonnegative("Original price must be greater than or equal to 0"),

  price: z
    .number({ message: "Price must be a number" })
    .nonnegative("Price must be greater than or equal to 0"),

  discountPercent: z
    .number({ message: "Discount percent must be a number" })
    .min(0, "Discount percent must be at least 0")
    .max(100, "Discount percent cannot exceed 100")
    .optional(),
  currency: z
    .string({ message: "Currency must be a string" })
    .trim()
    .length(3, "Currency must be a 3-letter ISO code")
    .max(3, "Currency must be 3 characters")
    .default("VND"),
  isAvailable: z
    .boolean({ message: "isAvailable must be a boolean" })
    .default(true),
  categoryName: z
    .string({ message: "Category name must be a string" })
    .trim()
    .min(1, "Category name cannot be empty")
    .max(255, "Category name must be less than 255 characters")
    .optional(),
  brandName: z
    .string({ message: "Brand name must be a string" })
    .trim()
    .min(1, "Brand name is required")
    .max(255, "Brand name must be less than 255 characters"),
  thumbnail: z
    .string({ message: "Thumbnail must be a string" })
    .trim()
    .min(1, "Thumbnail is required")
    .max(2048, "Thumbnail URL is too long"),
  tags: z
    .array(
      z
        .string({ message: "Tag must be a string" })
        .trim()
        .min(1, "Tag cannot be empty")
        .max(50, "Tag must be at most 50 characters"),
      { message: "Tags must be an array" },
    )
    .max(20, "Maximum 20 tags allowed")
    .default([]),
});

export type ProductRequest = z.infer<typeof ProductSchema>;
