"use client";

import { AddressManager } from "@/components/addresses/AddressManager";

export default function AccountAddressesPage() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Saved Addresses
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
          Manage your delivery and billing addresses
        </p>
      </div>
      <AddressManager />
    </div>
  );
}
