import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { useRef, useCallback } from 'react';

// Registrar plugins GSAP
gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

export interface GSAPOptions {
  mobile?: boolean;
  reduceMotion?: boolean;
}

/**
 * Hook personalizado para animaciones GSAP responsivas
 * Maneja automáticamente desktop vs mobile y prefers-reduced-motion
 */
export function useGSAPResponsive() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Simple mobile detection - only viewport width matters
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const createTimeline = useCallback((options?: gsap.TimelineVars) => {
    return gsap.timeline(options);
  }, []);

  const createScrollTrigger = useCallback((config: ScrollTrigger.Vars) => {
    if (prefersReducedMotion) {
      // Para reduced motion, solo fade simple
      return gsap.set(config.trigger || '.default', { opacity: 1 });
    }
    
    // Optimizar configuración para mejor rendimiento
    const optimizedConfig = {
      ...config,
      refreshPriority: -1, // Menor prioridad de refresh
      fastScrollEnd: true, // Optimizar scroll rápido
    };
    
    return ScrollTrigger.create(optimizedConfig);
  }, [prefersReducedMotion]);

  const createSplitText = useCallback((target: string | Element, options?: SplitText.Vars) => {
    if (prefersReducedMotion) {
      return null; // No split para reduced motion
    }
    
    // Verificar que el target existe y es válido
    if (!target) return null;
    
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element || !(element instanceof Element)) return null;
    
    // Verificar que el elemento tiene contenido
    if (!element.textContent || element.textContent.trim().length === 0) return null;
    
    try {
      return new SplitText(element, {
        type: isMobile ? "words" : "chars", // Solo caracteres, no words para evitar saltos de línea
        charsClass: "char", // Clase específica para los caracteres
        ...options
      });
    } catch (error) {
      console.warn('SplitText failed:', error);
      return null;
    }
  }, [isMobile, prefersReducedMotion]);

  const magneticEffect = useCallback((element: Element, intensity: number = 1) => {
    if (prefersReducedMotion || isMobile || !element) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!element || !element.getBoundingClientRect) return;
      
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * 0.1 * intensity;
      const deltaY = (e.clientY - centerY) * 0.1 * intensity;
      
      gsap.to(element, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      if (!element) return;
      
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
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove as EventListener);
        element.removeEventListener('mouseleave', handleMouseLeave as EventListener);
      }
    };
  }, [isMobile, prefersReducedMotion]);

  return {
    containerRef,
    isMobile,
    prefersReducedMotion,
    createTimeline,
    createScrollTrigger,
    createSplitText,
    magneticEffect,
    gsap,
    ScrollTrigger,
    SplitText,
    Flip
  };
}

/**
 * Hook específico para animaciones de texto avanzadas
 */
