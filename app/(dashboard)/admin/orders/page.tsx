"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { useAuth } from "@/contexts/AuthContext";
import { getFilteredOrders, updateOrderStatus, } from "@/app/actions/order";
import type { SerializedOrder } from "@/lib/types/order";
import { type OrderStatus } from "@/lib/models/Order";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrderDetailSheet } from "@/components/orders/OrderDetailSheet";
import { Pagination } from "@/components/items/Pagination";
import { OrderListSkeleton } from "@/components/skeletons";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { useDebounce } from "@/hooks/useDebounce";

// ==========================================
// STATUS FILTER CONFIG
// ==========================================

interface FilterTab {
  label: string;
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
// PAGE COMPONENT
// ==========================================

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<SerializedOrder[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Detail sheet state
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // URL-synced state via nuqs
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  );
  const [search, setSearch] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ shallow: true }),
  );
  const [statusFilter, setStatusFilter] = useQueryState(
    "status",
    parseAsString.withDefault("").withOptions({ shallow: true }),
  );

  // Debounce search to avoid hammering the server
  const debouncedSearch = useDebounce(search, 300);

  // Reset to page 1 when search or status filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  // Fetch orders — runs on page, debounced search, status, or user change
  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const result = await getFilteredOrders(
        user.uid,
        page,
        debouncedSearch,
        statusFilter,
      );
      if (result.success) {
        setOrders(result.orders);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
      } else {
        toast.error(result.error || "Failed to load orders");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [user, page, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Status update handler
  const handleUpdateStatus = async (
    orderId: string,
    nextStatus: "shipped" | "delivered",
    expectedUpdatedAt: string,
  ) => {
    if (!user) return;
    setIsUpdatingStatus(true);

    try {
      const result = await updateOrderStatus(orderId, nextStatus, user.uid, expectedUpdatedAt);

      if (result.success && result.order) {
        toast.success(`Order marked as ${nextStatus}!`);
        // Update local state to reflect the change immediately
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? result.order! : o)),
        );
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Derive selected order from local state (reflects optimistic updates)
  const selectedOrder = useMemo(
    () => orders.find((o) => o._id === selectedOrderId) || null,
    [orders, selectedOrderId],
  );

  const handleViewDetails = (order: SerializedOrder) => {
    setSelectedOrderId(order._id);
    setSheetOpen(true);
  };

  const handleSheetClose = (open: boolean) => {
    setSheetOpen(open);
    if (!open) setSelectedOrderId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Order Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            View all customer orders, search, filter, and track fulfillment.
          </p>
        </div>
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Total Orders:{" "}
          <span className="text-slate-900 dark:text-white">{totalCount}</span>
        </div>
      </div>

      {/* Search + Status Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value || null)}
            className="w-full pl-10 h-10"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {FILTER_TABS.map((tab) => {
            const isActive = (statusFilter || null) === tab.status;
            return (
              <Button
                key={tab.label}
                variant="ghost"
                size="sm"
                onClick={() => setStatusFilter(tab.status || null)}
                className={cn(
                  "rounded-lg text-xs font-semibold whitespace-nowrap",
                  isActive
                    ? "bg-slate-900 text-white hover:bg-slate-800 hover:text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                )}
              >
                {tab.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="pt-2 relative min-h-[400px]">
        {loading ? (
          <OrderListSkeleton />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No Orders Found"
            description={
              search || statusFilter
                ? "No orders match your search or filters."
                : "No orders have been placed yet."
            }
          />
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} />
      )}

      {/* Detail Sheet — shared component with fulfillment actions */}
      <OrderDetailSheet
        order={selectedOrder}
        open={sheetOpen}
        onOpenChange={handleSheetClose}
        onUpdateStatus={handleUpdateStatus}
        isUpdatingStatus={isUpdatingStatus}
      />
    </div>
  );
}
