// Shared formatting utilities for analytics chart components.
// Used by RevenueChart, OrderVolumeChart, and any future chart.

/** Formats a number as compact currency: $1,234 → "$1.2k" */
export function formatCurrency(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${value.toFixed(0)}`;
}

/** Formats a full currency string with decimals: 1234.5 → "$1,234.50" */
export function formatCurrencyFull(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

/**
 * Formats date strings from MongoDB aggregation for chart labels.
 * "2026-06-01" → "Jun 1" (daily) | "2026-06" → "Jun" (monthly)
 */
export function formatDateLabel(dateStr: string): string {
  const parts = dateStr.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[parseInt(parts[1], 10) - 1];
  return parts.length === 3 ? `${month} ${parseInt(parts[2], 10)}` : month;
}

/** Shared tooltip style object — consistent look across all charts */
export const CHART_TOOLTIP_STYLE: React.CSSProperties = {
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
  fontSize: "13px",
};
