import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook for infinite scroll functionality.
 * Uses IntersectionObserver to detect when a sentinel element becomes visible.
 * 
 * @param {Object} options
 * @param {Function} options.onLoadMore - Callback when more data should be loaded
 * @param {boolean} options.hasMore - Whether there is more data to load
 * @param {boolean} options.isLoading - Whether data is currently being loaded
 * @param {number} options.threshold - Intersection threshold (0-1)
 * @param {string} options.rootMargin - Root margin for IntersectionObserver
 * @returns {Object} { sentinelRef, containerRef, isIntersecting }
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore = false,
  isLoading = false,
  threshold = 0.1,
  rootMargin = '100px',
}) {
  const sentinelRef = useRef(null);
  const containerRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef(null);

  const handleIntersection = useCallback(
    (entries) => {
      const [entry] = entries;
      setIsIntersecting(entry.isIntersecting);

      if (entry.isIntersecting && hasMore && !isLoading) {
        onLoadMore?.();
      }
    },
    [onLoadMore, hasMore, isLoading]
  );

  useEffect(() => {
    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
      root: containerRef.current,
    });

    observerRef.current.observe(sentinel);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [handleIntersection, threshold, rootMargin]);

  return {
    sentinelRef,
    containerRef,
    isIntersecting,
  };
}

/**
 * Scroll to top of a container smoothly
 * @param {React.RefObject} containerRef - Ref to the scrollable container
 */
export function scrollToTop(containerRef) {
  if (containerRef?.current) {
    containerRef.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}

/**
 * Check if user has scrolled near the bottom of an element
 * @param {HTMLElement} element - The scrollable element
 * @param {number} offset - Distance from bottom in pixels (default: 50)
 * @returns {boolean}
 */
export function isNearBottom(element, offset = 50) {
  if (!element) return false;
  const { scrollTop, scrollHeight, clientHeight } = element;
  return scrollHeight - scrollTop - clientHeight < offset;
}

export default useInfiniteScroll;
