"use client";

import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  accentColor?: "emerald" | "blue" | "amber";
}

const accentStyles = {
  emerald: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
  },
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
  },
};

/** Reusable stat card — icon, label, and formatted value */
export function StatCard({
  label,
  value,
  icon: Icon,
  accentColor = "emerald",
}: StatCardProps) {
  const accent = accentStyles[accentColor];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            accent.bg,
          )}
        >
          <Icon className={cn("w-5 h-5", accent.icon)} />
        </div>
        <span className="text-sm text-slate-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
