"use client";

import { type OrderStatus } from "@/lib/models/Order";
import {
  Clock,
  CreditCard,
  Truck,
  PackageCheck,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";

// ==========================================
// STATUS CONFIG (Single source of truth)
// ==========================================

interface StatusConfig {
  label: string;
  icon: LucideIcon;
  /** Tailwind classes for background, text, and border */
  className: string;
}

/**
 * Maps each OrderStatus to its display config.
 * This is the ONE place to update if new statuses are added
 * or if the visual design of status badges changes.
 */
const STATUS_MAP: Record<OrderStatus, StatusConfig> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  paid: {
    label: "Processing",
    icon: CreditCard,
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  delivered: {
    label: "Delivered",
    icon: PackageCheck,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  failed: {
    label: "Failed",
    icon: AlertTriangle,
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

// ==========================================
// COMPONENT
// ==========================================

interface OrderStatusBadgeProps {
  status: OrderStatus;
  /** Show the icon alongside the label (default: true) */
  showIcon?: boolean;
}

/**
 * Renders a semantic status pill for an order.
 * Shared across user order history and admin order management.
 */
export function OrderStatusBadge({
  status,
  showIcon = true,
}: OrderStatusBadgeProps) {
  const config = STATUS_MAP[status];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${config.className}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {config.label}
    </span>
  );
}
