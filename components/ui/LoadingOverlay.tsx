"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

export interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  icon?: ReactNode;
  /** Additional container classes */
  className?: string;
  /** Whether to enable backdrop blur */
  blur?: boolean;
  /** Whether the spinner pill stays sticky in viewport while scrolling tall content */
  sticky?: boolean;
}

/**
 * Reusable, centralized loading overlay component.
 */
export function LoadingOverlay({
  isLoading,
  message = "Updating...",
  icon,
  className,
  blur = true,
  sticky = true,
}: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          role="status"
          aria-live="polite"
          className={cn(
            "absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-start rounded-2xl overflow-hidden",
            blur ? "bg-white/45 backdrop-blur-[1px]" : "bg-white/40",
            className,
          )}
        >
          <div
            className={cn(
              "w-full flex items-center justify-center pointer-events-auto",
              sticky ? "sticky top-36 sm:top-44 pt-8 sm:pt-12" : "py-12",
            )}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: -4 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 border border-slate-200/90 text-slate-800 text-xs sm:text-sm font-semibold shadow-lg shadow-slate-900/5 backdrop-blur-md"
            >
              {icon || <Spinner className="w-4 h-4 text-slate-900 shrink-0" />}
              <span>{message}</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
