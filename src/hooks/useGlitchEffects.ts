import { gsap } from 'gsap';
import { useRef, useCallback, useEffect, useState } from 'react';

export interface GlitchConfig {
  intensity?: number;
  duration?: number;
  frequency?: number;
  colorShift?: boolean;
  digitalNoise?: boolean;
  scanlines?: boolean;
  chromaAberration?: boolean;
  pixelation?: boolean;
  triggerOnHover?: boolean;
  triggerOnClick?: boolean;
  autoTrigger?: boolean;
  autoInterval?: number;
}

/**
 * Hook para efectos glitch avanzados con múltiples tipos de distorsión
 * Incluye aberración cromática, ruido digital, líneas de escaneo y pixelación
 */
export function useGlitchEffects() {
  const glitchInstancesRef = useRef<Map<Element, { instance: { element: Element; config: GlitchConfig; isActive: boolean; autoTimer: NodeJS.Timeout | null }; cleanup: () => void }>>(new Map());
  const [activeGlitches, setActiveGlitches] = useState<Set<Element>>(new Set());

  // Media queries para responsive
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Crear efecto glitch de aberración cromática
   */
  const createChromaticAberration = useCallback((
    element: Element,
    intensity: number = 1,
    duration: number = 0.3
  ) => {
    if (prefersReducedMotion) return;

    const tl = gsap.timeline();
    const maxShift = intensity * 3;
    
    // Crear capas RGB
    const originalContent = element.innerHTML;
    element.innerHTML = `
      <div class="glitch-layer glitch-red" style="position: relative; color: #ff0000; mix-blend-mode: screen;">${originalContent}</div>
      <div class="glitch-layer glitch-green" style="position: absolute; top: 0; left: 0; color: #00ff00; mix-blend-mode: screen;">${originalContent}</div>
      <div class="glitch-layer glitch-blue" style="position: absolute; top: 0; left: 0; color: #0000ff; mix-blend-mode: screen;">${originalContent}</div>
    `;

    const redLayer = element.querySelector('.glitch-red') as HTMLElement;
    const greenLayer = element.querySelector('.glitch-green') as HTMLElement;
    const blueLayer = element.querySelector('.glitch-blue') as HTMLElement;

    // Animar desplazamientos RGB
    tl.to(redLayer, {
      x: gsap.utils.random(-maxShift, maxShift),
      y: gsap.utils.random(-1, 1),
      duration: duration * 0.1,
      repeat: 5,
      yoyo: true,
      ease: "power2.inOut"
    }, 0);

    tl.to(greenLayer, {
      x: gsap.utils.random(-maxShift, maxShift),
      y: gsap.utils.random(-1, 1),
      duration: duration * 0.15,
      repeat: 4,
      yoyo: true,
      ease: "power2.inOut"
    }, 0.1);

    tl.to(blueLayer, {
      x: gsap.utils.random(-maxShift, maxShift),
      y: gsap.utils.random(-1, 1),
      duration: duration * 0.2,
      repeat: 3,
      yoyo: true,
      ease: "power2.inOut"
    }, 0.2);

    // Restaurar contenido original
    tl.call(() => {
      element.innerHTML = originalContent;
    });

    return tl;
  }, [prefersReducedMotion]);

  /**
   * Crear efecto de ruido digital
   */
  const createDigitalNoise = useCallback((
    element: Element,
    intensity: number = 1,
    duration: number = 0.5
  ) => {
    if (prefersReducedMotion) return;

    const tl = gsap.timeline();
    const noiseChars = "█▓▒░!<>-_\\/[]{}—=+*^?#01101001░▒▓█▀▄▌▐";
    const originalText = element.textContent || '';

    // Efecto de corrupción de texto
    for (let i = 0; i < 8; i++) {
      tl.call(() => {
        if (element.textContent) {
          const chars = element.textContent.split('');
          const corruptedChars = chars.map((char) => {
            if (Math.random() < intensity * 0.3) {
              return noiseChars[Math.floor(Math.random() * noiseChars.length)];
            }
            return char;
          });
          element.textContent = corruptedChars.join('');
        }
      }, [], i * (duration / 10));
    }

    // Restaurar texto original
    tl.call(() => {
      element.textContent = originalText;
    }, [], duration);

    // Efectos visuales de ruido
    tl.to(element, {
      filter: `brightness(${1 + intensity * 0.5}) saturate(${1 + intensity}) contrast(${1 + intensity * 0.3}) hue-rotate(${gsap.utils.random(-20, 20)}deg)`,
      duration: duration * 0.1,
      repeat: 5,
      yoyo: true,
      ease: "power2.inOut"
    }, 0);

    return tl;
  }, [prefersReducedMotion]);

  /**
   * Crear líneas de escaneo
   */
  const createScanlines = useCallback((
    element: Element,
    intensity: number = 1,
    duration: number = 0.4
  ) => {
    if (prefersReducedMotion) return;

    const scanlineOverlay = document.createElement('div');
    scanlineOverlay.className = 'glitch-scanlines';
    scanlineOverlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 255, 0, ${intensity * 0.1}) 2px,
        rgba(0, 255, 0, ${intensity * 0.1}) 4px
      );
      pointer-events: none;
      opacity: 0;
      z-index: 10;
    `;

    // Asegurar posición relativa en el elemento padre
    const originalPosition = getComputedStyle(element).position;
    if (originalPosition === 'static') {
      (element as HTMLElement).style.position = 'relative';
    }

    element.appendChild(scanlineOverlay);

    const tl = gsap.timeline({
      onComplete: () => {
        element.removeChild(scanlineOverlay);
        if (originalPosition === 'static') {
          (element as HTMLElement).style.position = '';
        }
      }
    });

    // Animar scanlines
    tl.to(scanlineOverlay, {
      opacity: intensity,
      duration: duration * 0.1,
      ease: "power2.in"
    });

    tl.to(scanlineOverlay, {
      backgroundPositionY: "10px",
      duration: duration * 0.8,
      ease: "none",
      repeat: 3
    }, 0.1);

    tl.to(scanlineOverlay, {
      opacity: 0,
      duration: duration * 0.1,
      ease: "power2.out"
    });

    return tl;
  }, [prefersReducedMotion]);

  /**
   * Crear efecto de pixelación
   */
  const createPixelation = useCallback((
    element: Element,
    intensity: number = 1,
    duration: number = 0.6
  ) => {
    if (prefersReducedMotion) return;

    const tl = gsap.timeline();
    const maxPixelSize = intensity * 8;

    // Efecto de pixelación con filter
    tl.to(element, {
      filter: `pixelate(${maxPixelSize}px) contrast(${1 + intensity * 0.2})`,
      duration: duration * 0.2,
      ease: "power2.in"
    });

    // Reducir pixelación gradualmente
    tl.to(element, {
      filter: `pixelate(${maxPixelSize * 0.5}px) contrast(${1 + intensity * 0.1})`,
      duration: duration * 0.3,
      ease: "power2.out"
    });

    // Restaurar
    tl.to(element, {
      filter: "none",
      duration: duration * 0.5,
      ease: "power2.out"
    });

    return tl;
  }, [prefersReducedMotion]);

  /**
   * Crear efecto glitch completo combinando múltiples técnicas
   */
  const createFullGlitch = useCallback((
    element: Element,
    config: GlitchConfig = {}
  ) => {
    if (prefersReducedMotion) return;

    const {
      intensity = 1,
      duration = 0.8,
      colorShift = true,
      digitalNoise = true,
      scanlines = true,
      chromaAberration = true,
      pixelation = false
    } = config;

    const masterTL = gsap.timeline();

    // Preparar elemento para efectos
    const originalFilter = (element as HTMLElement).style.filter;

    // Efecto de distorsión inicial
    masterTL.to(element, {
      scaleX: 1 + gsap.utils.random(-0.1, 0.1) * intensity,
      scaleY: 1 + gsap.utils.random(-0.1, 0.1) * intensity,
      skewX: gsap.utils.random(-2, 2) * intensity,
      rotation: gsap.utils.random(-1, 1) * intensity,
      duration: 0.1,
      ease: "power2.inOut"
    });

    // Aberración cromática
    if (chromaAberration) {
      const chromaticTL = createChromaticAberration(element, intensity, duration * 0.4);
      if (chromaticTL) masterTL.add(chromaticTL, 0.1);
    }

    // Ruido digital
    if (digitalNoise) {
      const noiseTL = createDigitalNoise(element, intensity, duration * 0.6);
      if (noiseTL) masterTL.add(noiseTL, 0.2);
    }

    // Líneas de escaneo
    if (scanlines) {
      const scanlineTL = createScanlines(element, intensity, duration * 0.5);
      if (scanlineTL) masterTL.add(scanlineTL, 0.3);
    }

    // Color shift
    if (colorShift) {
      masterTL.to(element, {
        filter: `hue-rotate(${gsap.utils.random(-180, 180)}deg) saturate(${1 + intensity}) brightness(${1 + intensity * 0.3})`,
        duration: duration * 0.1,
        repeat: 3,
        yoyo: true,
        ease: "power2.inOut"
      }, 0.4);
    }

    // Pixelación (opcional)
    if (pixelation) {
      const pixelTL = createPixelation(element, intensity, duration * 0.4);
      if (pixelTL) masterTL.add(pixelTL, 0.5);
    }

    // Restaurar estado original
    masterTL.to(element, {
      scaleX: 1,
      scaleY: 1,
      skewX: 0,
      rotation: 0,
      filter: originalFilter || "none",
      duration: duration * 0.2,
      ease: "elastic.out(1, 0.3)"
    });

    return masterTL;
  }, [prefersReducedMotion, createChromaticAberration, createDigitalNoise, createScanlines, createPixelation]);

  /**
   * Configurar elemento con efectos glitch
   */
  const setupGlitchElement = useCallback((
    element: Element,
    config: GlitchConfig = {}
  ) => {
    if (prefersReducedMotion || isMobile) return;

    const {
      triggerOnHover = true,
      triggerOnClick = false,
      autoTrigger = false,
      autoInterval = 5000
    } = config;

    const instance = {
      element,
      config,
      isActive: false,
      autoTimer: null as NodeJS.Timeout | null
    };

    const triggerGlitch = () => {
      if (instance.isActive) return;
      
      instance.isActive = true;
      setActiveGlitches(prev => new Set([...prev, element]));

      const glitchTL = createFullGlitch(element, config);
      if (glitchTL) {
        glitchTL.eventCallback('onComplete', () => {
          instance.isActive = false;
          setActiveGlitches(prev => {
            const newSet = new Set(prev);
            newSet.delete(element);
            return newSet;
          });
        });
      }
    };

    // Event listeners
    if (triggerOnHover) {
      element.addEventListener('mouseenter', triggerGlitch);
    }

    if (triggerOnClick) {
      element.addEventListener('click', triggerGlitch);
    }

    // Auto-trigger
    if (autoTrigger) {
      instance.autoTimer = setInterval(triggerGlitch, autoInterval);
    }

    // Cleanup function
    const cleanup = () => {
      element.removeEventListener('mouseenter', triggerGlitch);
      element.removeEventListener('click', triggerGlitch);
      if (instance.autoTimer) {
        clearInterval(instance.autoTimer);
      }
    };

    glitchInstancesRef.current.set(element, { instance, cleanup });

    return cleanup;
  }, [prefersReducedMotion, isMobile, createFullGlitch]);

  /**
   * Activar glitch manualmente
   */
  const triggerGlitch = useCallback((
    element: Element,
    config?: GlitchConfig
  ) => {
    const glitchTL = createFullGlitch(element, config);
    return glitchTL;
  }, [createFullGlitch]);

  /**
   * Crear efecto de glitch de texto scramble
   */
  const createTextScrambleGlitch = useCallback((
    element: Element,
    newText?: string,
    config: GlitchConfig = {}
  ) => {
    if (prefersReducedMotion) return;

    const { intensity = 1, duration = 1 } = config;
    const glitchChars = "█▓▒░!<>-_\\/[]{}—=+*^?#01101001░▒▓█";
    const originalText = element.textContent || '';
    const targetText = newText || originalText;

    const tl = gsap.timeline();

    // Fase de corrupción
    tl.call(() => {
      const corruptInterval = setInterval(() => {
        const chars = targetText.split('');
        const corruptedText = chars.map(char => {
          if (Math.random() < intensity * 0.7) {
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          }
          return char;
        }).join('');
        element.textContent = corruptedText;
      }, 50);

      setTimeout(() => {
        clearInterval(corruptInterval);
      }, duration * 500);
    });

    // Fase de restauración
    tl.call(() => {
      element.textContent = targetText;
    }, [], duration * 0.5);

    return tl;
  }, [prefersReducedMotion]);

  /**
   * Limpiar todas las instancias
   */
  const cleanupAll = useCallback(() => {
    glitchInstancesRef.current.forEach(({ cleanup }) => cleanup());
    glitchInstancesRef.current.clear();
    setActiveGlitches(new Set());
  }, []);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      cleanupAll();
    };
  }, [cleanupAll]);

  return {
    setupGlitchElement,
    triggerGlitch,
    createFullGlitch,
    createChromaticAberration,
    createDigitalNoise,
    createScanlines,
    createPixelation,
    createTextScrambleGlitch,
    activeGlitches,
    cleanupAll
  };
}

/**
 * Hook simplificado para elementos con glitch básico
 */
export function useBasicGlitch(
  elementRef: React.RefObject<Element>,
  config?: GlitchConfig
) {
  const { setupGlitchElement } = useGlitchEffects();

  useEffect(() => {
    if (!elementRef.current) return;

    const cleanup = setupGlitchElement(elementRef.current, config);
    return cleanup;
  }, [setupGlitchElement, elementRef, config]);
}