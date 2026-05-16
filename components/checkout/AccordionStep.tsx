import { Check } from "lucide-react";

interface AccordionStepProps {
  stepNumber: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  onEdit: () => void;
  summary?: string;
  children: React.ReactNode;
}

export function AccordionStep({
  stepNumber,
  title,
  isActive,
  isCompleted,
  onEdit,
  summary,
  children,
}: AccordionStepProps) {
  return (
    <div
      className={`bg-white rounded-xl border transition-colors ${
        isActive
          ? "border-slate-300 shadow-sm"
          : isCompleted
            ? "border-emerald-200"
            : "border-slate-200 opacity-60"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              isCompleted
                ? "bg-emerald-100 text-emerald-700"
                : isActive
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-400"
            }`}
          >
            {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNumber}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            {isCompleted && summary && (
              <p className="text-xs text-slate-500 mt-0.5">{summary}</p>
            )}
          </div>
        </div>

        {isCompleted && (
          <button
            onClick={onEdit}
            className="text-xs font-semibold text-slate-600 hover:text-emerald-600 transition-colors cursor-pointer"
          >
            Edit
          </button>
        )}
      </div>

      {/* Body — always rendered to preserve state, but visually hidden if inactive */}
      <div
        className={`px-6 border-slate-100 ${isActive ? "pb-6 pt-5 border-t block" : "hidden"}`}
      >
        {children}
      </div>
    </div>
  );
}
