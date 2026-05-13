import { z } from "zod";

export const UserIdSchema = z.string().min(1, "User ID is required");

export const CartActionSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.coerce.number().int().default(1),
});

export const MergeCartSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  localItems: z.array(
    z.object({
      productId: z.string().min(1, "Product ID is required"),
      title: z.string(),
      price: z.number(),
      image: z.string().default(""),
      quantity: z.number().int().min(1),
    }),
  ),
});

// Infer TypeScript types directly from Zod
export type CartActionInput = z.infer<typeof CartActionSchema>;
export type MergeCartInput = z.infer<typeof MergeCartSchema>;
