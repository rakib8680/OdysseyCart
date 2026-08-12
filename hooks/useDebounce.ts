import { useState, useEffect, useRef, useCallback } from "react";

/**
 * A custom hook that returns a debounced version of the provided value.
 * Useful for delaying search queries or API calls until the user stops typing.
 *
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 *custom hook that returns a debounced callback function.
 * Encapsulates timeout lifecycle management and provides a `.cancel()` method
 * to cleanly prevent pending executions during external state changes.
 *
 * @param callback The function to debounce
 * @param delay Delay in milliseconds
 */
export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) {
  const callbackRef = useRef(callback);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep callback reference updated without re-creating debounced function
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cancel any pending timer
  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Construct debounced function with attached .cancel() method
  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      cancel();
      timerRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay, cancel]
  ) as T & { cancel: () => void };

  debouncedFn.cancel = cancel;

  // Auto-cancel on unmount
  useEffect(() => {
    return cancel;
  }, [cancel]);

  return debouncedFn;
}
