"use server";

import { connectDB, toObjectId } from "@/lib/db/mongoose";
import Wishlist from "@/lib/models/Wishlist";
import Product from "@/lib/models/Product";
import { WishlistActionSchema } from "@/lib/validations/wishlist";
import { UserIdSchema } from "@/lib/validations/cart";
import type { WishlistItem } from "@/lib/types/wishlist";

// Projection for populated wishlist items — only the fields WishlistItem needs
const WISHLIST_PRODUCT_PROJECTION = "title slug price images discount stockQuantity";

// ==========================================
// GET WISHLIST IDS (for Server Components)
// ==========================================

/**
 * Returns just the product ID strings for a user's wishlist.
 * Used by Server Components to pass `wishlistIds` down to ProductCard/HeartButton.
 * Returns [] for guests (null userId).
 */
export async function getWishlistIds(
  userId: string | null,
): Promise<string[]> {
  if (!userId) return [];

  try {
    await connectDB();

    const wishlist = await Wishlist.findOne(
      { userId },
      { products: 1 },
    ).lean();

    if (!wishlist) return [];

    return wishlist.products.map((id) => id.toString());
  } catch (error: any) {
    console.error("getWishlistIds error:", error);
    return [];
  }
}

// ==========================================
// GET WISHLIST (full populated items)
// ==========================================

/**
 * Returns fully populated wishlist items for the /account/wishlist page.
 * Filters out products that have been deleted by admin.
 */
export async function getWishlist(userId: string): Promise<{
  success: boolean;
  items: WishlistItem[];
  error?: string;
}> {
  try {
    const validUserId = UserIdSchema.parse(userId);

    await connectDB();

    const wishlist = await Wishlist.findOne({ userId: validUserId })
      .populate({
        path: "products",
        select: WISHLIST_PRODUCT_PROJECTION,
        model: Product,
      })
      .lean();

    if (!wishlist) return { success: true, items: [] };

    // Filter out null entries (deleted products) and serialize
    const items: WishlistItem[] = wishlist.products
      .filter((product): product is any => product !== null)
      .map((product: any) => ({
        _id: product._id.toString(),
        title: product.title,
        slug: product.slug,
        price: product.price,
        images: product.images,
        discount: product.discount,
        stockQuantity: product.stockQuantity,
      }));

    return { success: true, items };
  } catch (error: any) {
    console.error("getWishlist error:", error);
    return { success: false, items: [], error: error.message };
  }
}

// ==========================================
// TOGGLE WISHLIST ITEM
// ==========================================

/**
 * Add if absent, remove if present.
 * Uses upsert to auto-create the wishlist on first toggle.
 * Returns the new wishlisted state for optimistic UI revert.
 */
export async function toggleWishlistItem(
  userId: string,
  productId: string,
): Promise<{ success: boolean; wishlisted: boolean; error?: string }> {
  try {
    const { userId: validUserId, productId: validProductId } =
      WishlistActionSchema.parse({ userId, productId });

    await connectDB();

    const objectId = toObjectId(validProductId);

    // Check if the product is already in the wishlist
    const existing = await Wishlist.findOne({
      userId: validUserId,
      products: objectId,
    });

    if (existing) {
      // Remove it
      await Wishlist.updateOne(
        { userId: validUserId },
        { $pull: { products: objectId } },
      );
      return { success: true, wishlisted: false };
    }

    // Add it — upsert creates the wishlist doc if it doesn't exist
    await Wishlist.updateOne(
      { userId: validUserId },
      { $addToSet: { products: objectId } },
      { upsert: true },
    );
    return { success: true, wishlisted: true };
  } catch (error: any) {
    console.error("toggleWishlistItem error:", error);
    return { success: false, wishlisted: false, error: error.message };
  }
}

// ==========================================
// REMOVE FROM WISHLIST
// ==========================================

/**
 * Explicit remove — used by the wishlist page's remove button.
 */
export async function removeFromWishlist(
  userId: string,
  productId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId: validUserId, productId: validProductId } =
      WishlistActionSchema.parse({ userId, productId });

    await connectDB();

    await Wishlist.updateOne(
      { userId: validUserId },
      { $pull: { products: toObjectId(validProductId) } },
    );

    return { success: true };
  } catch (error: any) {
    console.error("removeFromWishlist error:", error);
    return { success: false, error: error.message };
  }
}
