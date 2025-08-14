import { useEffect, useRef, useState } from 'react';

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface WebVitalsData {
  fcp: WebVitalMetric | null; // First Contentful Paint
  lcp: WebVitalMetric | null; // Largest Contentful Paint
  fid: WebVitalMetric | null; // First Input Delay
  cls: WebVitalMetric | null; // Cumulative Layout Shift
  ttfb: WebVitalMetric | null; // Time to First Byte
  inp: WebVitalMetric | null; // Interaction to Next Paint
}

// Rating thresholds based on Google's Core Web Vitals
const thresholds = {
  fcp: { good: 1800, poor: 3000 }, // milliseconds
  lcp: { good: 2500, poor: 4000 }, // milliseconds
  fid: { good: 100, poor: 300 },   // milliseconds
  cls: { good: 0.1, poor: 0.25 },  // layout shift score
  ttfb: { good: 800, poor: 1800 }, // milliseconds
  inp: { good: 200, poor: 500 },   // milliseconds
};

const getRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
  const threshold = thresholds[name as keyof typeof thresholds];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
};

export const useCoreWebVitals = () => {
  const [vitals, setVitals] = useState<WebVitalsData>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    inp: null,
  });
  
  const observerRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    const updateVital = (name: string, value: number) => {
      const metric: WebVitalMetric = {
        name,
        value,
        rating: getRating(name, value),
        timestamp: Date.now(),
      };

      setVitals(prev => ({
        ...prev,
        [name]: metric,
      }));

      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔍 ${name.toUpperCase()}: ${value}ms (${metric.rating})`);
      }

      // Send to analytics in production
      if (process.env.NODE_ENV === 'production' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as unknown as Window & { gtag: (...args: unknown[]) => void }).gtag('event', name, {
          custom_parameter_1: value,
          custom_parameter_2: metric.rating,
        });
      }
    };

    // Measure FCP (First Contentful Paint)
    const measureFCP = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          updateVital('fcp', fcpEntry.startTime);
          observer.disconnect();
        }
      });
      observer.observe({ entryTypes: ['paint'] });
    };

    // Measure LCP (Largest Contentful Paint)
    const measureLCP = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          updateVital('lcp', lastEntry.startTime);
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Disconnect when page becomes hidden
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          observer.disconnect();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange, { once: true });
    };

    // Measure FID (First Input Delay)
    const measureFID = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fidEntry = entries[0];
        if (fidEntry) {
          updateVital('fid', (fidEntry as PerformanceEventTiming & { processingStart: number }).processingStart - fidEntry.startTime);
          observer.disconnect();
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
    };

    // Measure CLS (Cumulative Layout Shift)
    const measureCLS = () => {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: PerformanceEntry) => {
          const layoutShiftEntry = entry as PerformanceEntry & {
            hadRecentInput?: boolean;
            value?: number;
          };
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value || 0;
          }
        });
        updateVital('cls', clsValue);
      });
      observer.observe({ entryTypes: ['layout-shift'] });

      // Report final CLS when page becomes hidden
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          updateVital('cls', clsValue);
          observer.disconnect();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange, { once: true });
    };

    // Measure TTFB (Time to First Byte)
    const measureTTFB = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.fetchStart;
        updateVital('ttfb', ttfb);
      }
    };

    // Measure INP (Interaction to Next Paint) - experimental
    const measureINP = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: PerformanceEntry) => {
          const eventEntry = entry as PerformanceEntry & {
            interactionId?: number;
            processingEnd?: number;
          };
          if (eventEntry.interactionId) {
            const inp = (eventEntry.processingEnd || 0) - entry.startTime;
            updateVital('inp', inp);
          }
        });
      });
      
      try {
        observer.observe({ entryTypes: ['event'] });
      } catch {
        // INP might not be supported in all browsers
        console.warn('INP measurement not supported');
      }
    };

    // Initialize measurements
    measureTTFB();
    measureFCP();
    measureLCP();
    measureFID();
    measureCLS();
    measureINP();

    // Cleanup
    return () => {
      const currentObserver = observerRef.current;
      currentObserver?.disconnect();
    };
  }, []);

  // Calculate overall performance score
  const getOverallScore = (): number => {
    const scores = Object.values(vitals).filter(Boolean).map(vital => {
      if (!vital) return 0;
      switch (vital.rating) {
        case 'good': return 90;
        case 'needs-improvement': return 50;
        case 'poor': return 10;
        default: return 0;
      }
    });
    
    return scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;
  };

  // Get recommendations based on metrics
  const getRecommendations = (): string[] => {
    const recommendations: string[] = [];
    
    if (vitals.lcp && vitals.lcp.rating !== 'good') {
      recommendations.push('Optimize images and server response times to improve LCP');
    }
    
    if (vitals.fid && vitals.fid.rating !== 'good') {
      recommendations.push('Reduce JavaScript execution time to improve FID');
    }
    
    if (vitals.cls && vitals.cls.rating !== 'good') {
      recommendations.push('Set size attributes on images and avoid inserting content above existing content');
    }
    
    if (vitals.fcp && vitals.fcp.rating !== 'good') {
      recommendations.push('Eliminate render-blocking resources to improve FCP');
    }

    return recommendations;
  };

  return {
    vitals,
    overallScore: getOverallScore(),
    recommendations: getRecommendations(),
    isLoading: Object.values(vitals).every(v => v === null),
  };
};

export default useCoreWebVitals;