"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, Sparkles, Truck, ShieldCheck } from "lucide-react";
import { STORAGE_KEYS } from "@/lib/constants/storage";

interface Announcement {
  id: string;
  icon: typeof Sparkles;
  highlight: string;
  text: string;
  linkText: string;
  href: string;
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "shipping",
    icon: Truck,
    highlight: "Free Worldwide Express",
    text: "on all premium orders over $100",
    linkText: "Shop Now",
    href: "/items",
  },
  {
    id: "new-drop",
    icon: Sparkles,
    highlight: "New Season 2026",
    text: "architectural essentials just dropped",
    linkText: "Explore Drops",
    href: "/items?sort=newest",
  },
  {
    id: "guarantee",
    icon: ShieldCheck,
    highlight: "Lifetime Warranty",
    text: "uncompromising craftsmanship with 30-day returns",
    linkText: "Our Story",
    href: "/about",
  },
];

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isHoveredRef = useRef(false);

  // Check localStorage dismissal on mount
  useEffect(() => {
    setIsMounted(true);
    const dismissed = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENT_DISMISSED);
    if (dismissed === "true") {
      setIsDismissed(true);
    }
  }, []);

  // Auto-rotate every 5 seconds (paused on hover)
  useEffect(() => {
    if (isDismissed) return;

    const timer = setInterval(() => {
      if (!isHoveredRef.current) {
        setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENT_DISMISSED, "true");
    } catch (e) {
      console.warn("Could not save announcement dismissal preference:", e);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  if (isMounted && isDismissed) {
    return null;
  }

  const current = ANNOUNCEMENTS[currentIndex];
  const Icon = current.icon;

  return (
    <aside
      aria-label="Promotional announcement"
      className="relative z-40 w-full bg-slate-950 text-slate-300 border-b border-slate-800/80 transition-all duration-300 ease-in-out"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-xs font-medium">
        {/* Previous button (desktop) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous announcement"
          className="hidden md:flex p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Message Content Container */}
        <div className="flex-1 flex items-center justify-center gap-2 text-center overflow-hidden min-h-5.5">
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400 shrink-0">
            <Icon className="w-3.5 h-3.5 text-emerald-400" />
            <span>{current.highlight}</span>
          </span>

          <span className="hidden sm:inline text-slate-300">
            — {current.text}
          </span>

          <Link
            href={current.href}
            className="ml-1 inline-flex items-center font-bold text-white hover:text-emerald-300 underline underline-offset-2 transition-colors shrink-0"
          >
            {current.linkText} →
          </Link>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Next button (desktop) */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next announcement"
            className="hidden md:flex p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss announcement"
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
