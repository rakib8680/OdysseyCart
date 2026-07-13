// Shared wishlist types used across all components.
// These are the shapes AFTER serialization from Mongoose.

import { Product } from "./product";

// Full populated wishlist item — used on the /account/wishlist page
export type WishlistItem = Pick<
  Product,
  "_id" | "title" | "slug" | "price" | "images" | "discount" | "stockQuantity"
>;
