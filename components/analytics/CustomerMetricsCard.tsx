"use client";

import { Users, UserPlus, UserCheck } from "lucide-react";
import { ChartCard } from "@/components/analytics/ChartCard";
import { StatCard } from "@/components/ui/StatCard";
import type { CustomerMetrics } from "@/lib/types/analytics";

interface CustomerMetricsCardProps {
  data: CustomerMetrics;
  loading: boolean;
}

/**
 * Customer acquisition metrics — reuses existing StatCard component.
 * Wraps 3 StatCards in a ChartCard for consistent dashboard styling.
 * No new stat card created — DRY with existing components/ui/StatCard.
 */
export function CustomerMetricsCard({
  data,
  loading,
}: CustomerMetricsCardProps) {
  return (
    <ChartCard
      title="Customer Metrics"
      subtitle="New vs returning customers"
      loading={loading}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard
          label="Total Customers"
          value={String(data.totalCustomers)}
          icon={Users}
          accentColor="blue"
        />
        <StatCard
          label="New Customers"
          value={String(data.newCustomers)}
          icon={UserPlus}
          accentColor="emerald"
        />
        <StatCard
          label="Returning"
          value={String(data.returningCustomers)}
          icon={UserCheck}
          accentColor="amber"
        />
      </div>
    </ChartCard>
  );
}
