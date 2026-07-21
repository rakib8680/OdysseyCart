import { useState, useEffect, useCallback } from "react";

/**
 * A highly robust, persistent countdown hook.
 * Uses localStorage to ensure the countdown survives page refreshes,
 * preventing users from spamming rate-limited actions (like sending OTPs or emails).
 */
export function useCountdown(storageKey: string, initialSeconds: number) {
  const [countdown, setCountdown] = useState(0);

  // Initialize countdown on mount from localStorage
  useEffect(() => {
    const lastTriggered = localStorage.getItem(storageKey);
    if (lastTriggered) {
      const timePassed = Math.floor(
        (Date.now() - parseInt(lastTriggered, 10)) / 1000,
      );
      if (timePassed < initialSeconds) {
        setCountdown(initialSeconds - timePassed);
      }
    }
  }, [storageKey, initialSeconds]);

  // Handle the interval tick
  useEffect(() => {
    const isActive = countdown > 0;
    if (!isActive) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown > 0]); // Only re-run the effect when the active state changes

  const startCountdown = useCallback(() => {
    localStorage.setItem(storageKey, Date.now().toString());
    setCountdown(initialSeconds);
  }, [storageKey, initialSeconds]);

  return { countdown, startCountdown };
}
