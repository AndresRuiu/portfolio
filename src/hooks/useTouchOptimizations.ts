import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useGesture } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/web';

// Hook principal para optimizaciones táctiles
export const useTouchOptimizations = () => {
  const [device, setDevice] = useState({
    isMobile: false,
    isTablet: false,
    hasTouch: false,
    orientation: 'portrait' as 'portrait' | 'landscape',
    viewportHeight: window.innerHeight,
    safeAreaTop: 0,
    safeAreaBottom: 0,
  });

  useEffect(() => {
    // Detectar dispositivo y capacidades
    const updateDevice = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isTablet = /(iPad|Android.*\b(?:tablet|Tab)|Windows.*Touch)/i.test(navigator.userAgent);
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Detectar safe areas (notches, etc.)
      const computedStyle = getComputedStyle(document.documentElement);
      const safeAreaTop = parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0');
      const safeAreaBottom = parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0');

      setDevice({
        isMobile,
        isTablet,
        hasTouch,
        orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
        viewportHeight: window.innerHeight,
        safeAreaTop,
        safeAreaBottom,
      });
    };

    updateDevice();

    // Listeners para cambios
    window.addEventListener('resize', updateDevice);
    window.addEventListener('orientationchange', updateDevice);

    return () => {
      window.removeEventListener('resize', updateDevice);
      window.removeEventListener('orientationchange', updateDevice);
    };
  }, []);

  return device;
};

// Hook para gestos táctiles con react-use-gesture
export const useSwipeGesture = (options: {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  enableHaptics?: boolean;
}) => {
  const { 
    onSwipeLeft, 
    onSwipeRight, 
    onSwipeUp, 
    onSwipeDown, 
    threshold = 50,
    enableHaptics = true 
  } = options;

  const triggerHaptics = useCallback(() => {
    if (enableHaptics && 'vibrate' in navigator) {
      navigator.vibrate(10); // Vibración suave
    }
  }, [enableHaptics]);

  const bind = useGesture({
    onDrag: ({ offset: [ox, oy], direction: [dx, dy], velocity: [vx, vy], last }) => {
      if (!last) return;

      // Solo activar si el movimiento es suficientemente rápido o largo
      const isQuick = Math.abs(vx) > 0.5 || Math.abs(vy) > 0.5;
      const isLong = Math.abs(ox) > threshold || Math.abs(oy) > threshold;

      if (!isQuick && !isLong) return;

      // Determinar dirección predominante
      if (Math.abs(ox) > Math.abs(oy)) {
        // Movimiento horizontal
        if (dx > 0 && onSwipeRight) {
          triggerHaptics();
          onSwipeRight();
        } else if (dx < 0 && onSwipeLeft) {
          triggerHaptics();
          onSwipeLeft();
        }
      } else {
        // Movimiento vertical
        if (dy > 0 && onSwipeDown) {
          triggerHaptics();
          onSwipeDown();
        } else if (dy < 0 && onSwipeUp) {
          triggerHaptics();
          onSwipeUp();
        }
      }
    },
  });

  return bind;
};

// Hook para pull-to-refresh
export const usePullToRefresh = (onRefresh: () => Promise<void>) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  
  const [{ y }, api] = useSpring(() => ({ y: 0 }));

  const bind = useGesture({
    onDrag: ({ offset: [, oy], direction: [, dy], last }) => {
      // Solo activar en scroll hacia arriba desde el top
      if (window.scrollY > 0) return;
      
      const pullThreshold = 80;
      const maxPull = 120;
      
      if (dy > 0 && oy > 0) { // Pull down
        const distance = Math.min(oy, maxPull);
        setPullDistance(distance);
        api.start({ y: distance });
        
        if (last) {
          if (distance > pullThreshold && !isRefreshing) {
            setIsRefreshing(true);
            onRefresh().finally(() => {
              setIsRefreshing(false);
              setPullDistance(0);
              api.start({ y: 0 });
            });
          } else {
            setPullDistance(0);
            api.start({ y: 0 });
          }
        }
      }
    }
  });

  const PullIndicator = () => {
    return React.createElement(animated.div, {
      style: { y },
      className: 'fixed top-0 left-0 right-0 z-50 bg-primary/10 backdrop-blur-sm'
    }, React.createElement('div', {
      className: 'container mx-auto px-4 py-2 text-center'
    }, pullDistance > 80 ? (
      isRefreshing ? 
        React.createElement('span', { className: 'text-sm text-primary' }, 'Actualizando...') :
        React.createElement('span', { className: 'text-sm text-primary' }, 'Suelta para actualizar')
    ) : React.createElement('span', { className: 'text-sm text-muted-foreground' }, 'Desliza hacia abajo')));
  };

  return {
    bind,
    isRefreshing,
    PullIndicator,
  };
};

