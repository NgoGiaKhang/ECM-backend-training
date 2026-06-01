import { z } from "zod";

/**
 * 🔐 LoginRequestSchema
 * Low-overhead schema designed to perform rapid surface-level validation
 * before credentials pass into the cryptographic hashing operations.
 */
export const LoginRequestSchema = z.object({
  email: z
    .email({ message: "Invalid email address format" })
    .trim()
    .toLowerCase(), // Automatically normalizes casing to guarantee consistent database lookups

  password: z
    .string("Password is required")
    .min(1, { message: "Password cannot be empty" }),
});

/**
 * RegisterRequestSchema
 * Strict validation enforcing data integrity, secure password constraints,
 * and proper identity profile strings before persisting records.
 */
export const RegisterRequestSchema = z.object({
  email: z
    .email({ message: "Invalid email address format" })
    .trim()
    .toLowerCase(),

  password: z
    .string("Password is required")
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password is too long (max 100 characters)" })
    // Cryptographic complexity rules matching production-grade security standards
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),

  fullname: z
    .string("Full name is required")
    .trim()
    .min(2, { message: "Full name must be at least 2 characters long" })
    .max(50, { message: "Full name cannot exceed 50 characters" })
    // Blocks injection attacks, arbitrary numbers, or invalid punctuation in names
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, {
      message: "Full name must only contain letters and spaces",
    }),
});

/**
 * Static Type Inferences
 * Extracted directly from Zod runtimes to serve as strictly typed
 * Data Transfer Objects (DTOs) within your controllers and request handlers.
 */
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
