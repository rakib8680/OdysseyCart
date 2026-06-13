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
