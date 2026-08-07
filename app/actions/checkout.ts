"use server";

import { connectDB } from "@/lib/db/mongoose";
import Cart from "@/lib/models/Cart";
import Product from "@/lib/models/Product";
import { CartItem } from "@/lib/types/cart";

// ==========================================
// GET CHECKOUT CART (Server-verified prices)
// ==========================================
/**
 * Fetches the user's cart with LIVE prices from the Products collection.
 * Unlike the regular getCart (which snapshots prices at add-time),
 * this re-reads prices to ensure the checkout total is accurate.
 * Supports variant-level price/stock resolution.
 */
export async function getCheckoutCart(
  userId: string,
): Promise<{ success: boolean; items: CartItem[]; error?: string }> {
  try {
    await connectDB();

    const cart = await Cart.findOne({ userId }).lean();

    if (!cart || !cart.items || cart.items.length === 0) {
      return { success: true, items: [] };
    }

    // Fetch live product data for every item in the cart (include variants)
    const productIds = cart.items.map((item: any) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } })
      .select("_id title price images stockQuantity variants")
      .lean();

    // Build a lookup map for O(1) access
    const productMap = new Map(products.map((p: any) => [p._id.toString(), p]));

    // Merge cart quantities with live product data
    const items: CartItem[] = cart.items
      .map((item: any) => {
        const product = productMap.get(item.productId.toString());

        // Product was deleted — skip it
        if (!product) return null;

        // Resolve variant-level overrides when applicable
        let livePrice = product.price;
        let liveStock = product.stockQuantity;
        let liveImage = product.images?.[0] || item.image || "";

        if (item.variantSku && product.variants) {
          const variant = product.variants.find(
            (v: any) => v.sku === item.variantSku,
          );
          if (variant) {
            if (variant.price) livePrice = variant.price;
            liveStock = variant.stockQuantity;
            if (
              variant.imageIndex !== undefined &&
              product.images?.[variant.imageIndex]
            ) {
              liveImage = product.images[variant.imageIndex];
            }
          }
        }

        return {
          productId: product._id.toString(),
          variantSku: item.variantSku || undefined,
          selectedOptions: item.selectedOptions
            ? Object.fromEntries(item.selectedOptions)
            : undefined,
          title: product.title,
          price: livePrice,
          image: liveImage,
          quantity: Math.min(item.quantity, liveStock),
          stockQuantity: liveStock,
        };
      })
      .filter(Boolean) as CartItem[];

    return { success: true, items };
  } catch (error: any) {
    console.error("Error fetching checkout cart:", error);
    return { success: false, items: [], error: error.message };
  }
}
