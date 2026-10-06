"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { NAV_LINKS, MegaMenuKey } from "@/lib/config/navigation";
import { cn } from "@/lib/utils";

export interface NavLinksProps {
  activeMegaMenu?: MegaMenuKey | null;
  onHoverLink?: (key: MegaMenuKey | null) => void;
  onLinkClick?: () => void;
  className?: string;
}

/**
 * Desktop navigation links featuring hardware-accelerated 1.5px animated hover underlines
 * and interactive mega menu hover triggers with chevron state.
 */
export function NavLinks({
  activeMegaMenu = null,
  onHoverLink,
  onLinkClick,
  className,
}: NavLinksProps) {
  const pathname = usePathname();

  const isLinkActive = (href: string, exact?: boolean) => {
    if (exact || href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav
      className={cn("hidden md:flex items-center gap-6 lg:gap-8", className)}
      aria-label="Main navigation"
    >
      {NAV_LINKS.map((link) => {
        const active = isLinkActive(link.href, link.exact);
        const isMenuOpen = link.menuKey && activeMegaMenu === link.menuKey;

        return (
          <div
            key={link.name}
            className="relative flex items-center h-16"
            onMouseEnter={() => {
              if (link.hasMegaMenu && link.menuKey && onHoverLink) {
                onHoverLink(link.menuKey);
              }
            }}
          >
            <Link
              href={link.href}
              onClick={onLinkClick}
              className={cn(
                "group relative inline-flex items-center gap-1.5 py-2 text-[13.5px] tracking-wide transition-colors duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 rounded-sm",
                active
                  ? "text-slate-900 font-semibold"
                  : isMenuOpen
                  ? "text-slate-900 font-medium"
                  : "text-slate-500 font-medium hover:text-slate-900"
              )}
              aria-expanded={link.hasMegaMenu ? isMenuOpen : undefined}
              aria-controls={link.hasMegaMenu && isMenuOpen ? "mega-menu-panel" : undefined}
              aria-haspopup={link.hasMegaMenu ? "menu" : undefined}
            >
              <span>{link.name}</span>

              {link.hasMegaMenu && (
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200 text-slate-400 group-hover:text-slate-700",
                    isMenuOpen && "rotate-180 text-slate-900"
                  )}
                  aria-hidden="true"
                />
              )}

              {/* Hardware-accelerated 1.5px animated hover underline */}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 right-0 h-[1.5px] bg-slate-900 rounded-full transition-all duration-250 ease-out origin-left pointer-events-none",
                  active
                    ? "opacity-100 scale-x-100"
                    : isMenuOpen
                    ? "opacity-100 scale-x-100"
                    : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                )}
                aria-hidden="true"
              />
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
