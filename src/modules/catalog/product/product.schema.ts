import { z } from "zod";

/**
 * Product validation schema.
 */
export const ProductRequestSchema = z.strictObject({
  /**
   * Business identifiers
   */
  sku: z
    .string({
      message: "SKU is required",
    })
    .trim()
    .min(1, {
      message: "SKU is required",
    })
    .max(100, {
      message: "SKU must not exceed 100 characters",
    }),

  slug: z
    .string({
      message: "Slug is required",
    })
    .trim()
    .min(1, {
      message: "Slug is required",
    })
    .max(200, {
      message: "Slug must not exceed 200 characters",
    }),

  /**
   * Basic information
   */
  name: z
    .string({
      message: "Product name is required",
    })
    .trim()
    .min(1, {
      message: "Product name is required",
    })
    .max(255, {
      message: "Product name must not exceed 255 characters",
    }),

  description: z
    .string()
    .trim()
    .max(5000, {
      message: "Description must not exceed 5000 characters",
    })
    .optional(),

  /**
   * Pricing
   */
  originalPrice: z.coerce
    .number({
      message: "Original price must be a number",
    })
    .positive({
      message: "Original price must be greater than 0",
    })
    .optional(),

  price: z.coerce
    .number({
      message: "Price must be a number",
    })
    .positive({
      message: "Price must be greater than 0",
    }),

  currency: z.literal("USD").default("USD"),

  /**
   * Discount
   */
  discountPercent: z.coerce
    .number({
      message: "Discount percent must be a number",
    })
    .int({
      message: "Discount percent must be an integer",
    })
    .min(0, {
      message: "Discount percent cannot be negative",
    })
    .max(100, {
      message: "Discount percent cannot exceed 100",
    })
    .optional(),


  /**
   * Availability
   */
  isAvailable: z
    .boolean({
      message: "Availability must be a boolean",
    })
    .default(true),

  /**
   * Rating summary
   */

  /**
   * Media
   */
  thumbnail: z.url({
    message: "Thumbnail must be a valid URL",
  }),

  images: z
    .array(
      z.url({
        message: "Each image must be a valid URL",
      }),
      {
        message: "Images must be an array of URLs",
      },
    )
    .default([]),

  /**
   * Relations
   */
  categoryId: z
    .ulid({
      message: "Category ID must be a valid ULID",
    })
    .optional(),

  brandId: z.ulid({
    message: "Brand ID must be a valid ULID",
  }),
  /**
   * Tags
   */
  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, {
          message: "Tag must not be empty",
        })
        .max(50, {
          message: "Tag must not exceed 50 characters",
        }),
    )
    .default([]),
});

/**
 * Product update validation schema.
 */
export type ProductRequest = z.infer<typeof ProductRequestSchema>;

export const ProductFilterSchema = z.object({
  query: z
    .string()
    .trim()
    .max(100, {
      message: "Query must not exceed 100 characters",
    })
    .regex(/^[\p{L}\p{N}\s\-_"']*$/u, {
      message: "Query contains invalid characters",
    })
    .optional(),

  categoryId: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.ulid().optional(),
  ),

  minPrice: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0).optional(),
  ),

  maxPrice: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0).optional(),
  ),
});

export type ProductFilterRequest = z.infer<typeof ProductFilterSchema>;
