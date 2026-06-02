"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAllOrders, updateOrderStatus } from "@/app/actions/order";
import type { SerializedOrder } from "@/lib/types/order";
import { OrderList } from "@/components/orders/OrderList";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<SerializedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      setLoading(true);
      const result = await getAllOrders(user.uid);
      if (result.success) {
        setOrders(result.orders);
      }
      setLoading(false);
    }
    fetchOrders();
  }, [user]);

  // update status handler
  const handleUpdateStatus = async (
    orderId: string,
    nextStatus: "shipped" | "delivered",
  ) => {
    if (!user) return;
    setIsUpdatingStatus(true);
    const result = await updateOrderStatus(orderId, nextStatus, user.uid);
    setIsUpdatingStatus(false);

    if (result.success && result.order) {
      toast.success(`Order marked as ${nextStatus}!`);
      // Optimistic local update
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? result.order! : o)),
      );
    } else {
      toast.error(result.error || "Failed to update status");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          View all customer orders, search, filter, and track fulfillment from
          here.
        </p>
      </div>

      {loading ? (
        <OrderListSkeleton />
      ) : (
        <OrderList
          orders={orders}
          onUpdateStatus={handleUpdateStatus}
          isUpdatingStatus={isUpdatingStatus}
        />
      )}
    </div>
  );
}

// ==========================================
// LOADING SKELETON (matches OrderCard layout)
// ==========================================

function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="w-[200px] flex-shrink-0 sm:block hidden">
        <Skeleton className="h-4 w-20 mb-1.5" />
        <Skeleton className="h-3.5 w-32" />
      </div>
      <div className="w-full sm:hidden">
        <Skeleton className="h-4 w-20 mb-1.5" />
        <Skeleton className="h-3.5 w-32" />
      </div>
      <div className="flex items-center gap-1.5 flex-1">
        <div className="flex -space-x-1">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
        <Skeleton className="h-3 w-12 ml-2 hidden md:block" />
      </div>
      <div className="min-w-[110px]">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="min-w-[90px]">
        <Skeleton className="h-4 w-16" />
      </div>
      <div>
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

function OrderListSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <div className="flex gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="grid gap-4">
        <OrderCardSkeleton />
        <OrderCardSkeleton />
        <OrderCardSkeleton />
      </div>
    </div>
  );
}
