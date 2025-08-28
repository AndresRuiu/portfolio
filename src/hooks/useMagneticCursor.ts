import { gsap } from 'gsap';
import { useRef, useCallback, useEffect, useState } from 'react';

export interface MagneticConfig {
  strength?: number;
  speed?: number;
  radius?: number;
  easing?: string;
  glitchIntensity?: number;
  distortionEffect?: boolean;
  trailEffect?: boolean;
  audioFeedback?: boolean;
}

/**
 * Hook avanzado para cursor magnético con efectos físicos realistas
 * Incluye distorsión, glitch effects y atracción gravitacional
 */
export function useMagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  // const cursorDotRef = useRef<HTMLDivElement>(null); // Unused
  const trailRef = useRef<HTMLDivElement[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentTarget, setCurrentTarget] = useState<Element | null>(null);
  
  // Physics state
  const physics = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    velocityX: 0,
    velocityY: 0,
    isDragging: false,
    magneticForce: 0
  });

  // Media queries para responsive
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Crear elementos del cursor en el DOM
  const initializeCursor = useCallback(() => {
    if (isInitialized || isMobile || prefersReducedMotion) return;

    // Cursor principal - simplificado para mejor rendimiento
    const cursor = document.createElement('div');
    cursor.className = 'magnetic-cursor';
    cursor.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 20px;
      height: 20px;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      mix-blend-mode: difference;
      will-change: transform;
      visibility: visible;
    `;
    
    // Dot interno
    const dot = document.createElement('div');
    dot.className = 'magnetic-cursor-dot';
    dot.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 8px;
      height: 8px;
      background: hsl(var(--primary));
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: all 0.2s ease;
    `;
    cursor.appendChild(dot);

    // Trail elements - reducir cantidad para mejor rendimiento
    for (let i = 0; i < 3; i++) {
      const trail = document.createElement('div');
      trail.className = 'magnetic-cursor-trail';
      trail.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        width: ${25 - i * 5}px;
        height: ${25 - i * 5}px;
        background: rgba(255, 255, 255, ${0.06 - i * 0.02});
        border-radius: 50%;
        pointer-events: none;
        z-index: ${9999 - i};
        opacity: ${0.6 - i * 0.2};
        will-change: transform;
        visibility: visible;
        transform: translate(-50%, -50%);
      `;
      trailRef.current.push(trail);
      document.body.appendChild(trail);
    }

    document.body.appendChild(cursor);
    // cursorRef.current = cursor; // Read-only
    // cursorDotRef.current = dot; // Read-only

    // Ocultar cursor predeterminado solo en el área de contenido
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.style.cursor = 'none';
    }
    
    setIsInitialized(true);
  }, [isInitialized, isMobile, prefersReducedMotion]);

  // Actualizar posición con física ultra-optimizada
  const updateCursorPhysics = useCallback(() => {
    if (!isInitialized || !cursorRef.current) return;

    const { x, y, targetX, targetY, velocityX, velocityY, magneticForce } = physics.current;
    
    // Validar coordenadas válidas - evitar posición (0,0)
    if (targetX === 0 && targetY === 0) {
      requestAnimationFrame(updateCursorPhysics);
      return;
    }
    
    // Física ultra-simplificada para mejor rendimiento
    const spring = 0.08; // Valor más bajo para menos cálculos
    const friction = 0.9; // Más fricción para convergencia rápida
    
    // Calcular nueva velocidad
    const deltaX = targetX - x;
    const deltaY = targetY - y;
    
    // Umbral más alto para reducir actualizaciones innecesarias
    if (Math.abs(deltaX) < 2 && Math.abs(deltaY) < 2 && magneticForce < 0.1) {
      requestAnimationFrame(updateCursorPhysics);
      return;
    }
    
    physics.current.velocityX = (velocityX + deltaX * spring) * friction;
    physics.current.velocityY = (velocityY + deltaY * spring) * friction;
    
    // Actualizar posición
    physics.current.x += physics.current.velocityX;
    physics.current.y += physics.current.velocityY;

    // Validar posiciones finales dentro de viewport
    const finalX = Math.max(0, Math.min(window.innerWidth - 40, physics.current.x - 20));
    const finalY = Math.max(0, Math.min(window.innerHeight - 40, physics.current.y - 20));

    // Efectos mínimos para máximo rendimiento
    const scale = 1 + magneticForce * 0.1; // Efecto mínimo de escala
    
    gsap.set(cursorRef.current, {
      x: finalX,
      y: finalY,
      scale,
      duration: 0,
      visibility: 'visible'
    });

    // Actualizar trail mucho menos frecuentemente (solo 30% de las veces)
    if (Math.random() > 0.7) {
      trailRef.current.forEach((trail, index) => {
        if (!trail || index > 2) return; // Solo primeros 3 trails
        
        const trailX = Math.max(0, Math.min(window.innerWidth - 30, physics.current.x - (10 - index * 2)));
        const trailY = Math.max(0, Math.min(window.innerHeight - 30, physics.current.y - (10 - index * 2)));
        
        gsap.set(trail, {
          x: trailX,
          y: trailY,
          visibility: 'visible'
        });
      });
    }

    requestAnimationFrame(updateCursorPhysics);
  }, [isInitialized]);

  // Mouse move handler con efectos magnéticos
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isInitialized) return;
    
    // Validar coordenadas del evento
    if (!e.clientX || !e.clientY || e.clientX < 0 || e.clientY < 0) return;
    
    physics.current.targetX = e.clientX;
    physics.current.targetY = e.clientY;

    // Detectar elementos magnéticos cercanos
    const magneticElements = document.querySelectorAll('[data-magnetic="true"], .magnetic-element, .project-card, .gsap-magnetic-btn');
    let closestElement: Element | null = null;
    let minDistance = Infinity;

    magneticElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt((e.clientX - centerX) ** 2 + (e.clientY - centerY) ** 2);
      
      if (distance < minDistance && distance < 100) {
        minDistance = distance;
        closestElement = element;
      }
    });

    // Aplicar fuerza magnética
    if (closestElement && minDistance < 100) {
      const rect = (closestElement as Element).getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calcular atracción magnética
      const attraction = (100 - minDistance) / 100;
      const magneticX = centerX + (e.clientX - centerX) * (1 - attraction * 0.3);
      const magneticY = centerY + (e.clientY - centerY) * (1 - attraction * 0.3);
      
      physics.current.targetX = magneticX;
      physics.current.targetY = magneticY;
      physics.current.magneticForce = attraction;
      
      setCurrentTarget(closestElement);
    } else {
      physics.current.magneticForce = Math.max(0, physics.current.magneticForce - 0.1);
      setCurrentTarget(null);
    }
  }, [isInitialized]);

  // Efectos de hover magnético para elementos
  const createMagneticElement = useCallback((
    element: Element,
    config: MagneticConfig = {}
  ) => {
    if (isMobile || prefersReducedMotion) return;

    const {
      strength = 0.3,
      speed = 0.4,
      easing = "power2.out",
      glitchIntensity = 0.1,
      distortionEffect = false
    } = config;

    let isHovering = false;
    let animationFrame: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering) return;
      
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      
      // Efecto glitch aleatorio
      const glitchX = glitchIntensity > 0 ? gsap.utils.random(-glitchIntensity, glitchIntensity) : 0;
      const glitchY = glitchIntensity > 0 ? gsap.utils.random(-glitchIntensity, glitchIntensity) : 0;
      
      gsap.to(element, {
        x: deltaX + glitchX,
        y: deltaY + glitchY,
        duration: speed,
        ease: easing,
        overwrite: true
      });

      // Efecto de distorsión
      if (distortionEffect) {
        const distortion = Math.min(Math.abs(deltaX) + Math.abs(deltaY), 20) / 20;
        gsap.to(element, {
          skewX: deltaX * 0.01,
          skewY: deltaY * 0.01,
          filter: `blur(${distortion}px) hue-rotate(${deltaX}deg)`,
          duration: speed,
          ease: easing
        });
      }
    };

    const handleMouseEnter = () => {
      isHovering = true;
      element.setAttribute('data-magnetic', 'true');
      
      gsap.to(element, {
        scale: 1.05,
        duration: 0.3,
        ease: "back.out(1.7)"
      });
    };

    const handleMouseLeave = () => {
      isHovering = false;
      element.removeAttribute('data-magnetic');
      
      gsap.to(element, {
        x: 0,
        y: 0,
        scale: 1,
        skewX: 0,
        skewY: 0,
        filter: "none",
        duration: 0.6,
        ease: "elastic.out(1, 0.3)"
      });
    };

    element.addEventListener('mousemove', handleMouseMove as EventListener);
    element.addEventListener('mouseenter', handleMouseEnter as EventListener);
    element.addEventListener('mouseleave', handleMouseLeave as EventListener);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove as EventListener);
      element.removeEventListener('mouseenter', handleMouseEnter as EventListener);
      element.removeEventListener('mouseleave', handleMouseLeave as EventListener);
      cancelAnimationFrame(animationFrame);
    };
  }, [isMobile, prefersReducedMotion]);

  // Efecto de atracción entre elementos
  const createElementAttraction = useCallback((
    sourceElement: Element,
    targetElement: Element,
    attractionForce: number = 0.1
  ) => {
    if (isMobile || prefersReducedMotion) return;

    let isActive = false;

    const updateAttraction = () => {
      if (!isActive) return;

      const sourceRect = sourceElement.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      
      const sourceCenterX = sourceRect.left + sourceRect.width / 2;
      const sourceCenterY = sourceRect.top + sourceRect.height / 2;
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const targetCenterY = targetRect.top + targetRect.height / 2;
      
      const distance = Math.sqrt(
        (targetCenterX - sourceCenterX) ** 2 + (targetCenterY - sourceCenterY) ** 2
      );

      if (distance < 200) {
        const force = (200 - distance) / 200 * attractionForce;
        const angle = Math.atan2(targetCenterY - sourceCenterY, targetCenterX - sourceCenterX);
        
        const attractionX = Math.cos(angle) * force * 20;
        const attractionY = Math.sin(angle) * force * 20;
        
        gsap.to(sourceElement, {
          x: attractionX,
          y: attractionY,
          duration: 0.3,
          ease: "power2.out"
        });
        
        gsap.to(targetElement, {
          x: -attractionX * 0.5,
          y: -attractionY * 0.5,
          duration: 0.3,
          ease: "power2.out"
        });
      }

      requestAnimationFrame(updateAttraction);
    };

    const activate = () => {
      isActive = true;
      updateAttraction();
    };

    const deactivate = () => {
      isActive = false;
      gsap.to([sourceElement, targetElement], {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)"
      });
    };

    return { activate, deactivate };
  }, [isMobile, prefersReducedMotion]);

  // Cleanup con verificación de DOM
  const cleanup = useCallback(() => {
    if (cursorRef.current && document.body.contains(cursorRef.current)) {
      try {
        document.body.removeChild(cursorRef.current);
      } catch (error) {
        console.warn('Error removing cursor element:', error);
      }
      // cursorRef.current = null; // Read-only
    }
    
    trailRef.current.forEach(trail => {
      if (trail && document.body.contains(trail)) {
        try {
          document.body.removeChild(trail);
        } catch (error) {
          console.warn('Error removing trail element:', error);
        }
      }
    });
    
    // Restaurar cursor original solo en el área de contenido
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.style.cursor = 'auto';
    }
    document.body.style.cursor = 'auto';
    trailRef.current = [];
    setIsInitialized(false);
  }, []);

  // Inicializar cursor y event listeners
  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;

    initializeCursor();
    
    if (isInitialized) {
      // Inicializar posición de cursor en el centro de la pantalla
      physics.current.x = window.innerWidth / 2;
      physics.current.y = window.innerHeight / 2;
      physics.current.targetX = window.innerWidth / 2;
      physics.current.targetY = window.innerHeight / 2;
      
      document.addEventListener('mousemove', handleMouseMove);
      updateCursorPhysics();
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cleanup();
    };
  }, [isInitialized, initializeCursor, handleMouseMove, updateCursorPhysics, cleanup, isMobile, prefersReducedMotion]);

  return {
    isInitialized,
    currentTarget,
    createMagneticElement,
    createElementAttraction,
    cleanup
  };
}

/**
 * Hook simplificado para elementos magnéticos básicos
 */
export function useBasicMagnetic(elementRef: React.RefObject<Element>, config?: MagneticConfig) {
  const { createMagneticElement } = useMagneticCursor();

  useEffect(() => {
    if (!elementRef.current) return;
    
    const cleanup = createMagneticElement(elementRef.current, config);
    return cleanup;
  }, [createMagneticElement, elementRef, config]);
}