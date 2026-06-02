"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAnalyticsData } from "@/app/actions/analytics";
import { PeriodSelector } from "@/components/analytics/PeriodSelector";
import { RevenueChart } from "@/components/analytics/RevenueChart";
import { OrderVolumeChart } from "@/components/analytics/OrderVolumeChart";
import { TopProductsChart } from "@/components/analytics/TopProductsChart";
import { CustomerMetricsCard } from "@/components/analytics/CustomerMetricsCard";
import type { AnalyticsPeriod, AnalyticsData } from "@/lib/types/analytics";

const EMPTY_DATA: AnalyticsData = {
  revenue: [],
  orderVolume: [],
  topProducts: [],
  customerMetrics: {
    newCustomers: 0,
    returningCustomers: 0,
    totalCustomers: 0,
  },
};

/**
 * Analytics dashboard orchestrator — the ONLY component that:
 * 1. Calls getAnalyticsData() server action
 * 2. Manages loading + period state
 * 3. Passes data down to pure presentational chart components
 *
 * Chart components have zero data-fetching logic — they are props-driven.
 */
export function AnalyticsDashboard() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<AnalyticsPeriod>("30d");
  const [data, setData] = useState<AnalyticsData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(
    async (selectedPeriod: AnalyticsPeriod) => {
      if (!user) return;
      setLoading(true);
      const result = await getAnalyticsData(user.uid, selectedPeriod);
      if (result.success) {
        setData(result.data);
      }
      setLoading(false);
    },
    [user],
  );

  // Fetch on mount and when period changes
  useEffect(() => {
    fetchAnalytics(period);
  }, [period, fetchAnalytics]);

  const handlePeriodChange = (newPeriod: AnalyticsPeriod) => {
    setPeriod(newPeriod);
  };

  return (
    <div className="space-y-5">
      {/* Section Header + Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Analytics</h2>
        <PeriodSelector value={period} onChange={handlePeriodChange} />
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
