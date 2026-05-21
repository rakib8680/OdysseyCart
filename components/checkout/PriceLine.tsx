/** Reusable price breakdown line */
export function PriceLine({
  label,
  value,
  isFree = false,
  className = "",
  icon,
}: {
  label: string;
  value: number;
  isFree?: boolean;
  className?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className={`flex justify-between items-center text-sm ${className}`}>
      <span className="text-slate-600 flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      {isFree ? (
        <span className="font-semibold text-emerald-600 uppercase text-xs">
          Free
        </span>
      ) : (
        <span className="font-medium text-slate-900">
          {value < 0
            ? `-$${Math.abs(value).toFixed(2)}`
            : `$${value.toFixed(2)}`}
        </span>
      )}
    </div>
  );
}
