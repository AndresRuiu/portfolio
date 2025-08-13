import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface UseSmoothScrollingOptions {
  duration?: number;
  easing?: (t: number) => number;
}

export const useSmoothScrolling = (options: UseSmoothScrollingOptions = {}) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Configuración optimizada para diferentes dispositivos
    const lenis = new Lenis({
      duration: options.duration || 1.2,
      easing: options.easing || ((t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
    });

    lenisRef.current = lenis;

    // Función de animación
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Eventos personalizados
    lenis.on('scroll', (e: unknown) => {
      // Opcional: emitir eventos personalizados
      window.dispatchEvent(new CustomEvent('lenis-scroll', { detail: e }));
    });

    // Cleanup
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [
    options.duration,
    options.easing
  ]);

  // Métodos útiles
  const scrollTo = (target: string | number | HTMLElement, options?: Record<string, unknown>) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
    }
  };

  const start = () => {
    if (lenisRef.current) {
      lenisRef.current.start();
    }
  };

  const stop = () => {
    if (lenisRef.current) {
      lenisRef.current.stop();
    }
  };

  const resize = () => {
    if (lenisRef.current) {
      lenisRef.current.resize();
    }
  };

  return {
    lenis: lenisRef.current,
    scrollTo,
    start,
    stop,
    resize,
  };
};