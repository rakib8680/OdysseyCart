"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { NavBrand } from "@/components/navbar/NavBrand";
import { NavLinks } from "@/components/navbar/NavLinks";
import { NavUtilityBar } from "@/components/navbar/NavUtilityBar";
import { MegaMenu } from "@/components/navbar/MegaMenu";
import { SearchOverlay } from "@/components/navbar/SearchOverlay";
import { MobileNavOverlay } from "@/components/navbar/MobileNavOverlay";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { MegaMenuKey } from "@/lib/config/navigation";
import { cn } from "@/lib/utils";

export interface NavbarProps {
  className?: string;
}

/**
 * Enterprise Luxury Storefront Navigation Orchestrator.
 *
 * Coordinates:
 * 1. Smart sticky physics (hide-on-scroll down, reveal on scroll up).
 * 2. Dual Mega Menus (Categories & Items) with 150ms enter / 120ms exit debounce & 0ms hover gliding.
 * 3. Minimalist full-width Search Overlay drawer with ⌘K / Ctrl+K / '/' global shortcut listeners.
 * 4. Cinematic full-screen mobile drawer with staggered layout and strict scroll locking.
 * 5. Single Source of Truth (SSOT) navigation configuration and role-aware auth dropdown.
 */
export function Navbar({ className }: NavbarProps) {
  const pathname = usePathname();

  // Overlay & Drawer states
  const [activeMegaMenu, setActiveMegaMenu] = useState<MegaMenuKey | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Debounce timers for smooth hover physics without flicker
  const enterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Lock scroll physics when any modal, drawer, or mega menu is active
  const isAnyOverlayActive = Boolean(
    activeMegaMenu || isSearchOpen || isMobileOpen,
  );

  const { isVisible, isAtTop } = useScrollDirection({
    threshold: 15,
    topOffset: 40,
    disabled: isAnyOverlayActive,
  });

  // Automatically dismiss all overlays on route change
  useEffect(() => {
    setActiveMegaMenu(null);
    setIsSearchOpen(false);
    setIsMobileOpen(false);
  }, [pathname]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  // Global keyboard shortcuts (⌘K / Ctrl+K / '/')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K triggers search drawer
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }

      // '/' opens search when not actively typing in an input
      if (e.key === "/" && !isSearchOpen) {
        const activeEl = document.activeElement;
        const isInputField =
          activeEl?.tagName === "INPUT" ||
          activeEl?.tagName === "TEXTAREA" ||
          (activeEl as HTMLElement)?.isContentEditable;

        if (!isInputField) {
          e.preventDefault();
          setIsSearchOpen(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  // ---------------------------------------------------------------------------
  // Mega Menu Hover Handlers (25ms instant enter, 120ms exit, 0ms cross-panel glide)
  // ---------------------------------------------------------------------------
  const handleHoverLink = useCallback(
    (key: MegaMenuKey | null) => {
      // Cancel any pending exit
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
        leaveTimeoutRef.current = null;
      }

      if (!key) return;

      // If a menu is ALREADY open, glide immediately with 0ms delay
      if (activeMegaMenu) {
        if (enterTimeoutRef.current) {
          clearTimeout(enterTimeoutRef.current);
          enterTimeoutRef.current = null;
        }
        setActiveMegaMenu(key);
        return;
      }

      // If opening from closed state, snappy micro-debounce with 25ms to prevent cursor swipe flicker
      if (enterTimeoutRef.current) {
        clearTimeout(enterTimeoutRef.current);
      }
      enterTimeoutRef.current = setTimeout(() => {
        setActiveMegaMenu(key);
      }, 25);
    },
    [activeMegaMenu],
  );

  const handleMouseLeaveNav = useCallback(() => {
    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current);
      enterTimeoutRef.current = null;
    }

    // Forgiving 120ms exit delay so mouse can traverse diagonally to menu cards
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    leaveTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 120);
  }, []);

  const handleMouseEnterMenu = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  }, []);

  const handleMouseLeaveMenu = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    leaveTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 120);
  }, []);

  const handleCloseMegaMenu = useCallback(() => {
    if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    setActiveMegaMenu(null);
  }, []);

  return (
    <>
      {/* 1. Main Sticky Header Shell */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-transform duration-300 ease-out",
          isVisible ? "translate-y-0" : "-translate-y-full",
          isAtTop && !activeMegaMenu
            ? "bg-white/85 backdrop-blur-md border-b border-transparent shadow-none"
            : "bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs",
          className,
        )}
        onMouseLeave={handleMouseLeaveNav}
      >
        <div className="app-container">
          <div className="flex items-center justify-between h-16">
            {/* Left: Typographic Brand Mark */}
            <NavBrand onClick={handleCloseMegaMenu} />

            {/* Center: Desktop Navigation Links with animated hover underlines */}
            <NavLinks
              activeMegaMenu={activeMegaMenu}
              onHoverLink={handleHoverLink}
              onLinkClick={handleCloseMegaMenu}
            />

            {/* Right: 4-Item Utility Bar (Search, Wishlist, Cart, Account, Mobile Toggle) */}
            <NavUtilityBar
              onOpenSearch={() => {
                handleCloseMegaMenu();
                setIsSearchOpen(true);
              }}
              isMobileMenuOpen={isMobileOpen}
              onToggleMobileMenu={() => {
                handleCloseMegaMenu();
                setIsMobileOpen((prev) => !prev);
              }}
            />
          </div>
        </div>

        {/* 2. Desktop Dual Mega Menu Panel */}
        <MegaMenu
          activeMenu={activeMegaMenu}
          onClose={handleCloseMegaMenu}
          onMouseEnterMenu={handleMouseEnterMenu}
          onMouseLeaveMenu={handleMouseLeaveMenu}
        />
      </header>

      {/* 3. Minimalist Full-Width Search Overlay Drawer */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* 4. Cinematic Full-Screen Mobile Navigation Overlay */}
      <MobileNavOverlay
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        onOpenSearch={() => {
          setIsMobileOpen(false);
          setIsSearchOpen(true);
        }}
      />
    </>
  );
}
