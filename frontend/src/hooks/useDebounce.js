import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Debounce a value by a specified delay.
 * Useful for search inputs, filter changes, etc.
 * @param {*} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 300)
 * @returns {*} Debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Debounce a callback function.
 * The callback will only be called after the specified delay
 * since the last invocation.
 * @param {Function} callback - The function to debounce
 * @param {number} delay - Delay in milliseconds (default: 300)
 * @returns {Function} Debounced callback
 */
export function useDebouncedCallback(callback, delay = 300) {
  const timerRef = useRef(null);
  const callbackRef = useRef(callback);

  // Update ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const debouncedFn = useCallback(
    (...args) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );

  return debouncedFn;
}

/**
 * Throttle a callback function.
 * Ensures the callback is called at most once per specified interval.
 * @param {Function} callback - The function to throttle
 * @param {number} interval - Minimum interval in milliseconds (default: 300)
 * @returns {Function} Throttled callback
 */
export function useThrottledCallback(callback, interval = 300) {
  const lastCallRef = useRef(0);
  const timerRef = useRef(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const throttledFn = useCallback(
    (...args) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallRef.current;

      if (timeSinceLastCall >= interval) {
        lastCallRef.current = now;
        callbackRef.current(...args);
      } else if (!timerRef.current) {
        timerRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          timerRef.current = null;
          callbackRef.current(...args);
        }, interval - timeSinceLastCall);
      }
    },
    [interval]
  );

  return throttledFn;
}

export default useDebounce;
