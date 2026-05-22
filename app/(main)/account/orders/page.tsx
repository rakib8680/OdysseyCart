"use client";

import { Package } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AccountOrdersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>

      <EmptyState
        icon={Package}
        title="Coming Soon"
        description="Your order history will appear here. Start shopping to place your first order!"
        actionLabel="Browse Products"
        actionHref="/items"
      />
    </div>
  );
}
