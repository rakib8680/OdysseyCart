"use server";

import { connectDB, toObjectId } from "@/lib/db/mongoose";
import Cart from "@/lib/models/Cart";
import Product from "@/lib/models/Product";
import { CartItem } from "@/lib/types/cart";
import {
  CartActionSchema,
  MergeCartSchema,
  UserIdSchema,
} from "@/lib/validations/cart";
import { findCartIndex } from "@/lib/utils/cart";

// ==========================================
// HELPERS
// ==========================================

/** Maps Mongoose cart items to plain key objects for findCartIndex */
function toCartKeys(items: any[]) {
  return items.map((i: any) => ({
    productId: i.productId?.toString() || i.productId,
    variantSku: i.variantSku,
  }));
}

/** Inject live stockQuantity from Products collection into cart items */
async function getPopulatedItems(cart: any): Promise<CartItem[]> {
  if (!cart || !cart.items || cart.items.length === 0) return [];

  await Cart.populate(cart, {
    path: "items.productId",
    select: "stockQuantity variants",
    model: Product,
  });

  return cart.items.map((item: any) => {
    const product =
      item.productId && typeof item.productId === "object"
        ? item.productId
        : null;
    const productId = product?._id?.toString() || item.productId.toString();

    // Resolve stock: variant-level → product-level → 0
    let stockQuantity = 0;
    if (item.variantSku && product?.variants) {
      const variant = product.variants.find(
        (v: any) => v.sku === item.variantSku,
      );
      stockQuantity = variant?.stockQuantity ?? 0;
    } else {
      stockQuantity = product?.stockQuantity ?? 0;
    }

    return {
      productId,
      variantSku: item.variantSku || undefined,
      selectedOptions: item.selectedOptions
        ? Object.fromEntries(item.selectedOptions)
        : undefined,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      stockQuantity,
    };
  });
}

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

    const items = await getPopulatedItems(cart);
    return { success: true, items };
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
  variantSku?: string,
  selectedOptions?: Record<string, string>,
) {
  try {
    const {
      userId: validUserId,
      productId: validProductId,
      variantSku: validVariantSku,
      quantity: validQuantity,
    } = CartActionSchema.parse({ userId, productId, variantSku, quantity });

    await connectDB();

    // Fetch the product to get current info
    const product = await Product.findById(validProductId).lean();
    if (!product) return { success: false, error: "Product not found" };

    // Resolve stock and price based on variant or base product
    let availableStock = product.stockQuantity;
    let resolvedPrice = product.price;
    let resolvedImage = product.images?.[0] || "";

    if (validVariantSku && product.variants) {
      const variant = product.variants.find(
        (v: any) => v.sku === validVariantSku,
      );
      if (!variant) return { success: false, error: "Variant not found" };
      availableStock = variant.stockQuantity;
      if (variant.price) resolvedPrice = variant.price;
      if (
        variant.imageIndex !== undefined &&
        product.images?.[variant.imageIndex]
      ) {
        resolvedImage = product.images[variant.imageIndex];
      }
    }

    // Check stock availability
    if (availableStock < validQuantity) {
      return { success: false, error: "Not enough stock available" };
    }

    // Find or create the user's cart
    let cart = await Cart.findOne({ userId: validUserId });

    const newItem = {
      productId: product._id,
      variantSku: validVariantSku || undefined,
      selectedOptions: selectedOptions || undefined,
      title: product.title,
      price: resolvedPrice,
      image: resolvedImage,
      quantity: validQuantity,
    };

    if (!cart) {
      // First item — create a new cart
      cart = await Cart.create({
        userId: validUserId,
        items: [newItem],
      });

      const items = await getPopulatedItems(cart);
      return { success: true, items };
    }

    // Check if the product+variant already exists in the cart
    const existingIndex = findCartIndex(toCartKeys(cart.items), {
      productId: validProductId,
      variantSku: validVariantSku,
    });

    if (existingIndex > -1) {
      // Check if combined quantity exceeds stock
      if (cart.items[existingIndex].quantity + validQuantity > availableStock) {
        return {
          success: false,
          error: "Cannot add more than available stock",
        };
      }
      // Product+variant exists — increase quantity
      cart.items[existingIndex].quantity += validQuantity;
    } else {
      // New product or new variant — push to items array
      cart.items.push(newItem);
    }

    await cart.save();

    const items = await getPopulatedItems(cart);
    return { success: true, items };
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
  variantSku?: string,
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

    const itemIndex = findCartIndex(toCartKeys(cart.items), {
      productId: validProductId,
      variantSku,
    });

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

    const items = await getPopulatedItems(cart);
    return { success: true, items };
  } catch (error: any) {
    console.error("Error updating cart item:", error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// REMOVE FROM CART
// ==========================================
export async function removeFromCart(
  userId: string,
  productId: string,
  variantSku?: string,
) {
  try {
    const { userId: validUserId, productId: validProductId } =
      CartActionSchema.parse({ userId, productId, quantity: 1 });

    await connectDB();

    const cart = await Cart.findOne({ userId: validUserId });
    if (!cart) return { success: false, error: "Cart not found" };

    const itemIndex = findCartIndex(toCartKeys(cart.items), {
      productId: validProductId,
      variantSku,
    });
    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();

    const items = await getPopulatedItems(cart);
    return { success: true, items };
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
        variantSku: item.variantSku || undefined,
        selectedOptions: item.selectedOptions || undefined,
        title: item.title,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      }));
      cart = await Cart.create({ userId: validUserId, items: mappedItems });
      const items = await getPopulatedItems(cart);
      return { success: true, items };
    }

    // Merge strategy: local items take priority for quantity
    for (const localItem of validLocalItems) {
      const existingIndex = findCartIndex(
        cart.items.map((i: any) => ({
          productId: i.productId.toString(),
          variantSku: i.variantSku,
        })),
        { productId: localItem.productId, variantSku: localItem.variantSku },
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
          variantSku: localItem.variantSku || undefined,
          selectedOptions: localItem.selectedOptions || undefined,
          title: localItem.title,
          price: localItem.price,
          image: localItem.image,
          quantity: localItem.quantity,
        });
      }
    }

    await cart.save();

    const items = await getPopulatedItems(cart);
    return { success: true, items };
  } catch (error: any) {
    console.error("Error merging cart:", error);
    return { success: false, error: error.message };
  }
}
