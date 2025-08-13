import { useEffect, useCallback, useRef, useState } from 'react';

// Hook para optimizaciones táctiles
export const useTouchOptimizations = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [touchSupported, setTouchSupported] = useState(false);

  useEffect(() => {
    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') return;

    try {
      // Detectar si es un dispositivo táctil
      const checkTouchSupport = () => {
        return 'ontouchstart' in window || 
               navigator.maxTouchPoints > 0 || 
               (navigator as any).msMaxTouchPoints > 0;
      };

      setTouchSupported(checkTouchSupport());
      setIsTouchDevice(checkTouchSupport());

      // Detectar primer toque para confirmar dispositivo táctil
      const handleFirstTouch = () => {
        setIsTouchDevice(true);
        document.removeEventListener('touchstart', handleFirstTouch);
      };

      document.addEventListener('touchstart', handleFirstTouch, { passive: true });

      return () => {
        document.removeEventListener('touchstart', handleFirstTouch);
      };
    } catch (error) {
      console.warn('Error initializing touch optimizations:', error);
    }
  }, []);

  return {
    isTouchDevice,
    touchSupported,
  };
};

// Hook para gestos táctiles básicos
export const useSwipeGesture = (
  element: React.RefObject<HTMLElement>,
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void
) => {
  const startPos = useRef({ x: 0, y: 0 });
  const endPos = useRef({ x: 0, y: 0 });

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const touch = e.changedTouches[0];
    endPos.current = { x: touch.clientX, y: touch.clientY };

    const deltaX = endPos.current.x - startPos.current.x;
    const deltaY = endPos.current.y - startPos.current.y;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Swipe horizontal
      if (Math.abs(deltaX) > minSwipeDistance) {
        onSwipe?.(deltaX > 0 ? 'right' : 'left');
      }
    } else {
      // Swipe vertical
      if (Math.abs(deltaY) > minSwipeDistance) {
        onSwipe?.(deltaY > 0 ? 'down' : 'up');
      }
    }
  }, [onSwipe]);

  useEffect(() => {
    const el = element.current;
    if (!el) return;

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [element, handleTouchStart, handleTouchEnd]);
};

// Hook para prevenir zoom accidental
export const usePreventZoom = (element: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const el = element.current;
    if (!el) return;

    let lastTouchEnd = 0;

    const handleTouchEnd = (e: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    el.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [element]);
};

// Hook para mejorar el rendimiento en dispositivos móviles
export const useMobilePerformance = () => {
  useEffect(() => {
    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') return;

    try {
      // Aplicar optimizaciones CSS para móviles
      const style = document.createElement('style');
      style.textContent = `
        @media (max-width: 768px) {
          * {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
          }
          
          .motion-reduce {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `;
      
      document.head.appendChild(style);

      // Reducir complejidad de animaciones en móviles
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        document.body.classList.add('mobile-device');
      }

      return () => {
        if (style.parentNode) {
          document.head.removeChild(style);
        }
        document.body.classList.remove('mobile-device');
      };
    } catch (error) {
      console.warn('Error applying mobile optimizations:', error);
    }
  }, []);
};