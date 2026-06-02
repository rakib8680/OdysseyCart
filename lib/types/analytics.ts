// Shared analytics types used across server actions and dashboard components.

export type AnalyticsPeriod = "7d" | "30d" | "90d" | "12m";

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export interface OrderVolumePoint {
  date: string;
  count: number;
}

export interface TopProduct {
  title: string;
  totalSold: number;
  revenue: number;
}

export interface CustomerMetrics {
  newCustomers: number;
  returningCustomers: number;
  totalCustomers: number;
}

export interface AnalyticsData {
  revenue: RevenueDataPoint[];
  orderVolume: OrderVolumePoint[];
  topProducts: TopProduct[];
  customerMetrics: CustomerMetrics;
}
