"use client";

import { type TShippingForm } from "@/lib/validations/checkout";
import { type ReactNode } from "react";

// ==========================================
// SHARED TYPE
// ==========================================

/** A saved shipping address with metadata. Used across checkout and account. */
export interface SavedAddress extends TShippingForm {
  _id: string;
  label: string;
  isDefault: boolean;
}

// ==========================================
// COMPONENT
// ==========================================

interface AddressCardProps {
  address: SavedAddress;
  onClick?: () => void;
  className?: string;
  /** Slot for context-specific controls (checkmark in checkout, CRUD buttons in account) */
  actions?: ReactNode;
}

/**
 * Shared address display card. Renders label, default badge,
 * and address details. Accepts an `actions` slot for context-specific
 * controls (selection indicator in checkout, CRUD buttons in account).
 */
export function AddressCard({
  address,
  onClick,
  className = "",
  actions,
}: AddressCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative p-4 rounded-xl border-2 transition-all ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* Actions slot (top-right) */}
      {actions && <div className="absolute top-3 right-3">{actions}</div>}

      <div className="pr-8">
        {/* Label + Default Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-slate-900">{address.label}</span>
          {address.isDefault && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              Default
            </span>
          )}
        </div>

        {/* Address Details */}
        <div className="text-sm text-slate-600 space-y-0.5">
          <p className="font-medium text-slate-800">{address.fullName}</p>
          <p className="truncate">{address.address}</p>
          <p>
            {address.city}, {address.state} {address.zipCode}
          </p>
        </div>
      </div>
    </div>
  );
}
