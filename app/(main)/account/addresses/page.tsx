"use client";

import { AddressManager } from "@/components/addresses/AddressManager";

export default function AccountAddressesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Saved Addresses</h1>
      <AddressManager />
    </div>
  );
}
