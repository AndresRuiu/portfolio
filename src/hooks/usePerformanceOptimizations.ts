import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

// Simple throttle implementation
const throttle = <T extends (...args: any[]) => any>(func: T, delay: number) => {
  let lastCall = 0;
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return func(...args);
    }
  }) as T;
};

// Hook for memoized callbacks
export const useStableCallback = <T extends (...args: any[]) => any>(callback: T): T => {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback(((...args) => callbackRef.current(...args)) as T, []);
};

// Hook for debounced values
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for throttled callbacks
export const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const throttledCallback = useMemo(
    () => throttle(callback, delay),
    [callback, delay]
  );

  return throttledCallback as T;
};

// Hook for intersection observer
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options, hasIntersected]);

  return { isIntersecting, hasIntersected };
};

// Hook for performance monitoring
export const usePerformanceMonitor = () => {
  const startTime = useRef<number>();
  const measurements = useRef<{ [key: string]: number }>({});

  const startMeasure = useCallback((label: string) => {
    startTime.current = performance.now();
    measurements.current[`${label}_start`] = startTime.current;
  }, []);

  const endMeasure = useCallback((label: string) => {
    if (!startTime.current) return;
    
    const endTime = performance.now();
    const duration = endTime - startTime.current;
    measurements.current[label] = duration;
    
    // Log slow operations in development
    if (process.env.NODE_ENV === 'development' && duration > 100) {
      console.warn(`Slow operation detected: ${label} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }, []);

  const getMeasurements = useCallback(() => measurements.current, []);

  return { startMeasure, endMeasure, getMeasurements };
};

// Hook for memory-efficient list rendering
export const useVirtualizedList = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan = 3
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1).map((item, index) => ({
      item,
      index: visibleRange.startIndex + index,
    }));
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;

  return {
    visibleItems,
    totalHeight,
    visibleRange,
    setScrollTop,
  };
};

export default {
  useStableCallback,
  useDebounce,
  useThrottledCallback,
  useIntersectionObserver,
  usePerformanceMonitor,
  useVirtualizedList,
};