import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle2, Clock, Eye, TrendingUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnifiedCard, UnifiedCardHeader, UnifiedCardTitle, UnifiedCardContent } from '@/components/ui/UnifiedCard';
import { useCoreWebVitals } from '@/hooks/useCoreWebVitals';
import { cn } from '@/lib/utils';

interface WebVitalsMonitorProps {
  showInDevelopment?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export const WebVitalsMonitor: React.FC<WebVitalsMonitorProps> = ({
  showInDevelopment = true,
  position = 'bottom-right'
}) => {
  const [isMinimized, setIsMinimized] = useState(true);
  const { vitals, overallScore, recommendations, isLoading } = useCoreWebVitals();

  // Solo mostrar en desarrollo si está habilitado
  if (!showInDevelopment && process.env.NODE_ENV === 'development') {
    return null;
  }

  // En producción, solo mostrar si hay problemas de performance
  if (process.env.NODE_ENV === 'production' && overallScore > 70) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMetricColor = (rating?: string) => {
    switch (rating) {
      case 'good': return 'text-green-500';
      case 'needs-improvement': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getMetricIcon = (rating?: string) => {
    switch (rating) {
      case 'good': return CheckCircle2;
      case 'needs-improvement': return AlertTriangle;
      case 'poor': return X;
      default: return Clock;
    }
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  const formatValue = (name: string, value: number) => {
    if (name === 'cls') return value.toFixed(3);
    return `${Math.round(value)}ms`;
  };

  // Floating button
  if (isMinimized) {
    return (
      <motion.div
        className={cn(
          'fixed z-50',
          positionClasses[position]
        )}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Button
          onClick={() => setIsMinimized(false)}
          size="icon"
          className={cn(
            'h-12 w-12 rounded-full shadow-lg',
            overallScore >= 80 ? 'bg-green-500 hover:bg-green-600' :
            overallScore >= 50 ? 'bg-yellow-500 hover:bg-yellow-600' :
            'bg-red-500 hover:bg-red-600'
          )}
        >
          <Activity className="h-5 w-5 text-white" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(
        'fixed z-50 max-w-sm',
        positionClasses[position]
      )}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <UnifiedCard variant="glass" size="sm" className="border-2 shadow-2xl">
        <UnifiedCardHeader>
          <div className="flex items-center justify-between">
            <UnifiedCardTitle size="sm" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Core Web Vitals
            </UnifiedCardTitle>
            <Button
              onClick={() => setIsMinimized(true)}
              size="icon"
              variant="ghost"
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </UnifiedCardHeader>

        <UnifiedCardContent className="space-y-4">
          {/* Overall Score */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <span className="text-sm font-medium">Puntuación General</span>
            <span className={cn('text-lg font-bold', getScoreColor(overallScore))}>
              {isLoading ? '...' : `${overallScore}/100`}
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(vitals).map(([key, vital]) => {
              const Icon = getMetricIcon(vital?.rating);
              return (
                <div
                  key={key}
                  className="p-2 bg-muted/20 rounded-lg flex flex-col items-center text-center"
                >
                  <Icon className={cn('h-4 w-4 mb-1', getMetricColor(vital?.rating))} />
                  <span className="text-xs font-medium uppercase">{key}</span>
                  <span className="text-xs text-muted-foreground">
                    {vital ? formatValue(key, vital.value) : '...'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase">
                Recomendaciones
              </h4>
              <div className="space-y-1">
                {recommendations.slice(0, 2).map((rec, index) => (
                  <div key={index} className="text-xs text-muted-foreground leading-relaxed">
                    • {rec}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Development Tools */}
          {process.env.NODE_ENV === 'development' && (
            <div className="pt-2 border-t border-border/20">
              <Button
                onClick={() => {
                  // Open Lighthouse in dev tools
                  console.log('💡 Tip: Open DevTools > Lighthouse for detailed analysis');
                }}
                size="sm"
                variant="outline"
                className="w-full text-xs"
              >
                <Eye className="h-3 w-3 mr-1" />
                Analyze in Lighthouse
              </Button>
            </div>
          )}
        </UnifiedCardContent>
      </UnifiedCard>
    </motion.div>
  );
};

// Hook para monitoreo automático
export const useWebVitalsReporting = () => {
  const { vitals, overallScore } = useCoreWebVitals();

  React.useEffect(() => {
    // Reportar a analytics cuando tengamos datos
    if (process.env.NODE_ENV === 'production' && overallScore > 0) {
      // Google Analytics 4
      if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as unknown as Window & { gtag: (...args: unknown[]) => void }).gtag('event', 'web_vitals', {
          overall_score: overallScore,
          lcp_score: vitals.lcp?.value,
          fid_score: vitals.fid?.value,
          cls_score: vitals.cls?.value,
          fcp_score: vitals.fcp?.value,
          ttfb_score: vitals.ttfb?.value,
        });
      }

      // Vercel Analytics (si está disponible)
      if (typeof window !== 'undefined' && (window as Window & { va?: (...args: unknown[]) => void }).va) {
        (window as unknown as Window & { va: (...args: unknown[]) => void }).va('track', 'WebVitals', {
          overallScore,
          vitals: Object.fromEntries(
            Object.entries(vitals).map(([key, vital]) => [
              key, vital ? { value: vital.value, rating: vital.rating } : null
            ])
          )
        });
      }
    }
  }, [vitals, overallScore]);
};

// Componente para alertas críticas de performance
export const CriticalPerformanceAlert: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const { overallScore } = useCoreWebVitals();

  // Solo mostrar si hay problemas críticos
  const hasCriticalIssues = overallScore < 30 && overallScore > 0;

  if (!hasCriticalIssues || isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <UnifiedCard variant="subtle" size="sm" className="border-red-200 bg-red-50 dark:bg-red-950">
          <UnifiedCardContent className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Performance Issues Detected
              </p>
              <p className="text-xs text-red-600 dark:text-red-300">
                Score: {overallScore}/100 - Consider optimizing
              </p>
            </div>
            <Button
              onClick={() => setIsDismissed(true)}
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </UnifiedCardContent>
        </UnifiedCard>
      </motion.div>
    </AnimatePresence>
  );
};

export default WebVitalsMonitor;