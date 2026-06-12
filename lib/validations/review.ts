import { z } from "zod";

/**
 * Server-side validation schema for review submission.
 * Shared between the ReviewForm (client) and submitReview (server action).
 */
export const ReviewValidationSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  userId: z.string().min(1, "User ID is required"),
  userName: z.string().min(1, "Name is required").max(50),
  rating: z
    .number()
    .int()
    .min(1, "Please select a rating")
    .max(5, "Rating must be between 1 and 5"),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be under 100 characters"),
  body: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(1000, "Review must be under 1000 characters"),
});

export type ReviewInput = z.infer<typeof ReviewValidationSchema>;
