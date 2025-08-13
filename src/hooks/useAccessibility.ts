import { useEffect, useRef, useCallback, useState } from 'react';

// Hook principal de accesibilidad
export const useAccessibility = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);

  useEffect(() => {
    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') return;

    try {
      // Detectar preferencias de accesibilidad
      const mediaQueryMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const mediaQueryContrast = window.matchMedia('(prefers-contrast: high)');

      setReducedMotion(mediaQueryMotion.matches);
      setHighContrast(mediaQueryContrast.matches);

      // Detectar screen reader
      const isScreenReader = navigator.userAgent.includes('NVDA') || 
                            navigator.userAgent.includes('JAWS') || 
                            window.speechSynthesis?.speaking;
      setScreenReaderMode(!!isScreenReader);

      // Listeners para cambios dinámicos
      const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      const handleContrastChange = (e: MediaQueryListEvent) => setHighContrast(e.matches);

      mediaQueryMotion.addEventListener('change', handleMotionChange);
      mediaQueryContrast.addEventListener('change', handleContrastChange);

      return () => {
        mediaQueryMotion.removeEventListener('change', handleMotionChange);
        mediaQueryContrast.removeEventListener('change', handleContrastChange);
      };
    } catch (error) {
      console.warn('Error initializing accessibility features:', error);
    }
  }, []);

  // Función para anunciar a screen readers
  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  // Skip to content
  const skipToContent = useCallback(() => {
    const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
    if (mainContent instanceof HTMLElement) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  }, [reducedMotion]);

  return {
    reducedMotion,
    highContrast,
    screenReaderMode,
    announceToScreenReader,
    skipToContent,
  };
};

// Hook para manejo de focus
export const useFocusManagement = () => {
  const focusableElementsSelector = 
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(focusableElementsSelector) as NodeListOf<HTMLElement>;
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  const restoreFocus = useCallback((element: HTMLElement | null) => {
    if (element && element.focus) {
      element.focus();
    }
  }, []);

  const getFocusableElements = useCallback((container: HTMLElement): HTMLElement[] => {
    return Array.from(container.querySelectorAll(focusableElementsSelector)) as HTMLElement[];
  }, []);

  return {
    trapFocus,
    restoreFocus,
    getFocusableElements,
  };
};

// Hook para navegación por teclado
export const useKeyboardNavigation = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyNavigation = useCallback((
    e: KeyboardEvent,
    items: HTMLElement[],
    options: {
      loop?: boolean;
      orientation?: 'horizontal' | 'vertical' | 'both';
      onSelect?: (index: number) => void;
    } = {}
  ) => {
    const { loop = true, orientation = 'vertical', onSelect } = options;
    
    let newIndex = activeIndex;

    switch (e.key) {
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          newIndex = loop 
            ? (activeIndex + 1) % items.length
            : Math.min(activeIndex + 1, items.length - 1);
          e.preventDefault();
        }
        break;
      
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          newIndex = loop
            ? (activeIndex - 1 + items.length) % items.length
            : Math.max(activeIndex - 1, 0);
          e.preventDefault();
        }
        break;
      
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          newIndex = loop
            ? (activeIndex + 1) % items.length
            : Math.min(activeIndex + 1, items.length - 1);
          e.preventDefault();
        }
        break;
      
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          newIndex = loop
            ? (activeIndex - 1 + items.length) % items.length
            : Math.max(activeIndex - 1, 0);
          e.preventDefault();
        }
        break;
      
      case 'Home':
        newIndex = 0;
        e.preventDefault();
        break;
      
      case 'End':
        newIndex = items.length - 1;
        e.preventDefault();
        break;
      
      case 'Enter':
      case ' ':
        onSelect?.(activeIndex);
        e.preventDefault();
        break;
    }

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
      items[newIndex]?.focus();
    }
  }, [activeIndex]);

  return {
    activeIndex,
    setActiveIndex,
    handleKeyNavigation,
  };
};

// Hook para ARIA live regions
export const useAriaLive = () => {
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((
    message: string,
    priority: 'polite' | 'assertive' = 'polite'
  ) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.setAttribute('aria-live', priority);
      liveRegionRef.current.textContent = message;
      
      // Limpiar después de un tiempo
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  // Simple factory function for creating live region element
  const createLiveRegion = useCallback(() => {
    const div = document.createElement('div');
    div.setAttribute('aria-live', 'polite');
    div.setAttribute('aria-atomic', 'true');
    div.className = 'sr-only';
    return div;
  }, []);

  return {
    announce,
    liveRegionRef,
    createLiveRegion,
  };
};

// Hook para detectar dispositivos de asistencia
export const useAssistiveTechnology = () => {
  const [hasScreenReader, setHasScreenReader] = useState(false);
  const [hasVoiceControl, setHasVoiceControl] = useState(false);
  const [hasKeyboardOnly, setHasKeyboardOnly] = useState(false);

  useEffect(() => {
    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') return;

    try {
      // Detectar screen reader
      const detectScreenReader = () => {
        return !!(
          window.navigator.userAgent.match(/NVDA|JAWS|VoiceOver|TalkBack|Dragon/i) ||
          (window as any).speechSynthesis ||
          document.querySelector('[aria-live]')
        );
      };

      // Detectar uso exclusivo de teclado
      let keyboardOnlyTimer: NodeJS.Timeout;
      let hasUsedMouse = false;

      const handleMouseMove = () => {
        hasUsedMouse = true;
        setHasKeyboardOnly(false);
      };

      const handleKeydown = () => {
        if (!hasUsedMouse) {
          clearTimeout(keyboardOnlyTimer);
          keyboardOnlyTimer = setTimeout(() => {
            setHasKeyboardOnly(true);
          }, 2000);
        }
      };

      setHasScreenReader(detectScreenReader());

      // Detectar control por voz (muy básico)
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        setHasVoiceControl(true);
      }

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('keydown', handleKeydown);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('keydown', handleKeydown);
        clearTimeout(keyboardOnlyTimer);
      };
    } catch (error) {
      console.warn('Error detecting assistive technology:', error);
    }
  }, []);

  return {
    hasScreenReader,
    hasVoiceControl,
    hasKeyboardOnly,
  };
};

// Hook para controles de accesibilidad personalizables
export const useAccessibilityControls = () => {
  const [fontSize, setFontSize] = useState(16);
  const [contrast, setContrast] = useState('normal');
  const [focusIndicator, setFocusIndicator] = useState(true);

  useEffect(() => {
    // Aplicar cambios al documento
    document.documentElement.style.fontSize = `${fontSize}px`;
    document.documentElement.setAttribute('data-contrast', contrast);
    
    if (!focusIndicator) {
      document.body.classList.add('no-focus-indicators');
    } else {
      document.body.classList.remove('no-focus-indicators');
    }
  }, [fontSize, contrast, focusIndicator]);

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 24));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 12));
  const resetFontSize = () => setFontSize(16);

  const toggleContrast = () => {
    setContrast(prev => prev === 'normal' ? 'high' : 'normal');
  };

  const toggleFocusIndicator = () => {
    setFocusIndicator(prev => !prev);
  };

  return {
    fontSize,
    contrast,
    focusIndicator,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    toggleContrast,
    toggleFocusIndicator,
  };
};