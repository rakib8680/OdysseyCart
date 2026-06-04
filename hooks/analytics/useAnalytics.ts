"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAnalyticsData } from "@/app/actions/analytics";
import type { AnalyticsPeriod, AnalyticsData } from "@/lib/types/analytics";

const EMPTY_DATA: AnalyticsData = {
  revenue: [],
  orderVolume: [],
  topProducts: [],
  customerMetrics: {
    newCustomers: 0,
    returningCustomers: 0,
    totalCustomers: 0,
  },
};

/** Cache entries store data alongside a timestamp for stale-time checks */
interface CacheEntry {
  data: AnalyticsData;
  fetchedAt: number;
}

/** Data older than 5 minutes is considered stale and will be refetched */
const STALE_TIME = 5 * 60 * 1000;

/**
 * Custom hook that encapsulates ALL analytics data-fetching logic:
 *
 * 1. Per-period in-memory cache with 5-minute stale invalidation
 * 2. Automatic refetch on browser tab focus (if data is stale)
 * 3. Cache clears on unmount (page navigation) → always fresh on visit
 *
 * Mirrors React Query's (queryKey, staleTime, refetchOnWindowFocus)
 * pattern — making a future migration trivial (swap hook internals only).
 */
export function useAnalytics() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<AnalyticsPeriod>("30d");
  const [loading, setLoading] = useState(true);

  // Force re-render after cache update (useRef alone doesn't trigger re-renders)
  const [, forceUpdate] = useState(0);

  // Per-period cache with timestamps — survives re-renders, clears on unmount
  const cache = useRef<Partial<Record<AnalyticsPeriod, CacheEntry>>>({});

  // Track current period in a ref so the focus listener always reads the latest
  const periodRef = useRef(period);
  periodRef.current = period;

  // Active data for the current period (read from cache or fallback)
  const activeData = cache.current[period]?.data ?? EMPTY_DATA;

  const fetchPeriod = useCallback(
    async (selectedPeriod: AnalyticsPeriod, options?: { force?: boolean }) => {
      if (!user) return;

      const cached = cache.current[selectedPeriod];
      const isFresh =
        cached && Date.now() - cached.fetchedAt < STALE_TIME;

      // Skip fetch if cache is fresh (unless forced)
      if (isFresh && !options?.force) return;

      setLoading(true);
      const result = await getAnalyticsData(user.uid, selectedPeriod);
      if (result.success) {
        cache.current[selectedPeriod] = {
          data: result.data,
          fetchedAt: Date.now(),
        };
        forceUpdate((n) => n + 1);
      }
      setLoading(false);
    },
    [user],
  );

  // Fetch on mount and when period changes
  useEffect(() => {
    fetchPeriod(period);
  }, [period, fetchPeriod]);

  // Refetch active period when browser tab regains focus (if stale)
  useEffect(() => {
    const handleFocus = () => {
      fetchPeriod(periodRef.current);
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchPeriod]);

  return { data: activeData, loading, period, setPeriod };
}
