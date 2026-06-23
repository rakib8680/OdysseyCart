"use client";

import { useState, useEffect } from "react";

/**
 * Formats a timestamp into a human-readable relative string.
 * e.g. "just now", "1 min ago", "5 min ago", "1 hr ago"
 */
function formatRelativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 30) return "just now";
  if (seconds < 90) return "1 min ago";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "1 hr ago";
  return `${hours} hrs ago`;
}

/**
 * Returns a live-updating relative time string from a given timestamp.
 * Ticks every 30 seconds to keep the display fresh without excessive re-renders.
 */
export function useRelativeTime(timestamp: number): string {
  const [relative, setRelative] = useState(() => formatRelativeTime(timestamp));

  useEffect(() => {
    // Immediately sync when timestamp changes (e.g. after a re-fetch)
    setRelative(formatRelativeTime(timestamp));

    const interval = setInterval(() => {
      setRelative(formatRelativeTime(timestamp));
    }, 30_000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return relative;
}
