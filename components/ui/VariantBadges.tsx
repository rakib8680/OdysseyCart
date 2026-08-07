interface VariantBadgesProps {
  options?: Record<string, string>;
  className?: string;
}

/**
 * Reusable component for rendering pill badges for selected variant options
 * (e.g. Size: M, Color: Black). Used in CartItem and SummaryItem.
 */
export function VariantBadges({
  options,
  className = "",
}: VariantBadgesProps) {
  if (!options || Object.keys(options).length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {Object.entries(options).map(([key, value]) => (
        <span
          key={key}
          className="text-[10px] sm:text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded"
        >
          {key}: {value}
        </span>
      ))}
    </div>
  );
}
