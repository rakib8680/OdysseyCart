import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavBrandProps {
  className?: string;
  onClick?: () => void;
}

/**
 * Editorial typographic brand mark for OdysseyCart.
 * Uses Urbanist display typeface at 800 weight with tight letter-spacing.
 */
export function NavBrand({ className, onClick }: NavBrandProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2 shrink-0 py-1 transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 rounded-md",
        className
      )}
      aria-label="OdysseyCart homepage"
    >
      <span className="font-heading font-extrabold text-xl tracking-[-0.04em] text-slate-900 select-none">
        ODYSSEY
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 transition-transform duration-300 group-hover:scale-125" />
    </Link>
  );
}
