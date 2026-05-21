"use client";

import { TShippingForm } from "@/lib/validations/checkout";
import { CheckCircle2, MapPin, Plus } from "lucide-react";

export interface SavedAddress extends TShippingForm {
  _id: string;
  label: string;
  isDefault: boolean;
}

interface AddressPickerProps {
  addresses: SavedAddress[];
  selectedAddressId: string | null;
  onSelect: (address: SavedAddress | null) => void;
}

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
            <div
              key={addr._id}
              onClick={() => onSelect(addr)}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? "border-emerald-600 bg-emerald-50/50"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
              )}

              <div className="pr-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-slate-900">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>

                <div className="text-sm text-slate-600 space-y-0.5">
                  <p className="font-medium text-slate-800">{addr.fullName}</p>
                  <p className="truncate">{addr.address}</p>
                  <p>
                    {addr.city}, {addr.state} {addr.zipCode}
                  </p>
                </div>
              </div>
            </div>
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
