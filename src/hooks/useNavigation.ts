import { useCallback, useEffect, useState } from 'react';

// Hook para smooth scroll
export const useSmoothScroll = () => {
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100; // Offset para el navbar
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  return { scrollToSection };
};

// Hook para scroll progress
export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = scrollPx / winHeightPx;
      setScrollProgress(Math.min(scrolled, 1));
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress(); // Initial call

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return scrollProgress;
};

// Hook para keyboard navigation
export const useKeyboardNavigation = (onEscape?: () => void) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        onEscape();
      }
      
      // Navegación entre secciones con teclas
      const sections = ['hero', 'about', 'skills', 'projects', 'education', 'contact'];
      const currentSection = sections.findIndex(section => {
        const element = document.getElementById(section);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight / 2;
      });

      if (e.key === 'ArrowDown' && e.ctrlKey && currentSection < sections.length - 1) {
        e.preventDefault();
        const nextSection = sections[currentSection + 1];
        document.getElementById(nextSection)?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }

      if (e.key === 'ArrowUp' && e.ctrlKey && currentSection > 0) {
        e.preventDefault();
        const prevSection = sections[currentSection - 1];
        document.getElementById(prevSection)?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscape]);
};

// Hook para gesture navigation
export const useGestureNavigation = () => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > 50;
    const isRightSwipe = distanceX < -50;
    const isUpSwipe = distanceY > 50;
    const isDownSwipe = distanceY < -50;

    return {
      isLeftSwipe,
      isRightSwipe,
      isUpSwipe,
      isDownSwipe,
      distanceX,
      distanceY
    };
  };

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return { handleTouchEnd };
};
