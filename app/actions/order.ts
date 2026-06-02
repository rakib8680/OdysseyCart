"use server";

import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import { requireAdmin } from "@/app/actions/users";
import type { SerializedOrder } from "@/lib/types/order";

// ==========================================
// SERIALIZATION HELPER
// ==========================================

/**
 * Converts a Mongoose lean Order document into a plain JS object
 * safe for passing from Server Actions to Client Components.
 * Maps ObjectIds to strings and Dates to ISO strings.
 */
function serializeOrder(doc: any): SerializedOrder {
  return {
    _id: doc._id.toString(),
    userId: doc.userId,
    stripePaymentId: doc.stripePaymentId || undefined,
    items: (doc.items || []).map((item: any) => ({
      productId: item.productId.toString(),
      title: item.title,
      price: item.price,
      image: item.image || "",
      quantity: item.quantity,
    })),
    shippingInfo: {
      email: doc.shippingInfo.email,
      fullName: doc.shippingInfo.fullName,
      address: doc.shippingInfo.address,
      city: doc.shippingInfo.city,
      state: doc.shippingInfo.state,
      zipCode: doc.shippingInfo.zipCode,
      country: doc.shippingInfo.country,
      phone: doc.shippingInfo.phone,
    },
    subtotal: doc.subtotal,
    tax: doc.tax,
    shippingCost: doc.shippingCost,
    discount: doc.discount || 0,
    couponCode: doc.couponCode || undefined,
    total: doc.total,
    status: doc.status,
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString(),
  };
}

// ==========================================
// GET USER ORDERS (Account Dashboard)
// ==========================================

/**
 * Fetches all non-pending orders for a specific user.
 * Pending orders are abandoned checkout sessions — we exclude them.
 */
export async function getUserOrders(userId: string): Promise<{
  success: boolean;
  orders: SerializedOrder[];
  error?: string;
}> {
  try {
    await connectDB();

    if (!userId) throw new Error("User ID is required.");

    const orders = await Order.find({
      userId,
      status: { $ne: "pending" },
    })
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      orders: orders.map(serializeOrder),
    };
  } catch (error: any) {
    console.error("Error fetching user orders:", error);
    return { success: false, orders: [], error: error.message };
  }
}

// ==========================================
// GET SINGLE ORDER DETAILS (with ownership check)
// ==========================================

/**
 * Fetches a single order by ID and verifies it belongs to the requesting user.
 * Used for the order details drawer/sheet.
 */
export async function getOrderDetails(
  orderId: string,
  userId: string,
): Promise<{
  success: boolean;
  order: SerializedOrder | null;
  error?: string;
}> {
  try {
    await connectDB();

    if (!orderId || !userId)
      throw new Error("Order ID and User ID are required.");

    const order = await Order.findById(orderId).lean();

    if (!order) {
      return { success: false, order: null, error: "Order not found." };
    }

    // Ownership check — only the order owner can view their order
    if ((order as any).userId !== userId) {
      return { success: false, order: null, error: "Unauthorized." };
    }

    return {
      success: true,
      order: serializeOrder(order),
    };
  } catch (error: any) {
    console.error("Error fetching order details:", error);
    return { success: false, order: null, error: error.message };
  }
}

// ==========================================
// GET ALL ORDERS (Admin Dashboard — for Phase 2)
// ==========================================

/**
 * Fetches all non-pending orders in the system for admin management.
 * Sorted newest-first.
 */
export async function getAllOrders(adminUid: string): Promise<{
  success: boolean;
  orders: SerializedOrder[];
  error?: string;
}> {
  try {
    await connectDB();
    await requireAdmin(adminUid);

    const orders = await Order.find({
      status: { $ne: "pending" },
    })
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      orders: orders.map(serializeOrder),
    };
  } catch (error: any) {
    console.error("Error fetching all orders:", error);
    return { success: false, orders: [], error: error.message };
  }
}

// ==========================================
// UPDATE ORDER STATUS (Admin Dashboard — for Phase 2)
// ==========================================

/**
 * Updates the status of an order. Admin-only action.
 * Valid transitions: paid → shipped → delivered.
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: "shipped" | "delivered",
  adminUid: string,
): Promise<{
  success: boolean;
  order: SerializedOrder | null;
  error?: string;
}> {
  try {
    await connectDB();
    await requireAdmin(adminUid);

    if (!orderId || !newStatus) {
      throw new Error("Order ID and new status are required.");
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return { success: false, order: null, error: "Order not found." };
    }

    // Prevent invalid transitions
    const validTransitions: Record<string, string[]> = {
      paid: ["shipped"],
      shipped: ["delivered"],
    };

    const allowedNext = validTransitions[order.status] || [];
    if (!allowedNext.includes(newStatus)) {
      return {
        success: false,
        order: null,
        error: `Cannot change status from "${order.status}" to "${newStatus}".`,
      };
    }

    order.status = newStatus;
    await order.save();

    // Re-fetch as lean for serialization
    const updated = await Order.findById(orderId).lean();

    return {
      success: true,
      order: serializeOrder(updated),
    };
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return { success: false, order: null, error: error.message };
  }
}
