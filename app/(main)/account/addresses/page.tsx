"use client";

import { MapPin } from "lucide-react";
import Link from "next/link";

export default function AccountAddressesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Saved Addresses</h1>

      {/* Placeholder — will integrate existing AddressPicker component */}
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <MapPin className="w-7 h-7 text-slate-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">
          Coming Soon
        </h2>
        <p className="text-sm text-slate-500 mb-6 text-center max-w-sm">
          Manage your saved shipping addresses here. You can also save addresses
          during checkout.
        </p>
        <Link
          href="/checkout"
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors"
        >
          Go to Checkout
        </Link>
      </div>
    </div>
  );
}
