"use client";

import {
  AddressCard,
  type SavedAddress,
} from "@/components/addresses/AddressCard";
import { CheckCircle2, MapPin, Plus } from "lucide-react";

// Re-export the shared type so existing consumers don't break
export type { SavedAddress };

// ==========================================
// COMPONENT
// ==========================================

interface AddressPickerProps {
  addresses: SavedAddress[];
  selectedAddressId: string | null;
  onSelect: (address: SavedAddress | null) => void;
}

/**
 * Address selection component for checkout.
 * Wraps shared AddressCard with selection behavior (click-to-select, checkmark).
 */
export function AddressPicker({
  addresses,
  selectedAddressId,
  onSelect,
}: AddressPickerProps) {
  // If the user has no saved addresses, we simply hide this component
  if (!addresses || addresses.length === 0) return null;

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-emerald-600" />
        <h3 className="text-base font-bold text-slate-900">Saved Addresses</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => {
          const isSelected = selectedAddressId === addr._id;

          return (
            <AddressCard
              key={addr._id}
              address={addr}
              onClick={() => onSelect(addr)}
              className={
                isSelected
                  ? "border-emerald-600 bg-emerald-50/50"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }
              actions={
                isSelected ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : undefined
              }
            />
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
          selectedAddressId === null
            ? "text-emerald-600"
            : "text-slate-500 hover:text-slate-800"
        }`}
      >
        <Plus className="w-4 h-4" />
        Use a new address
      </button>
    </div>
  );
}