// Hook para navegación por gestos en carrusel
export const useCarouselGestures = (itemCount: number, onChange: (index: number) => void) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  const goToSlide = useCallback((index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, itemCount - 1));
    setCurrentIndex(clampedIndex);
    api.start({ x: -clampedIndex * 100 });
    onChange(clampedIndex);
  }, [itemCount, api, onChange]);

  const bind = useGesture({
    onDrag: ({ offset: [ox], direction: [dx], last, velocity: [vx] }) => {
      const threshold = 50;
      const isQuick = Math.abs(vx) > 0.5;
      
      if (last) {
        if ((ox < -threshold || (dx < 0 && isQuick)) && currentIndex < itemCount - 1) {
          goToSlide(currentIndex + 1);
        } else if ((ox > threshold || (dx > 0 && isQuick)) && currentIndex > 0) {
          goToSlide(currentIndex - 1);
        } else {
          // Volver a posición original
          api.start({ x: -currentIndex * 100 });
        }
      } else {
        // Arrastrar en tiempo real
        const dragOffset = ox / window.innerWidth * 100;
        api.start({ x: -currentIndex * 100 + dragOffset });
      }
    }
  });

  return {
    bind,
    currentIndex,
    goToSlide,
    style: { x: x.to(x => `${x}%`) },
  };
};

// Hook para tap optimization (evitar delay de 300ms)
export const useFastTap = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let touchStartTime = 0;
    let touchStartPos = { x: 0, y: 0 };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartTime = Date.now();
      const touch = e.touches[0];
      touchStartPos = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartTime;
      
      // Solo si fue un tap rápido y no un drag
      if (touchDuration < 200 && touchDuration > 10) {
        const touch = e.changedTouches[0];
        const distance = Math.sqrt(
          Math.pow(touch.clientX - touchStartPos.x, 2) +
          Math.pow(touch.clientY - touchStartPos.y, 2)
        );
        
        // Si no se movió mucho, simular click
        if (distance < 10) {
          e.preventDefault();
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          element.dispatchEvent(clickEvent);
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return ref;
};

// Hook para optimizar el viewport en móvil
export const useViewportOptimization = () => {
  const [viewportInfo, setViewportInfo] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isStandalone: false,
    isFullscreen: false,
  });

  useEffect(() => {
    const updateViewport = () => {
      // Detectar si está en modo standalone (PWA)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone ||
                          document.referrer.includes('android-app://');

      // Detectar fullscreen
      const isFullscreen = document.fullscreenElement !== null;

      setViewportInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        isStandalone,
        isFullscreen,
      });
    };

    updateViewport();

    // Listeners
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);
    document.addEventListener('fullscreenchange', updateViewport);

    // Fix para Safari mobile viewport height
    const setVHProperty = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    
    setVHProperty();
    window.addEventListener('resize', setVHProperty);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
      document.removeEventListener('fullscreenchange', updateViewport);
      window.removeEventListener('resize', setVHProperty);
    };
  }, []);

  return viewportInfo;
};

// Hook para manejo de scroll momentum en iOS
export const useIOSScrollFix = () => {
  useEffect(() => {
    // Aplicar -webkit-overflow-scrolling: touch para smooth scrolling en iOS
    const style = document.createElement('style');
    style.textContent = `
      .ios-scroll {
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
      }
      
      /* Fix para prevent scroll chaining */
      .prevent-scroll-chaining {
        overscroll-behavior: contain;
      }
      
      /* Fix para bounce effect */
      body {
        overscroll-behavior-y: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
};

// Hook para detectar y optimizar touch targets
export const useTouchTargetOptimization = () => {
  useEffect(() => {
    const optimizeTouchTargets = () => {
      // Encontrar elementos interactivos pequeños
      const interactiveElements = document.querySelectorAll('button, a, input, [role="button"]');
      
      interactiveElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const minSize = 44; // Tamaño mínimo recomendado por Apple
        
        if (rect.width < minSize || rect.height < minSize) {
          (element as HTMLElement).style.minWidth = `${minSize}px`;
          (element as HTMLElement).style.minHeight = `${minSize}px`;
          (element as HTMLElement).classList.add('touch-target-optimized');
        }
      });
    };

    // Optimizar al cargar y en cambios dinámicos
    optimizeTouchTargets();
    
    const observer = new MutationObserver(optimizeTouchTargets);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);
};

// Hook para feedback háptico inteligente
export const useHapticFeedback = () => {
  const triggerFeedback = useCallback((type: 'light' | 'medium' | 'heavy' | 'selection' | 'error' = 'light') => {
    if (!('vibrate' in navigator)) return;

    const patterns = {
      light: 10,
      medium: 25,
      heavy: 50,
      selection: [10, 50, 10],
      error: [50, 100, 50, 100, 50]
    };

    navigator.vibrate(patterns[type]);
  }, []);

  const onSuccess = useCallback(() => triggerFeedback('selection'), [triggerFeedback]);
  const onError = useCallback(() => triggerFeedback('error'), [triggerFeedback]);
  const onTap = useCallback(() => triggerFeedback('light'), [triggerFeedback]);

  return {
    triggerFeedback,
    onSuccess,
    onError,
    onTap,
  };
};