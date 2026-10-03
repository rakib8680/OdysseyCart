"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * RouteScrollRestoration Component
 *
 * Enterprise-grade global scroll restoration manager for Next.js App Router.
 * Automatically guarantees instant 0ms scroll restoration to (0, 0) whenever
 * the user navigates between different routes, eliminating the known Next.js
 * streaming layout scroll-retention issue across the entire application.
 *
 * Preserves in-page anchor navigation (e.g. #reviews, #catalog-top-anchor).
 */
export function RouteScrollRestoration() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;

      // Only scroll to top if not navigating to an in-page hash anchor
      if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    }
  }, [pathname]);

  return null;
}
