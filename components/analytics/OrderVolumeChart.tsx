"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartCard } from "@/components/analytics/ChartCard";
import { formatDateLabel, CHART_TOOLTIP_STYLE } from "@/lib/utils/chart";
import type { OrderVolumePoint } from "@/lib/types/analytics";

interface OrderVolumeChartProps {
  data: OrderVolumePoint[];
  loading: boolean;
}

/**
 * Order volume bar chart — pure presentational component.
 * Receives data as props, renders inside ChartCard wrapper.
 * Uses shared formatDateLabel and CHART_TOOLTIP_STYLE from lib/utils/chart.
 */
export function OrderVolumeChart({ data, loading }: OrderVolumeChartProps) {
  return (
    <ChartCard
      title="Order Volume"
      subtitle="Number of orders over time"
      loading={loading}
    >
      {data.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-sm text-slate-400">
          No order data for this period
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateLabel}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) => [value, "Orders"]}
              labelFormatter={formatDateLabel}
              contentStyle={CHART_TOOLTIP_STYLE}
            />
            <Bar
              dataKey="count"
              fill="#3b82f6"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
