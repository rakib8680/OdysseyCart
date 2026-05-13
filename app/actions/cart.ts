"use server";

import { connectDB, serialize, toObjectId } from "@/lib/db/mongoose";
import Cart from "@/lib/models/Cart";
import Product from "@/lib/models/Product";
import { CartItem } from "@/lib/types/cart";
import {
  CartActionSchema,
  MergeCartSchema,
  UserIdSchema,
} from "@/lib/validations/cart";

// ==========================================
// GET CART
// ==========================================
export async function getCart(userId: string) {
  try {
    const validUserId = UserIdSchema.parse(userId);

    await connectDB();

    const cart = await Cart.findOne({ userId: validUserId }).lean();

    // Return empty items array if no cart exists yet
    if (!cart) return { success: true, items: [] as CartItem[] };

    return { success: true, items: serialize(cart.items) as CartItem[] };
  } catch (error: any) {
    console.error("Error getting cart:", error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// ADD TO CART
// ==========================================
export async function addToCart(
  userId: string,
  productId: string,
  quantity: number = 1,
) {
  try {
    const {
      userId: validUserId,
      productId: validProductId,
      quantity: validQuantity,
    } = CartActionSchema.parse({ userId, productId, quantity });

    await connectDB();

    // Fetch the product to get current info
    const product = await Product.findById(validProductId).lean();
    if (!product) return { success: false, error: "Product not found" };

    // Check stock availability
    if (product.stockQuantity < validQuantity) {
      return { success: false, error: "Not enough stock available" };
    }

    // Find or create the user's cart
    let cart = await Cart.findOne({ userId: validUserId });

    if (!cart) {
      // First item — create a new cart
      cart = await Cart.create({
        userId: validUserId,
        items: [
          {
            productId: product._id,
            title: product.title,
            price: product.price,
            image: product.images?.[0] || "",
            quantity: validQuantity,
          },
        ],
      });

      return { success: true, items: serialize(cart.items) as CartItem[] };
    }

    // Check if the product already exists in the cart
    const existingIndex = cart.items.findIndex(
      (item) => item.productId.toString() === validProductId,
    );

    if (existingIndex > -1) {
      // Product exists — increase quantity
      cart.items[existingIndex].quantity += validQuantity;
    } else {
      // New product — push to items array
      cart.items.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        image: product.images?.[0] || "",
        quantity: validQuantity,
      });
    }

    await cart.save();

    return { success: true, items: serialize(cart.items) as CartItem[] };
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// UPDATE ITEM QUANTITY
// ==========================================
export async function updateCartItemQuantity(
  userId: string,
  productId: string,
  quantity: number,
) {
  try {
    const {
      userId: validUserId,
      productId: validProductId,
      quantity: validQuantity,
    } = CartActionSchema.parse({ userId, productId, quantity });

    await connectDB();

    const cart = await Cart.findOne({ userId: validUserId });
    if (!cart) return { success: false, error: "Cart not found" };

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === validProductId,
    );

    if (itemIndex === -1) {
      return { success: false, error: "Item not found in cart" };
    }

    if (validQuantity <= 0) {
      // Quantity is zero or negative — remove item entirely
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = validQuantity;
    }

    await cart.save();

    return { success: true, items: serialize(cart.items) as CartItem[] };
  } catch (error: any) {
    console.error("Error updating cart item:", error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// REMOVE FROM CART
// ==========================================
export async function removeFromCart(userId: string, productId: string) {
  try {
    const { userId: validUserId, productId: validProductId } =
      CartActionSchema.parse({ userId, productId, quantity: 1 });

    await connectDB();

    const cart = await Cart.findOne({ userId: validUserId });
    if (!cart) return { success: false, error: "Cart not found" };

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== validProductId,
    );

    await cart.save();

    return { success: true, items: serialize(cart.items) as CartItem[] };
  } catch (error: any) {
    console.error("Error removing from cart:", error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// CLEAR CART
// ==========================================
export async function clearCart(userId: string) {
  try {
    const validUserId = UserIdSchema.parse(userId);

    await connectDB();

    await Cart.findOneAndUpdate({ userId: validUserId }, { items: [] });

    return { success: true, items: [] as CartItem[] };
  } catch (error: any) {
    console.error("Error clearing cart:", error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// MERGE LOCAL CART INTO DB (Login Merge)
// ==========================================
export async function mergeCart(userId: string, localItems: CartItem[]) {
  try {
    const { userId: validUserId, localItems: validLocalItems } =
      MergeCartSchema.parse({ userId, localItems });

    if (!validLocalItems || validLocalItems.length === 0) {
      return getCart(validUserId);
    }

    await connectDB();

    let cart = await Cart.findOne({ userId: validUserId });

    if (!cart) {
      // No DB cart exists — create one from the local items
      const mappedItems = validLocalItems.map((item) => ({
        productId: toObjectId(item.productId),
        title: item.title,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      }));
      cart = await Cart.create({ userId: validUserId, items: mappedItems });
      return { success: true, items: serialize(cart.items) as CartItem[] };
    }

    // Merge strategy: local items take priority for quantity
    for (const localItem of validLocalItems) {
      const existingIndex = cart.items.findIndex(
        (dbItem) => dbItem.productId.toString() === localItem.productId,
      );

      if (existingIndex > -1) {
        // Item exists in both — keep the HIGHER quantity
        cart.items[existingIndex].quantity = Math.max(
          cart.items[existingIndex].quantity,
          localItem.quantity,
        );
      } else {
        // Item only in local storage — add it to the DB cart
        cart.items.push({
          productId: toObjectId(localItem.productId),
          title: localItem.title,
          price: localItem.price,
          image: localItem.image,
          quantity: localItem.quantity,
        });
      }
    }

    await cart.save();

    return { success: true, items: serialize(cart.items) as CartItem[] };
  } catch (error: any) {
    console.error("Error merging cart:", error);
    return { success: false, error: error.message };
  }
}
