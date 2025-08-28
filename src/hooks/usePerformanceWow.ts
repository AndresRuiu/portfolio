import { useEffect, useCallback, useRef } from 'react';

/**
 * Performance optimization utilities for wow effects
 * Ensures smooth 60fps animations and minimal resource usage
 */
export function usePerformanceWow() {
  const rafId = useRef<number>();
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Device detection for optimization
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isLowEndDevice = typeof window !== 'undefined' && 
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);

  /**
   * Throttled function executor using requestAnimationFrame
   */
  const throttleRAF = useCallback((callback: () => void) => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    
    rafId.current = requestAnimationFrame(callback);
  }, []);

  /**
   * Optimized scroll listener
   */
  const addOptimizedScrollListener = useCallback((
    callback: (event: Event) => void,
    options?: AddEventListenerOptions
  ) => {
    if (prefersReducedMotion) return () => {};

    const throttledCallback = (event: Event) => {
      throttleRAF(() => callback(event));
    };

    window.addEventListener('scroll', throttledCallback, {
      passive: true,
      ...options
    });

    return () => {
      window.removeEventListener('scroll', throttledCallback);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [throttleRAF, prefersReducedMotion]);

  /**
   * Optimized mouse move listener
   */
  const addOptimizedMouseListener = useCallback((
    element: Element,
    callback: (event: MouseEvent) => void
  ) => {
    if (prefersReducedMotion || isMobile) return () => {};

    const throttledCallback = (event: MouseEvent) => {
      throttleRAF(() => callback(event));
    };

    element.addEventListener('mousemove', throttledCallback as EventListener, { passive: true });

    return () => {
      element.removeEventListener('mousemove', throttledCallback as EventListener);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [throttleRAF, prefersReducedMotion, isMobile]);

  /**
   * Force hardware acceleration on element
   */
  const forceHardwareAcceleration = useCallback((element: Element) => {
    const htmlElement = element as HTMLElement;
    htmlElement.style.transform = 'translateZ(0)';
    htmlElement.style.backfaceVisibility = 'hidden';
    htmlElement.style.perspective = '1000px';
    htmlElement.style.willChange = 'transform';
  }, []);

  /**
   * Remove hardware acceleration when not needed
   */
  const removeHardwareAcceleration = useCallback((element: Element) => {
    const htmlElement = element as HTMLElement;
    htmlElement.style.willChange = 'auto';
  }, []);

  /**
   * Optimized CSS class management
   */
  const addPerformanceClasses = useCallback((element: Element) => {
    element.classList.add('performance-optimized', 'gpu-accelerated');
  }, []);

  /**
   * Check if animations should be enabled
   */
  const shouldAnimate = useCallback(() => {
    return !prefersReducedMotion && !isLowEndDevice;
  }, [prefersReducedMotion, isLowEndDevice]);

  /**
   * Get optimal animation duration based on device
   */
  const getOptimalDuration = useCallback((baseDuration: number) => {
    if (isMobile) return baseDuration * 0.7; // Faster on mobile
    if (isLowEndDevice) return baseDuration * 0.8; // Slightly faster on low-end devices
    return baseDuration;
  }, [isMobile, isLowEndDevice]);

  /**
   * Get optimal stagger delay based on device
   */
  const getOptimalStagger = useCallback((baseStagger: number) => {
    if (isMobile) return baseStagger * 0.5; // Less stagger on mobile
    if (isLowEndDevice) return baseStagger * 0.6;
    return baseStagger;
  }, [isMobile, isLowEndDevice]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return {
    // Performance checks
    prefersReducedMotion,
    isMobile,
    isLowEndDevice,
    shouldAnimate,
    
    // Optimized listeners
    addOptimizedScrollListener,
    addOptimizedMouseListener,
    throttleRAF,
    
    // Hardware acceleration
    forceHardwareAcceleration,
    removeHardwareAcceleration,
    addPerformanceClasses,
    
    // Optimal timing
    getOptimalDuration,
    getOptimalStagger
  };
}

/**
 * Hook for monitoring performance metrics
 */
export function usePerformanceMonitor() {
  const frameRate = useRef<number>(60);
  const lastFrameTime = useRef<number>(performance.now());
  
  const measureFrameRate = useCallback(() => {
    const now = performance.now();
    const delta = now - lastFrameTime.current;
    frameRate.current = 1000 / delta;
    lastFrameTime.current = now;
    
    // If frame rate drops below 45fps, suggest reducing effects
    if (frameRate.current < 45) {
      console.warn('Low frame rate detected:', frameRate.current.toFixed(1), 'fps');
      return false; // Suggest disabling heavy effects
    }
    
    return true; // Frame rate is good
  }, []);

  return {
    frameRate: frameRate.current,
    measureFrameRate
  };
}

export default usePerformanceWow;