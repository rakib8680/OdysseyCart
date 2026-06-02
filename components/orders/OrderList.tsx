"use client";

import { useMemo, useState } from "react";
import type { SerializedOrder } from "@/lib/types/order";
import { type OrderStatus } from "@/lib/models/Order";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrderDetailSheet } from "@/components/orders/OrderDetailSheet";
import { EmptyState } from "@/components/ui/EmptyState";
import { Package, Search } from "lucide-react";
import { formatOrderId } from "@/lib/utils";

// ==========================================
// FILTER TAB CONFIG
// ==========================================

interface FilterTab {
  label: string;
  /** null means "All" — no filtering */
  status: OrderStatus | null;
}

const FILTER_TABS: FilterTab[] = [
  { label: "All", status: null },
  { label: "Processing", status: "paid" },
  { label: "Shipped", status: "shipped" },
  { label: "Delivered", status: "delivered" },
  { label: "Failed", status: "failed" },
];

// ==========================================
// COMPONENT
// ==========================================

interface OrderListProps {
  orders: SerializedOrder[];
  onUpdateStatus?: (
    orderId: string,
    nextStatus: "shipped" | "delivered",
  ) => Promise<void>;
  isUpdatingStatus?: boolean;
}

/**
 * Renders a filterable, searchable list of order cards with a detail sheet.
 * Orchestrates OrderCard + OrderDetailSheet.
 * Shared across user account and admin dashboards.
 */
export function OrderList({
  orders,
  onUpdateStatus,
  isUpdatingStatus,
}: OrderListProps) {
  const [activeFilter, setActiveFilter] = useState<OrderStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Derive selected order from the canonical orders prop.
  // This ensures mutations (e.g. status updates) are reflected instantly
  // without needing to manually sync a separate snapshot.
  const selectedOrder = useMemo(
    () => orders.find((o) => o._id === selectedOrderId) || null,
    [orders, selectedOrderId],
  );

  // ─── Derived: filtered + searched orders ───
  const filteredOrders = useMemo(() => {
    let result = orders;

    // Apply status filter
    if (activeFilter) {
      result = result.filter((o) => o.status === activeFilter);
    }

    // Apply search (by ID, name, email, or Stripe Payment ID)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          formatOrderId(o._id).toLowerCase().includes(q) ||
          o._id.toLowerCase().includes(q) ||
          o.shippingInfo.fullName.toLowerCase().includes(q) ||
          o.shippingInfo.email.toLowerCase().includes(q) ||
          o.stripePaymentId?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [orders, activeFilter, searchQuery]);

  // ─── Handlers ───
  const handleViewDetails = (order: SerializedOrder) => {
    setSelectedOrderId(order._id);
    setSheetOpen(true);
  };

  const handleSheetClose = (open: boolean) => {
    setSheetOpen(open);
    if (!open) setSelectedOrderId(null);
  };

  // ─── No orders at all ───
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No Orders Yet"
        description="Your order history will appear here once you place your first order."
        actionLabel="Browse Products"
        actionHref="/items"
      />
    );
  }

  return (
    <>
      {/* ─── Search + Filters Bar ─── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.status;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveFilter(tab.status)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Results ─── */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200">
          <Package className="w-10 h-10 text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-500">
            No orders match your filters.
          </p>
          <button
            onClick={() => {
              setActiveFilter(null);
              setSearchQuery("");
            }}
            className="mt-3 text-sm font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* ─── Detail Sheet (one shared instance) ─── */}
      <OrderDetailSheet
        order={selectedOrder}
        open={sheetOpen}
        onOpenChange={handleSheetClose}
        onUpdateStatus={onUpdateStatus}
        isUpdatingStatus={isUpdatingStatus}
      />
    </>
  );
}
