import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useCallback } from 'react';

// Registrar ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export interface ScrollAnimationConfig {
  trigger?: string | Element | null;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
  toggleActions?: string;
  fastScrollEnd?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

/**
 * Hook para animaciones de scroll storytelling con GSAP ScrollTrigger
 */
export function useScrollAnimations() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Media queries para responsive
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Animación de entrada para secciones - Storytelling suave
   */
  const createSectionReveal = useCallback((
    selector: string | Element | null,
    config: ScrollAnimationConfig = {}
  ) => {
    if (prefersReducedMotion) {
      // Simple fade para reduced motion
      return gsap.set(selector, { opacity: 1 });
    }

    // Verificar que el elemento existe antes de crear la animación
    const element = typeof selector === 'string' 
      ? document.querySelector(selector) 
      : selector;
    
    if (!element) {
      console.warn(`GSAP target not found: ${selector}`);
      return null;
    }

    const defaultConfig: ScrollAnimationConfig = {
      start: "top 85%",
      end: "bottom 15%",
      toggleActions: "play none none reverse",
      ...config
    };

    return gsap.fromTo(element, 
      {
        opacity: 0,
        y: isMobile ? 30 : 60,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: isMobile ? 0.8 : 1.2,
        ease: "power3.out",
        stagger: isMobile ? 0.1 : 0.2,
        scrollTrigger: {
          trigger: config.trigger || element,
          ...defaultConfig
        }
      }
    );
  }, [isMobile, prefersReducedMotion]);

  /**
   * Animación de texto con revelación progresiva - SplitText opcional
   */
  const createTextReveal = useCallback((
    selector: string | Element | Element[] | null,
    config: ScrollAnimationConfig = {}
  ) => {
    if (prefersReducedMotion) {
      return gsap.set(selector, { opacity: 1 });
    }

    // Verificar que el elemento existe
    let elements: Element[] = [];
    
    if (typeof selector === 'string') {
      const found = document.querySelector(selector);
      if (found) elements = [found];
    } else if (Array.isArray(selector)) {
      elements = selector;
    } else if (selector instanceof Element) {
      elements = [selector];
    }
    
    if (elements.length === 0) {
      console.warn(`GSAP target not found: ${selector}`);
      return null;
    }

    const defaultConfig: ScrollAnimationConfig = {
      start: "top 80%",
      toggleActions: "play none none reverse",
      ...config
    };

    return gsap.fromTo(elements,
      {
        opacity: 0,
        y: 20,
        clipPath: "inset(0 100% 0 0)"
      },
      {
        opacity: 1,
        y: 0,
        clipPath: "inset(0 0% 0 0)",
        duration: 1,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: config.trigger || elements[0],
          ...defaultConfig
        }
      }
    );
  }, [prefersReducedMotion]);

  /**
   * Animación de grid/cards con stagger dinámico
   */
  const createGridReveal = useCallback((
    selector: string | Element | NodeList | null,
    config: ScrollAnimationConfig = {}
  ) => {
    if (prefersReducedMotion) {
      return gsap.set(selector, { opacity: 1 });
    }

    // Verificar que los elementos existen
    let elements: Element[] = [];
    
    if (typeof selector === 'string') {
      elements = Array.from(document.querySelectorAll(selector));
    } else if (selector instanceof NodeList) {
      elements = Array.from(selector as NodeListOf<Element>);
    } else if (selector instanceof Element) {
      elements = [selector];
    }
    
    if (elements.length === 0) {
      console.warn(`GSAP grid targets not found: ${selector}`);
      return null;
    }

    const defaultConfig: ScrollAnimationConfig = {
      start: "top 90%",
      toggleActions: "play none none reverse",
      ...config
    };

    return gsap.fromTo(elements,
      {
        opacity: 0,
        y: isMobile ? 40 : 80,
        rotationX: -15,
        transformOrigin: "center bottom"
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: isMobile ? 0.6 : 1,
        stagger: {
          amount: isMobile ? 0.3 : 0.6,
          grid: "auto",
          from: "start"
        },
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: config.trigger || elements[0],
          ...defaultConfig
        }
      }
    );
  }, [isMobile, prefersReducedMotion]);

  /**
   * Animación de contador/números con efecto typewriter
   */
  const createCounterAnimation = useCallback((
    selector: string | Element,
    targetNumber: number,
    config: ScrollAnimationConfig = {}
  ) => {
    if (prefersReducedMotion) {
      return gsap.set(selector, { textContent: targetNumber });
    }

    const element = typeof selector === 'string' 
      ? document.querySelector(selector) 
      : selector;
    
    if (!element) return;

    const obj = { count: 0 };
    
    return gsap.to(obj, {
      count: targetNumber,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        element.textContent = Math.floor(obj.count).toString();
      },
      scrollTrigger: {
        trigger: config.trigger || selector,
        start: "top 85%",
        toggleActions: "play none none reverse",
        ...config
      }
    });
  }, [prefersReducedMotion]);

  /**
   * Efecto magnético para elementos interactivos
   */
  const createMagneticHover = useCallback((selector: string | Element) => {
    if (isMobile || prefersReducedMotion) return;

    const elements = typeof selector === 'string' 
      ? document.querySelectorAll(selector)
      : [selector];

    elements.forEach(element => {
      if (!(element instanceof Element)) return;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * 0.1;
        const deltaY = (e.clientY - centerY) * 0.1;
        
        gsap.to(element, {
          x: deltaX,
          y: deltaY,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      const handleMouseLeave = () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)"
        });
      };

      element.addEventListener('mousemove', handleMouseMove as EventListener);
      element.addEventListener('mouseleave', handleMouseLeave as EventListener);

      return () => {
        element.removeEventListener('mousemove', handleMouseMove as EventListener);
        element.removeEventListener('mouseleave', handleMouseLeave as EventListener);
      };
    });
  }, [isMobile, prefersReducedMotion]);

  /**
   * Efecto parallax para títulos - Movimiento a 0.5x velocidad del scroll
   */
  const createParallaxTitle = useCallback((
    selector: string | Element | null,
    config: ScrollAnimationConfig & { speed?: number } = {}
  ) => {
    if (prefersReducedMotion || isMobile) {
      return gsap.set(selector, { y: 0 });
    }

    const element = typeof selector === 'string' 
      ? document.querySelector(selector) 
      : selector;
    
    if (!element) {
      console.warn(`GSAP parallax target not found: ${selector}`);
      return null;
    }

    const speed = config.speed || 0.5; // Default 0.5x speed

    // Add performance optimization class
    (element as HTMLElement).classList.add('parallax-optimized');

    return gsap.to(element, {
      yPercent: -50 * speed,
      ease: "none",
      force3D: true, // Force hardware acceleration
      scrollTrigger: {
        trigger: config.trigger || element,
        start: "top bottom",
        end: "bottom top",
        scrub: 1, // Smooth scrubbing for 60fps
        invalidateOnRefresh: true, // Better performance on resize
        ...config
      }
    });
  }, [prefersReducedMotion, isMobile]);

  /**
   * Limpieza de ScrollTriggers
   */
  const refreshScrollTrigger = useCallback(() => {
    ScrollTrigger.refresh();
  }, []);

  const killScrollTriggers = useCallback(() => {
    ScrollTrigger.getAll().forEach(st => st.kill());
  }, []);

  return {
    containerRef,
    isMobile,
    prefersReducedMotion,
    // Animaciones principales
    createSectionReveal,
    createTextReveal,
    createGridReveal,
    createCounterAnimation,
    createMagneticHover,
    createParallaxTitle,
    // Utilidades
    refreshScrollTrigger,
    killScrollTriggers,
    gsap,
    ScrollTrigger
  };
}

/**
 * Hook simplificado para secciones básicas
 */
export function useSectionAnimation(sectionRef: React.RefObject<HTMLElement>) {
  const { createSectionReveal, createTextReveal, createGridReveal } = useScrollAnimations();

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Animar el contenedor de la sección
    createSectionReveal(sectionRef.current);

    // Animar títulos dentro de la sección
    const titles = sectionRef.current.querySelectorAll('h1, h2, h3');
    if (titles.length > 0) {
      createTextReveal(Array.from(titles));
    }

    // Animar cards/grid dentro de la sección
    const cards = sectionRef.current.querySelectorAll('.unified-card, .card, [class*="card"]');
    if (cards.length > 0) {
      createGridReveal(cards);
    }

  }, { scope: sectionRef });

  return { createSectionReveal, createTextReveal, createGridReveal };
}