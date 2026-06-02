"use server";

import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { requireAdmin } from "@/app/actions/users";
import type { AdminStats } from "@/lib/types/admin";

/**
 * Fetches aggregate stats for the admin dashboard overview.
 * Only counts orders with status !== "pending" (pending = unpaid/abandoned).
 */
export async function getAdminStats(adminUid: string): Promise<{
  success: boolean;
  stats: AdminStats;
  error?: string;
}> {
  try {
    await connectDB();
    await requireAdmin(adminUid);

    // Run all three queries in parallel for speed
    const [revenueResult, totalOrders, totalProducts] = await Promise.all([
      Order.aggregate([
        { $match: { status: { $ne: "pending" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.countDocuments({ status: { $ne: "pending" } }),
      Product.countDocuments(),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    return {
      success: true,
      stats: { totalRevenue, totalOrders, totalProducts },
    };
  } catch (error: any) {
    console.error("Error fetching admin stats:", error);
    return {
      success: false,
      stats: { totalRevenue: 0, totalOrders: 0, totalProducts: 0 },
      error: error.message,
    };
  }
}
