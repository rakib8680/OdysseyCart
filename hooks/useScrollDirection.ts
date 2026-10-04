"use client";

import { useState, useEffect, useRef } from "react";

export interface UseScrollDirectionOptions {
  /**
   * Distance in pixels user must scroll before direction toggles.
   * Prevents micro-jitter and trackpad elastic bounce from toggling state.
   * @default 10
   */
  threshold?: number;

  /**
   * Vertical scroll distance from top of page where navbar is guaranteed visible.
   * @default 60
   */
  topOffset?: number;

  /**
   * When true, force-keeps navbar visible and suspends hide-on-scroll
   * (e.g. while mobile drawer, search overlay, or modal is open).
   * @default false
   */
  disabled?: boolean;
}

export interface ScrollDirectionResult {
  /**
   * Whether the navbar should be translated in-view (true) or hidden out-of-view (false).
   */
  isVisible: boolean;

  /**
   * Last detected scroll direction.
   */
  scrollDirection: "up" | "down";

  /**
   * True if user is currently near the top of the viewport (<= topOffset).
   * Useful for removing borders/shadows when resting naturally at page start.
   */
  isAtTop: boolean;

  /**
   * Current scroll position in pixels.
   */
  scrollY: number;
}

/**
 * High-performance scroll direction hook with requestAnimationFrame throttling,
 * hysteresis deadzones, and top-boundary locks.
 *
 * Implements the Apple/Nike smart sticky pattern:
 * - Remains visible at top of page
 * - Hides when scrolling down (maximizes browsing canvas)
 * - Instantly reveals when scrolling up (ready for navigation)
 */
export function useScrollDirection({
  threshold = 10,
  topOffset = 60,
  disabled = false,
}: UseScrollDirectionOptions = {}): ScrollDirectionResult {
  const [isVisible, setIsVisible] = useState(true);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [isAtTop, setIsAtTop] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  const lastScrollY = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // If disabled via prop (e.g. modal open), force visible and skip listener
    if (disabled) {
      setIsVisible(true);
      return;
    }

    // SSR safety check
    if (typeof window === "undefined") {
      return;
    }

    // Initialize state with current viewport position
    const initialY = Math.max(0, window.scrollY);
    lastScrollY.current = initialY;
    setScrollY(initialY);
    setIsAtTop(initialY <= topOffset);

    const handleScroll = () => {
      if (rafId.current !== null) {
        return; // Frame already scheduled
      }

      rafId.current = window.requestAnimationFrame(() => {
        const currentScrollY = Math.max(0, window.scrollY);
        const deltaY = currentScrollY - lastScrollY.current;

        setScrollY(currentScrollY);
        const atTop = currentScrollY <= topOffset;
        setIsAtTop(atTop);

        // Near top of page: always visible
        if (atTop) {
          setIsVisible(true);
          setScrollDirection("up");
        } else if (Math.abs(deltaY) >= threshold) {
          // Beyond threshold: update visibility based on scroll direction
          if (deltaY > 0) {
            // Scrolling down -> hide navbar
            setIsVisible(false);
            setScrollDirection("down");
          } else {
            // Scrolling up -> reveal navbar
            setIsVisible(true);
            setScrollDirection("up");
          }
        }

        lastScrollY.current = currentScrollY;
        rafId.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [disabled, threshold, topOffset]);

  return {
    isVisible,
    scrollDirection,
    isAtTop,
    scrollY,
  };
}
