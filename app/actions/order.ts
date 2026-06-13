"use server";

import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import { requireAdmin } from "@/app/actions/users";
import type { SerializedOrder } from "@/lib/types/order";
import { escapeRegex } from "@/lib/utils";

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
// GET FILTERED ORDERS (Admin Dashboard — paginated + searchable)
// ==========================================

const ADMIN_ORDERS_PER_PAGE = 10;

/**
 * Fetches paginated, searchable orders for admin management.
 * Search filters across order ID, customer name, and email.
 * Optional status filter for fulfillment pipeline views.
 * Admin-only action.
 */
export async function getFilteredOrders(
  adminUid: string,
  page: number = 1,
  search: string = "",
  status: string = "",
): Promise<{
  success: boolean;
  orders: SerializedOrder[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  error?: string;
}> {
  const empty = {
    success: false,
    orders: [],
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
  };

  try {
    await connectDB();
    await requireAdmin(adminUid);

    const skip = (page - 1) * ADMIN_ORDERS_PER_PAGE;

    // Build filter — always exclude pending (abandoned checkouts)
    const filter: Record<string, any> = { status: { $ne: "pending" } };

    // Status filter (overrides the $ne if a specific status is selected)
    if (status) {
      filter.status = status;
    }

    // Search filter — across order ID, customer name, and email
    if (search.trim()) {
      const escaped = escapeRegex(search);
      filter.$or = [
        { "shippingInfo.fullName": { $regex: escaped, $options: "i" } },
        { "shippingInfo.email": { $regex: escaped, $options: "i" } },
      ];

      // Handle Order ID search (e.g., "#OD-1CE88C" or "1CE88C")
      // Remove the #OD- prefix if the user typed it
      const idSearch = search.replace(/^#OD-/i, "").trim();
      const escapedId = escapeRegex(idSearch);

      filter.$or = [
        { "shippingInfo.fullName": { $regex: escaped, $options: "i" } },
        { "shippingInfo.email": { $regex: escaped, $options: "i" } },
        // MongoDB requires $expr to run regex against an ObjectId field
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$_id" },
              regex: escapedId,
              options: "i",
            },
          },
        },
      ];
    }

    // Execute query + count in parallel
    const [orders, totalCount] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(ADMIN_ORDERS_PER_PAGE)
        .lean(),
      Order.countDocuments(filter),
    ]);

    return {
      success: true,
      orders: orders.map(serializeOrder),
      totalCount,
      totalPages: Math.ceil(totalCount / ADMIN_ORDERS_PER_PAGE),
      currentPage: page,
    };
  } catch (error: any) {
    console.error("getFilteredOrders error:", error);
    return { ...empty, error: error.message };
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
