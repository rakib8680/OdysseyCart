"use server";

import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import { requireAdmin } from "@/app/actions/users";
import type {
  AnalyticsPeriod,
  AnalyticsData,
  RevenueDataPoint,
  OrderVolumePoint,
  TopProduct,
  CustomerMetrics,
} from "@/lib/types/analytics";

// ==========================================
// HELPERS
// ==========================================

/** Compute the start date for a given period */
function getStartDate(period: AnalyticsPeriod): Date {
  const now = new Date();
  switch (period) {
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case "90d":
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case "12m":
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  }
}

/** Date format string for MongoDB $dateToString — daily for short periods, monthly for 12m */
function getDateFormat(period: AnalyticsPeriod): string {
  return period === "12m" ? "%Y-%m" : "%Y-%m-%d";
}

/** Base match stage: exclude pending orders + filter by period */
function baseMatch(startDate: Date) {
  return {
    $match: {
      status: { $ne: "pending" },
      createdAt: { $gte: startDate },
    },
  };
}

// ==========================================
// PRIVATE AGGREGATION HELPERS
// ==========================================

/** Revenue trend — grouped by day or month */
async function _getRevenueTrend(
  startDate: Date,
  dateFormat: string,
): Promise<RevenueDataPoint[]> {
  const result = await Order.aggregate([
    baseMatch(startDate),
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
        revenue: { $sum: "$total" },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: "$_id", revenue: 1 } },
  ]);

  return result;
}

/** Order volume — count of orders grouped by day or month */
async function _getOrderVolume(
  startDate: Date,
  dateFormat: string,
): Promise<OrderVolumePoint[]> {
  const result = await Order.aggregate([
    baseMatch(startDate),
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: "$_id", count: 1 } },
  ]);

  return result;
}

/** Top 5 best-selling products by quantity within the period */
async function _getTopProducts(startDate: Date): Promise<TopProduct[]> {
  const result = await Order.aggregate([
    baseMatch(startDate),
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.title",
        totalSold: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    { $project: { _id: 0, title: "$_id", totalSold: 1, revenue: 1 } },
  ]);

  return result;
}

/** New vs returning customers within the period */
async function _getCustomerMetrics(startDate: Date): Promise<CustomerMetrics> {
  // Find each customer's first order date, then classify
  const result = await Order.aggregate([
    { $match: { status: { $ne: "pending" } } },
    {
      $group: {
        _id: "$userId",
        firstOrder: { $min: "$createdAt" },
        orderCount: { $sum: 1 },
      },
    },
    {
      $facet: {
        // Customers whose first order is within the period = new
        newCustomers: [
          { $match: { firstOrder: { $gte: startDate } } },
          { $count: "count" },
        ],
        // Customers who have orders in the period but first order was before = returning
        returningCustomers: [
          { $match: { firstOrder: { $lt: startDate } } },
          { $count: "count" },
        ],
        // Total unique customers
        total: [{ $count: "count" }],
      },
    },
  ]);

  const facet = result[0];
  return {
    newCustomers: facet.newCustomers[0]?.count ?? 0,
    returningCustomers: facet.returningCustomers[0]?.count ?? 0,
    totalCustomers: facet.total[0]?.count ?? 0,
  };
}

// ==========================================
// PUBLIC API
// ==========================================

/**
 * Fetches all analytics data for the admin dashboard.
 * Single entry point — single auth guard, parallel queries.
 */
export async function getAnalyticsData(
  adminUid: string,
  period: AnalyticsPeriod = "30d",
): Promise<{
  success: boolean;
  data: AnalyticsData;
  error?: string;
}> {
  try {
    await connectDB();
    await requireAdmin(adminUid);

    const startDate = getStartDate(period);
    const dateFormat = getDateFormat(period);

    // Run all 4 aggregations in parallel
    const [revenue, orderVolume, topProducts, customerMetrics] =
      await Promise.all([
        _getRevenueTrend(startDate, dateFormat),
        _getOrderVolume(startDate, dateFormat),
        _getTopProducts(startDate),
        _getCustomerMetrics(startDate),
      ]);

    return {
      success: true,
      data: { revenue, orderVolume, topProducts, customerMetrics },
    };
  } catch (error: any) {
    console.error("Error fetching analytics data:", error);
    return {
      success: false,
      data: {
        revenue: [],
        orderVolume: [],
        topProducts: [],
        customerMetrics: {
          newCustomers: 0,
          returningCustomers: 0,
          totalCustomers: 0,
        },
      },
      error: error.message,
    };
  }
}
