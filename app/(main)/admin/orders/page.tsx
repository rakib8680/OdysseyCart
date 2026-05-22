"use client";

import { Package } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>

      <EmptyState
        icon={Package}
        title="Coming Soon"
        description="View all customer orders, update statuses, and track fulfillment from here."
        actionLabel="Back to Overview"
        actionHref="/admin"
      />
    </div>
  );
}
