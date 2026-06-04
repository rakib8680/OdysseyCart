"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartCard } from "@/components/analytics/ChartCard";
import { formatCurrencyFull, CHART_TOOLTIP_STYLE } from "@/lib/utils/chart";
import type { TopProduct } from "@/lib/types/analytics";

interface TopProductsChartProps {
  data: TopProduct[];
  loading: boolean;
}

/** Truncates long product titles for Y-axis labels */
function truncateTitle(title: string, maxLen: number): string {
  return title.length > maxLen ? `${title.slice(0, maxLen)}…` : title;
}

const CustomYAxisTick = (props: any) => {
  const { x, y, payload, maxLen } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={-10} y={0} dy={4} textAnchor="end" fill="#334155" fontSize={12}>
        {truncateTitle(payload.value, maxLen)}
      </text>
    </g>
  );
};

/**
 * Top 5 best-selling products — horizontal bar chart.
 * Pure presentational component, renders inside ChartCard wrapper.
 * Uses shared CHART_TOOLTIP_STYLE and formatCurrencyFull from lib/utils/chart.
 */
export function TopProductsChart({ data, loading }: TopProductsChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const yAxisWidth = isMobile ? 90 : 160;
  const maxTitleLen = isMobile ? 12 : 22;

  return (
    <ChartCard
      title="Top Products"
      subtitle="Best sellers by units sold"
      loading={loading}
    >
      {data.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-sm text-slate-400">
          No product data for this period
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={data.length * 48 + 10}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 20, left: isMobile ? 0 : 20, bottom: 0 }}
          >
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="title"
              axisLine={false}
              tickLine={false}
              width={yAxisWidth}
              tick={<CustomYAxisTick maxLen={maxTitleLen} />}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === "totalSold") return [value, "Units Sold"];
                return [value, name];
              }}
              labelFormatter={(title: string) => title}
              contentStyle={CHART_TOOLTIP_STYLE}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const item = payload[0].payload as TopProduct;
                return (
                  <div
                    className="bg-white rounded-xl border border-slate-200 px-3 py-2 shadow-md"
                    style={{ fontSize: "13px" }}
                  >
                    <p className="font-medium text-slate-900 mb-1">
                      {item.title}
                    </p>
                    <p className="text-slate-500">
                      Units sold:{" "}
                      <span className="text-slate-900 font-medium">
                        {item.totalSold}
                      </span>
                    </p>
                    <p className="text-slate-500">
                      Revenue:{" "}
                      <span className="text-slate-900 font-medium">
                        {formatCurrencyFull(item.revenue)}
                      </span>
                    </p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="totalSold"
              fill="#f59e0b"
              radius={[0, 6, 6, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
