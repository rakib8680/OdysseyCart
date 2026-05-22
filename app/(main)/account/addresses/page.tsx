"use client";

import { MapPin } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AccountAddressesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Saved Addresses</h1>

      <EmptyState
        icon={MapPin}
        title="Coming Soon"
        description="Manage your saved shipping addresses here. You can also save addresses during checkout."
        actionLabel="Go to Checkout"
        actionHref="/checkout"
      />
    </div>
  );
}
