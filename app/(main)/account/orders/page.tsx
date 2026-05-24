"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserOrders, type SerializedOrder } from "@/app/actions/order";
import { OrderList } from "@/components/orders/OrderList";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<SerializedOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;

      setLoading(true);
      const result = await getUserOrders(user.uid);
      if (result.success) {
        setOrders(result.orders);
      }
      setLoading(false);
    }

    fetchOrders();
  }, [user]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track and manage your purchases
        </p>
      </div>

      {loading ? <OrderListSkeleton /> : <OrderList orders={orders} />}
    </div>
  );
}

// ==========================================
// LOADING SKELETON (matches OrderCard layout)
// ==========================================

/** Skeleton that mirrors the exact shape of OrderCard for seamless loading */
function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Col 1: ID, Date & Recipient */}
      <div className="min-w-[160px]">
        <Skeleton className="h-4 w-20 mb-1.5" />
        <Skeleton className="h-3.5 w-32" />
      </div>

      {/* Col 2: Product Thumbnails */}
      <div className="flex items-center gap-1.5 flex-1">
        <div className="flex -space-x-1">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
        <Skeleton className="h-3 w-12 ml-2 hidden md:block" />
      </div>

      {/* Col 3: Status Badge */}
      <div className="min-w-[110px]">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Col 4: Total Price */}
      <div className="min-w-[90px]">
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Col 5: Action Button */}
      <div>
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

/** Renders multiple card skeletons + a filter bar skeleton */
function OrderListSkeleton() {
  return (
    <div className="space-y-5">
      {/* Filter bar skeleton */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <div className="flex gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Card skeletons */}
      <div className="grid gap-4">
        <OrderCardSkeleton />
        <OrderCardSkeleton />
        <OrderCardSkeleton />
      </div>
    </div>
  );
}
