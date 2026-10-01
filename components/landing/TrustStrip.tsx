import { TRUST_PILLARS, type TrustPillar } from "@/lib/config/store";

interface TrustStripProps {
  items?: TrustPillar[];
  className?: string;
}

/**
 * TrustStrip Component (Pure Server Component)
 *
 * Renders customer reassurance signals directly below the Hero fold.
 * Zero client-side JS bundle overhead, fully responsive, and powered by
 * the centralized TRUST_PILLARS SSOT.
 */
export function TrustStrip({
  items = TRUST_PILLARS,
  className = "",
}: TrustStripProps) {
  return (
    <section
      aria-label="Customer Guarantees and Services"
      className={`relative w-full bg-white border-b border-slate-200/80 shadow-xs ${className}`}
    >
      <div className="app-container py-6 sm:py-8">
        <ul
          role="list"
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-slate-100"
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.id}
                role="listitem"
                className="group flex items-center gap-3.5 sm:gap-4 md:px-6 first:md:pl-0 last:md:pr-0"
              >
                {/* Icon Container */}
                <div
                  aria-hidden="true"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-200 group-hover:scale-105 transition-all duration-300 shrink-0 shadow-xs"
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300" />
                </div>

                {/* Text Content */}
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {item.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
