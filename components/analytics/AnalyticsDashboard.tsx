"use client";

import { useAnalytics } from "@/hooks/analytics/useAnalytics";
import { PeriodSelector } from "@/components/analytics/PeriodSelector";
import { RevenueChart } from "@/components/analytics/RevenueChart";
import { OrderVolumeChart } from "@/components/analytics/OrderVolumeChart";
import { TopProductsChart } from "@/components/analytics/TopProductsChart";
import { CustomerMetricsCard } from "@/components/analytics/CustomerMetricsCard";

/**
 * Analytics dashboard orchestrator — a thin presentation layer that:
 * 1. Consumes useAnalytics() hook for data, loading, and period state
 * 2. Renders the period selector and chart grid
 *
 * All data-fetching, caching, stale-time, and focus-refetching logic
 * lives in the useAnalytics hook — this component is purely presentational.
 */
export function AnalyticsDashboard() {
  const { data, loading, period, setPeriod } = useAnalytics();

  return (
    <div className="space-y-5">
      {/* Section Header + Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Analytics</h2>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* Charts Grid — 2 columns on desktop, 1 on mobile */}
      <div className="grid lg:grid-cols-2 gap-5">
        <RevenueChart data={data.revenue} loading={loading} />
        <OrderVolumeChart data={data.orderVolume} loading={loading} />
        <TopProductsChart data={data.topProducts} loading={loading} />
        <CustomerMetricsCard data={data.customerMetrics} loading={loading} />
      </div>
    </div>
  );
}
