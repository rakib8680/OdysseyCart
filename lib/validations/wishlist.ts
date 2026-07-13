import { z } from "zod";
import { CartActionSchema } from "./cart";

/**
 * Reusable validation schema for wishlist actions.
 * Covers toggle, remove — all need userId + productId.
 * Reuses the shared rules from CartActionSchema to stay DRY.
 */
export const WishlistActionSchema = CartActionSchema.pick({
  userId: true,
  productId: true,
});

export type WishlistActionInput = z.infer<typeof WishlistActionSchema>;