export function useTextAnimations() {
  const { createSplitText, isMobile, prefersReducedMotion } = useGSAPResponsive();

  const scrambleReveal = useCallback((target: string | Element) => {
    // Verificar que el target existe y tiene contenido
    if (!target) {
      console.warn('scrambleReveal: No target provided');
      return null;
    }
    
    // Verificar si es un elemento DOM válido
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element || !(element instanceof Element)) {
      console.warn('scrambleReveal: Invalid element', target);
      return null;
    }
    
    // Verificar que el elemento tiene contenido de texto
    if (!element.textContent || element.textContent.trim().length === 0) {
      console.warn('scrambleReveal: Element has no text content', element);
      return null;
    }
    
    // Ensure element is visible before animation
    gsap.set(element, { 
      opacity: 1, 
      visibility: 'visible',
      display: 'block'
    });
    
    if (prefersReducedMotion) {
      return gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    }

    // For mobile, use simple reveal
    if (isMobile) {
      return gsap.fromTo(element, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }

    const split = createSplitText(element);
    if (!split || !split.chars) {
      console.warn('scrambleReveal: SplitText failed, using fallback animation');
      // Fallback to simple animation if SplitText fails
      return gsap.fromTo(element, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }

    const chars = split.chars;
    if (chars.length === 0) {
      console.warn('scrambleReveal: No characters found after split');
      return gsap.fromTo(element, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
    
    const originalText = chars.map(char => char.textContent);
    const scrambleChars = "█▓▒░█▓▒░!<>-_\\/[]{}—=+*^?#01101001░▒▓█";
    
    // Ensure all chars are visible and positioned inline initially
    gsap.set(chars, { 
      opacity: 1, 
      visibility: 'visible',
      display: 'inline-block',
      whiteSpace: 'nowrap'
    });
    
    // Timeline de scramble mejorado
    const tl = gsap.timeline({
      onStart: () => {
        element.classList.add('scrambling');
      },
      onComplete: () => {
        element.classList.remove('scrambling');
        // Limpiar clases de caracteres y restaurar texto original
        chars.forEach((char, i) => {
          if (char) {
            char.classList.remove('char-scrambling');
            char.textContent = originalText[i];
            // Limpiar todas las propiedades GSAP de caracteres
            gsap.set(char, { 
              clearProps: "all"
            });
          }
        });
        
        // SOLUCIÓN CRÍTICA: Forzar estado final explícito
        gsap.set(element, { 
          clearProps: "transform,scale,rotation,x,y,z", // Limpiar transforms problemáticos
          opacity: 1,
          visibility: 'visible',
          zIndex: 10,
          display: 'block'
        });
        
        // Debugging sistemático
        console.log('🔍 Estado final del título:', {
          opacity: (element as HTMLElement).style.opacity,
          visibility: (element as HTMLElement).style.visibility,
          transform: (element as HTMLElement).style.transform,
          zIndex: (element as HTMLElement).style.zIndex,
          computed: window.getComputedStyle(element)
        });
      }
    });
    
    // Fase 1: Scramble con efectos visuales
    tl.to(chars, {
      duration: 0.03,
      ease: "none",
      stagger: 0.02,
      repeat: 12,
      repeatRefresh: true,
      onRepeat: function() {
        chars.forEach((char) => {
          if (char && char.textContent !== undefined) {
            char.classList.add('char-scrambling');
            char.textContent = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          }
        });
      }
    });
    
    // Fase 2: Reveal final
    tl.to(chars, {
      duration: 0.06,
      stagger: 0.04,
      ease: "power2.out",
      onStart: function() {
        chars.forEach((char, i) => {
          if (char && originalText[i] !== undefined) {
            char.classList.remove('char-scrambling');
            char.textContent = originalText[i];
            // Asegurar que cada carácter sea visible
            gsap.set(char, { 
              opacity: 1, 
              visibility: 'visible',
              color: 'inherit'
            });
          }
        });
      },
      onComplete: function() {
        // DOUBLE SAFETY: Final cleanup robusto
        gsap.set(element, { 
          clearProps: "transform,scale,rotation,x,y,z",
          opacity: 1, 
          visibility: 'visible',
          zIndex: 10,
          display: 'block'
        });
        
        // Asegurar que cada carácter también esté limpio
        chars.forEach(char => {
          if (char) {
            gsap.set(char, { 
              clearProps: "all",
              opacity: 1, 
              visibility: 'visible'
            });
          }
        });
        
        console.log('🎯 Fase 2 completada - título debería estar visible');
      }
    });

    return tl;
  }, [createSplitText, isMobile, prefersReducedMotion]);

  const typewriterReveal = useCallback((target: string | Element) => {
    // Verificar que el target existe y tiene contenido
    if (!target) {
      console.warn('typewriterReveal: No target provided');
      return null;
    }
    
    // Verificar si es un elemento DOM válido
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element || !(element instanceof Element)) {
      console.warn('typewriterReveal: Invalid element', target);
      return null;
    }
    
    // Verificar que el elemento tiene contenido de texto
    if (!element.textContent || element.textContent.trim().length === 0) {
      console.warn('typewriterReveal: Element has no text content', element);
      return null;
    }
    
    // Ensure element is visible before animation
    gsap.set(element, { 
      opacity: 1, 
      visibility: 'visible',
      display: 'block'
    });
    
    if (prefersReducedMotion) {
      return gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    }

    // For mobile, use simpler animation
    if (isMobile) {
      return gsap.fromTo(element, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }

    const split = createSplitText(element);
    if (!split || !split.chars) {
      console.warn('typewriterReveal: SplitText failed, using fallback animation');
      // Fallback animation
      return gsap.fromTo(element, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }

    const chars = split.chars;
    if (chars.length === 0) {
      console.warn('typewriterReveal: No characters found after split');
      return gsap.fromTo(element, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }

    // Ensure all chars are visible and positioned inline initially
    gsap.set(chars, { 
      opacity: 1, 
      visibility: 'visible',
      display: 'inline-block',
      whiteSpace: 'nowrap'
    });

    return gsap.fromTo(chars, 
      { 
        opacity: 0,
        rotationX: -90,
        transformOrigin: "50% 50% -50px"
      },
      { 
        opacity: 1, 
        rotationX: 0,
        stagger: 0.02,
        duration: 0.8,
        ease: "back.out(1.4)"
      }
    );
  }, [createSplitText, isMobile, prefersReducedMotion]);

  return {
    scrambleReveal,
    typewriterReveal
  };
}

/**
 * Hook para efectos magnéticos avanzados
 */
export function useMagneticEffects() {
  const { magneticEffect, isMobile, prefersReducedMotion } = useGSAPResponsive();

  const createMagneticButton = useCallback((element: Element) => {
    if (prefersReducedMotion || isMobile) return;

    const tl = gsap.timeline({ paused: true });
    
    tl.to(element, { 
      scale: 1.1, 
      rotation: gsap.utils.random(-3, 3),
      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
      duration: 0.3,
      ease: "back.out(1.7)"
    });

    const cleanup = magneticEffect(element, 1.5);

    element.addEventListener('mouseenter', () => tl.play());
    element.addEventListener('mouseleave', () => tl.reverse());

    return () => {
      cleanup?.();
      element.removeEventListener('mouseenter', () => tl.play());
      element.removeEventListener('mouseleave', () => tl.reverse());
    };
  }, [magneticEffect, isMobile, prefersReducedMotion]);

  return {
    createMagneticButton,
    magneticEffect
  };
}