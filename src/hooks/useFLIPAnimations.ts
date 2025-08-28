import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { useRef, useCallback } from 'react';

// Registrar plugin Flip
gsap.registerPlugin(Flip);

export interface FLIPConfig {
  duration?: number;
  ease?: string;
  scale?: boolean;
  simple?: boolean;
  absolute?: boolean;
  spin?: boolean;
  fade?: boolean;
  onStart?: () => void;
  onComplete?: () => void;
}

/**
 * Hook especializado para animaciones FLIP cinematográficas
 * Maneja transiciones suaves entre layouts y estados
 */
export function useFLIPAnimations() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Media queries para responsive
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Animación FLIP para layout transitions
   * Perfecto para grid a modal, modal a grid, etc.
   */
  const createFLIPTransition = useCallback((
    elements: string | Element | Element[],
    callback: () => void,
    config: FLIPConfig = {}
  ) => {
    if (prefersReducedMotion) {
      callback();
      return;
    }

    const defaultConfig: FLIPConfig = {
      duration: isMobile ? 0.6 : 1,
      ease: "power2.inOut",
      scale: true,
      simple: false,
      absolute: false,
      ...config
    };

    // Capturar estado inicial
    const state = Flip.getState(elements);

    // Ejecutar el cambio de layout
    callback();

    // Animar la transición
    return Flip.from(state, {
      duration: defaultConfig.duration,
      ease: defaultConfig.ease,
      scale: defaultConfig.scale,
      simple: defaultConfig.simple,
      absolute: defaultConfig.absolute,
      spin: defaultConfig.spin,
      fade: defaultConfig.fade,
      onStart: defaultConfig.onStart,
      onComplete: defaultConfig.onComplete
    });
  }, [isMobile, prefersReducedMotion]);

  /**
   * Animación FLIP para expandir una card a modal
   * Efecto cinematográfico suave
   */
  const expandToModal = useCallback((
    sourceElement: Element,
    targetContainer: Element,
    config: FLIPConfig = {}
  ) => {
    if (prefersReducedMotion) {
      return gsap.fromTo(targetContainer, 
        { opacity: 0, scale: 0.8 }, 
        { opacity: 1, scale: 1, duration: 0.3 }
      );
    }

    const defaultConfig: FLIPConfig = {
      duration: isMobile ? 0.8 : 1.2,
      ease: "power3.out",
      scale: true,
      absolute: true,
      ...config
    };

    // Timeline para el efecto completo
    const tl = gsap.timeline();

    // Fase 1: Preparar el modal (invisible)
    tl.set(targetContainer, {
      opacity: 0,
      scale: 0.8,
      transformOrigin: "center center"
    });

    // Fase 2: FLIP transition del elemento
    const state = Flip.getState(sourceElement);
    
    // Cambiar visibilidad
    gsap.set(sourceElement, { opacity: 0 });
    gsap.set(targetContainer, { opacity: 1 });

    tl.add(Flip.from(state, {
      targets: targetContainer,
      duration: defaultConfig.duration,
      ease: defaultConfig.ease,
      scale: defaultConfig.scale,
      absolute: defaultConfig.absolute
    }));

    // Fase 3: Efectos adicionales del modal
    tl.fromTo(targetContainer, 
      { 
        filter: "blur(10px) brightness(0.8)",
        rotationX: -5
      },
      { 
        filter: "blur(0px) brightness(1)",
        rotationX: 0,
        duration: 0.4,
        ease: "power2.out"
      }, 
      "-=0.6"
    );

    return tl;
  }, [isMobile, prefersReducedMotion]);

  /**
   * Animación FLIP para colapsar modal a card
   * Reversa del efecto anterior
   */
  const collapseToCard = useCallback((
    modalElement: Element,
    targetElement: Element,
    config: FLIPConfig = {}
  ) => {
    if (prefersReducedMotion) {
      return gsap.fromTo(modalElement, 
        { opacity: 1, scale: 1 }, 
        { opacity: 0, scale: 0.8, duration: 0.3 }
      );
    }

    const defaultConfig: FLIPConfig = {
      duration: isMobile ? 0.6 : 1,
      ease: "power3.inOut",
      scale: true,
      absolute: true,
      ...config
    };

    // Timeline para el efecto de cierre
    const tl = gsap.timeline();

    // Fase 1: Efectos previos al FLIP
    tl.to(modalElement, {
      filter: "blur(5px) brightness(0.9)",
      rotationX: -3,
      duration: 0.2,
      ease: "power2.in"
    });

    // Fase 2: FLIP transition
    const state = Flip.getState(modalElement);
    
    // Cambiar visibilidad
    gsap.set(modalElement, { opacity: 0 });
    gsap.set(targetElement, { opacity: 1 });

    tl.add(Flip.from(state, {
      targets: targetElement,
      duration: defaultConfig.duration,
      ease: defaultConfig.ease,
      scale: defaultConfig.scale,
      absolute: defaultConfig.absolute
    }));

    return tl;
  }, [isMobile, prefersReducedMotion]);

  /**
   * Animación FLIP para reordenar elementos del grid
   * Perfecto para filtros, sorting, etc.
   */
  const reorderGrid = useCallback((
    gridContainer: Element,
    callback: () => void,
    config: FLIPConfig = {}
  ) => {
    if (prefersReducedMotion) {
      callback();
      return;
    }

    const defaultConfig: FLIPConfig = {
      duration: isMobile ? 0.5 : 0.8,
      ease: "power2.inOut",
      scale: false,
      simple: true,
      ...config
    };

    const elements = gridContainer.children;
    const state = Flip.getState(elements);

    // Ejecutar el reorden
    callback();

    // Animar la transición
    return Flip.from(state, {
      duration: defaultConfig.duration,
      ease: defaultConfig.ease,
      scale: defaultConfig.scale,
      simple: defaultConfig.simple,
      stagger: 0.05,
      onStart: defaultConfig.onStart,
      onComplete: defaultConfig.onComplete
    });
  }, [isMobile, prefersReducedMotion]);

  /**
   * Animación FLIP para hover states complejos
   * Efectos suaves de transformación
   */
  const createHoverFLIP = useCallback((
    element: Element,
    hoverState: gsap.TweenVars,
    config: FLIPConfig = {}
  ) => {
    if (prefersReducedMotion || isMobile) return;

    const defaultConfig: FLIPConfig = {
      duration: 0.4,
      ease: "power2.out",
      ...config
    };

    let isHovering = false;
    let originalState: gsap.FlipState | null = null;

    const handleMouseEnter = () => {
      if (isHovering) return;
      isHovering = true;

      // Capturar estado original
      originalState = Flip.getState(element);

      // Aplicar hover state
      gsap.set(element, hoverState);

      // Animar la transición
      Flip.from(originalState, {
        targets: element,
        duration: defaultConfig.duration,
        ease: defaultConfig.ease,
        scale: true
      });
    };

    const handleMouseLeave = () => {
      if (!isHovering || !originalState) return;
      isHovering = false;

      // Capturar estado actual
      const currentState = Flip.getState(element);

      // Volver al estado original
      Flip.fit(element, originalState);

      // Animar el regreso
      Flip.from(currentState, {
        targets: element,
        duration: (defaultConfig.duration || 1) * 1.2,
        ease: "elastic.out(1, 0.3)",
        scale: true
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMobile, prefersReducedMotion]);

  /**
   * Batch FLIP - para múltiples elementos simultáneos
   */
  const batchFLIP = useCallback((
    batches: Array<{
      elements: string | Element | Element[];
      callback: () => void;
      config?: FLIPConfig;
    }>
  ) => {
    if (prefersReducedMotion) {
      batches.forEach(batch => batch.callback());
      return;
    }

    // Capturar todos los estados
    const states = batches.map(batch => ({
      state: Flip.getState(batch.elements),
      batch
    }));

    // Ejecutar todos los cambios
    batches.forEach(batch => batch.callback());

    // Crear timeline maestro
    const masterTL = gsap.timeline();

    // Animar cada batch
    states.forEach((item, index) => {
      const { state, batch } = item;
      const config = {
        duration: isMobile ? 0.6 : 1,
        ease: "power2.inOut",
        scale: true,
        ...batch.config
      };

      const flipTween = Flip.from(state, {
        duration: config.duration,
        ease: config.ease,
        scale: config.scale
      });

      masterTL.add(flipTween, index * 0.1);
    });

    return masterTL;
  }, [isMobile, prefersReducedMotion]);

  return {
    containerRef,
    isMobile,
    prefersReducedMotion,
    // Animaciones principales
    createFLIPTransition,
    expandToModal,
    collapseToCard,
    reorderGrid,
    createHoverFLIP,
    batchFLIP,
    // Acceso directo a GSAP
    gsap,
    Flip
  };
}

/**
 * Hook simplificado para componentes con FLIP básico
 */
export function useBasicFLIP(elementRef: React.RefObject<HTMLElement>) {
  const { createFLIPTransition } = useFLIPAnimations();

  const animateLayoutChange = useCallback((callback: () => void) => {
    if (!elementRef.current) return;
    return createFLIPTransition(elementRef.current, callback);
  }, [createFLIPTransition, elementRef]);

  return { animateLayoutChange };
}