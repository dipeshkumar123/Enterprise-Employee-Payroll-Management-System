import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Generic IntersectionObserver hook for lazy loading images,
 * visibility tracking, animations on scroll, etc.
 * 
 * @param {Object} options
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.rootMargin - CSS margin string
 * @param {boolean} options.triggerOnce - Only trigger once (default: true)
 * @returns {Object} { ref, isIntersecting, entry }
 */
export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
} = {}) {
  const ref = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState(null);
  const hasTriggered = useRef(false);

  const callback = useCallback(
    (entries) => {
      const [entry] = entries;
      setEntry(entry);

      if (entry.isIntersecting) {
        setIsIntersecting(true);
        if (triggerOnce) {
          hasTriggered.current = true;
        }
      } else if (!triggerOnce) {
        setIsIntersecting(false);
      }
    },
    [triggerOnce]
  );

  useEffect(() => {
    const node = ref.current;
    if (!node || hasTriggered.current) return;

    const observer = new IntersectionObserver(callback, {
      threshold,
      rootMargin,
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [callback, threshold, rootMargin]);

  return { ref, isIntersecting, entry };
}

/**
 * Hook to lazy load a component or image when it enters the viewport.
 * @param {Object} options - Same as useIntersectionObserver
 * @returns {Object} { ref, shouldRender, isIntersecting }
 */
export function useLazyLoad(options = {}) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0,
    rootMargin: '200px',
    triggerOnce: true,
    ...options,
  });

  return { ref, shouldRender: isIntersecting, isIntersecting };
}

export default useIntersectionObserver;
