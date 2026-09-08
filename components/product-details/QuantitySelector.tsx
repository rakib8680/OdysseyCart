"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  max: number;
  min?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * QuantitySelector Component.
 * Touch-friendly stepper control (- [ 1 ] +) with min/max bounds guarding,
 * tabular numbers, and accessible button labels.
 */
export function QuantitySelector({
  quantity,
  onChange,
  max,
  min = 1,
  disabled = false,
  className,
}: QuantitySelectorProps) {
  const canDecrease = !disabled && quantity > min;
  const canIncrease = !disabled && quantity < max;

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canDecrease) {
      onChange(quantity - 1);
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canIncrease) {
      onChange(quantity + 1);
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl border border-slate-200 bg-slate-50/70 p-1 select-none shadow-2xs h-12",
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
      role="group"
      aria-label="Quantity selector"
    >
      <button
        type="button"
        onClick={handleDecrease}
        disabled={!canDecrease}
        aria-label="Decrease quantity"
        className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95 disabled:hover:bg-transparent"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span
        className="w-10 text-center font-bold text-slate-900 text-sm tabular-nums"
        aria-live="polite"
        aria-label={`Current quantity is ${quantity}`}
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={handleIncrease}
        disabled={!canIncrease}
        aria-label="Increase quantity"
        className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95 disabled:hover:bg-transparent"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
