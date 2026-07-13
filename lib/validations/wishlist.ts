import { z } from "zod";

/**
 * Reusable validation schema for wishlist actions.
 * Covers toggle, remove, and moveToCart — all need userId + productId.
 */
export const WishlistActionSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  productId: z.string().min(1, "Product ID is required"),
});

export type WishlistActionInput = z.infer<typeof WishlistActionSchema>;
