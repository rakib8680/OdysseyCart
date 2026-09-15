"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserOrders } from "@/app/actions/order";
import type { SerializedOrder } from "@/lib/types/order";
import { OrderList } from "@/components/orders/OrderList";
import { OrderListSkeleton } from "@/components/skeletons";

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
            Track and manage your purchases
          </p>
        </div>
        {!loading && orders.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] sm:text-xs font-medium text-slate-600 dark:text-slate-300">
              Total Orders:{" "}
              <strong className="text-slate-900 dark:text-white font-semibold">{orders.length}</strong>
            </span>
          </div>
        )}
      </div>

      {loading ? <OrderListSkeleton /> : <OrderList orders={orders} />}
    </div>
  );
}
