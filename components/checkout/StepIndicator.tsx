import { Check } from "lucide-react";

interface StepIndicatorProps {
  number: number;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
  isLast: boolean;
}

export function StepIndicator({
  number,
  label,
  isActive,
  isCompleted,
  isLast,
}: StepIndicatorProps) {
  return (
    <>
      <div className="flex items-center gap-2">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
            isCompleted
              ? "bg-emerald-600 text-white"
              : isActive
                ? "bg-slate-900 text-white"
                : "bg-slate-200 text-slate-500"
          }`}
        >
          {isCompleted ? <Check className="w-3.5 h-3.5" /> : number}
        </div>
        <span
          className={`text-sm font-medium hidden sm:block ${
            isActive
              ? "text-slate-900"
              : isCompleted
                ? "text-emerald-600"
                : "text-slate-400"
          }`}
        >
          {label}
        </span>
      </div>
      {!isLast && (
        <div
          className={`flex-1 h-0.5 ${
            isCompleted ? "bg-emerald-300" : "bg-slate-200"
          }`}
        />
      )}
    </>
  );
}
