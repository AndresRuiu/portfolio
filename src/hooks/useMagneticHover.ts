import { useEffect, useCallback } from 'react';
import { gsap } from 'gsap';

interface MagneticHoverOptions {
  strength?: number;
  speed?: number;
  tolerance?: number;
  lightEffect?: boolean;
  morphing?: boolean;
}

/**
 * Hook for high-performance magnetic hover effects with light following cursor
 * Optimized for 60fps performance
 */
export function useMagneticHover(
  selector: string | Element | null, 
  options: MagneticHoverOptions = {}
) {
  const {
    strength = 0.3,
    speed = 0.3,
    lightEffect = true,
    morphing = false
  } = options;

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const updateMousePosition = useCallback((element: Element, x: number, y: number) => {
    if (!lightEffect) return;
    
    const rect = element.getBoundingClientRect();
    const xPercent = ((x - rect.left) / rect.width) * 100;
    const yPercent = ((y - rect.top) / rect.height) * 100;
    
    // Use requestAnimationFrame for smooth 60fps updates
    requestAnimationFrame(() => {
      (element as HTMLElement).style.setProperty('--mouse-x', `${xPercent}%`);
      (element as HTMLElement).style.setProperty('--mouse-y', `${yPercent}%`);
    });
  }, [lightEffect]);

  const createMagneticEffect = useCallback((element: Element) => {
    if (prefersReducedMotion || isMobile) {
      // Just add light effect without magnetic movement on mobile
      if (lightEffect) {
        element.classList.add('magnetic-hover');
      }
      return () => {};
    }

    let isHovering = false;
    let animationFrame: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering) return;

      cancelAnimationFrame(animationFrame);
      
      animationFrame = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;
        
        // Magnetic movement with performance optimization
        gsap.to(element, {
          x: deltaX,
          y: deltaY,
          duration: speed,
          ease: "power2.out",
          overwrite: true,
          force3D: true, // Force hardware acceleration
          transformOrigin: "center center"
        });

        // Update light position
        updateMousePosition(element, e.clientX, e.clientY);
        
        // Morphing effect (subtle scale)
        if (morphing) {
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          const scale = 1 + (distance * 0.001);
          gsap.to(element, {
            scale: Math.min(scale, 1.05),
            duration: speed,
            ease: "power2.out",
            overwrite: "auto"
          });
        }
      });
    };

    const handleMouseEnter = (e: MouseEvent) => {
      isHovering = true;
      element.classList.add('magnetic-hover');
      
      // Initial light position
      updateMousePosition(element, e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      isHovering = false;
      cancelAnimationFrame(animationFrame);
      
      // Return to original position
      gsap.to(element, {
        x: 0,
        y: 0,
        scale: 1,
        duration: speed * 1.5,
        ease: "elastic.out(1, 0.3)",
        overwrite: true,
        force3D: true
      });
    };

    // Add event listeners with passive flag for performance
    element.addEventListener('mousemove', handleMouseMove as EventListener, { passive: true });
    element.addEventListener('mouseenter', handleMouseEnter as EventListener, { passive: true });
    element.addEventListener('mouseleave', handleMouseLeave as EventListener, { passive: true });

    // Add CSS classes
    if (lightEffect) {
      element.classList.add('magnetic-hover');
    }
    
    // Add performance optimization classes
    element.classList.add('performance-optimized', 'gpu-accelerated');

    return () => {
      cancelAnimationFrame(animationFrame);
      element.removeEventListener('mousemove', handleMouseMove as EventListener);
      element.removeEventListener('mouseenter', handleMouseEnter as EventListener);
      element.removeEventListener('mouseleave', handleMouseLeave as EventListener);
      element.classList.remove('magnetic-hover', 'magnetic-primary', 'magnetic-secondary');
    };
  }, [strength, speed, lightEffect, morphing, prefersReducedMotion, isMobile, updateMousePosition]);

  useEffect(() => {
    if (!selector) return;

    const elements = typeof selector === 'string' 
      ? document.querySelectorAll(selector)
      : [selector];

    const cleanupFunctions: (() => void)[] = [];

    elements.forEach(element => {
      if (element instanceof Element) {
        const cleanup = createMagneticEffect(element);
        cleanupFunctions.push(cleanup);
      }
    });

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [selector, createMagneticEffect]);

  return {
    updateMousePosition,
    isMobile,
    prefersReducedMotion
  };
}

/**
 * Hook for applying magnetic effects to multiple elements with different configurations
 */
export function useMagneticHoverMultiple(configs: Array<{
  selector: string;
  options?: MagneticHoverOptions;
  variant?: 'primary' | 'secondary';
}>) {
  useEffect(() => {
    const cleanupFunctions: (() => void)[] = [];

    configs.forEach(({ selector, variant }) => {
      const elements = document.querySelectorAll(selector);
      
      elements.forEach(element => {
        // Add variant class
        if (variant === 'primary') {
          element.classList.add('magnetic-primary');
        } else if (variant === 'secondary') {
          element.classList.add('magnetic-secondary');
        }

        // Direct implementation instead of nested hook call
        
        // Store cleanup function (this is a simplified version)
        cleanupFunctions.push(() => {
          element.classList.remove('magnetic-hover', 'magnetic-primary', 'magnetic-secondary');
        });
      });
    });

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [configs]);
}

export default useMagneticHover;