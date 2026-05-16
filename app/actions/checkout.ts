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

    // Fetch live product data for every item in the cart
    const productIds = cart.items.map((item: any) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } })
      .select("_id title price images stockQuantity")
      .lean();

    // Build a lookup map for O(1) access
    const productMap = new Map(products.map((p: any) => [p._id.toString(), p]));

    // Merge cart quantities with live product data
    const items: CartItem[] = cart.items
      .map((item: any) => {
        const product = productMap.get(item.productId.toString());

        // Product was deleted — skip it
        if (!product) return null;

        return {
          productId: product._id.toString(),
          title: product.title,
          price: product.price, // LIVE price from DB, not stale snapshot
          image: product.images?.[0] || item.image || "",
          quantity: Math.min(item.quantity, product.stockQuantity), // Clamp to available stock
          stockQuantity: product.stockQuantity,
        };
      })
      .filter(Boolean) as CartItem[];

    return { success: true, items };
  } catch (error: any) {
    console.error("Error fetching checkout cart:", error);
    return { success: false, items: [], error: error.message };
  }
}
