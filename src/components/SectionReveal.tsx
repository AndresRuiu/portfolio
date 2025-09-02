import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDevice, usePrefersReducedMotion } from '@/hooks/useDevice';

// Registrar ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export const SectionReveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  threshold?: number;
  yOffset?: number;
  scaleOffset?: number;
}> = ({ 
  children, 
  delay = 0.15, 
  threshold = 0.05,
  yOffset = 30,
  scaleOffset = 0.98
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { isMobile } = useDevice();
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(() => {
    if (prefersReducedMotion || !ref.current) return;

    const element = ref.current;
    
    // Set initial state
    gsap.set(element, {
      opacity: 0,
      y: isMobile ? yOffset * 0.7 : yOffset,
      scale: scaleOffset
    });

    // Create scroll trigger animation
    gsap.to(element, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: isMobile ? 0.35 : 0.55,
      ease: isMobile ? "power2.out" : "power3.out",
      delay: isMobile ? delay * 0.6 : delay * 0.8,
      scrollTrigger: {
        trigger: element,
        start: `top ${100 - (isMobile ? Math.max(threshold * 50, 2) : threshold * 100)}%`,
        toggleActions: "play none none reverse",
        once: false
      }
    });
  }, [delay, threshold, yOffset, scaleOffset, isMobile, prefersReducedMotion]);

  // For reduced motion, just show content immediately
  if (prefersReducedMotion) {
    return <div>{children}</div>;
  }

  return (
    <div
      ref={ref}
      style={{
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
};

export const AnimateElements: React.FC<{
  children: React.ReactNode;
  staggerDelay?: number;
}> = ({ 
  children, 
  staggerDelay = 0.08 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { isMobile } = useDevice();
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(() => {
    if (prefersReducedMotion || !ref.current) return;

    const element = ref.current;
    const childElements = element.children;
    
    if (childElements.length === 0) return;

    // Set initial state for all children
    gsap.set(childElements, { opacity: 0 });

    // Create staggered animation
    gsap.to(childElements, {
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
      stagger: isMobile ? staggerDelay * 0.5 : staggerDelay * 0.8,
      delay: isMobile ? 0.08 : 0.12,
      scrollTrigger: {
        trigger: element,
        start: `top ${isMobile ? 97 : 88}%`,
        toggleActions: "play none none reverse",
        once: false
      }
    });
  }, [staggerDelay, isMobile, prefersReducedMotion]);

  // For reduced motion, just show content immediately
  if (prefersReducedMotion) {
    return <div>{children}</div>;
  }

  return (
    <div ref={ref}>
      {children}
    </div>
  );
};

export const AnimatedElement: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ 
  children, 
  delay = 0 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { isMobile } = useDevice();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !ref.current) return;

    const element = ref.current;
    
    // Set initial state
    gsap.set(element, {
      opacity: 0,
      y: isMobile ? 15 : 25,
      scale: isMobile ? 0.99 : 0.97
    });

    // Create animation (this component is used within AnimateElements, so it's triggered by parent)
    gsap.to(element, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: isMobile ? 0.25 : 0.4,
      ease: isMobile ? "power2.out" : "back.out(1.7)",
      delay: isMobile ? delay * 0.5 : delay * 0.7
    });
  }, [delay, isMobile, prefersReducedMotion]);

  // For reduced motion, just show content immediately
  if (prefersReducedMotion) {
    return <div>{children}</div>;
  }

  return (
    <div
      ref={ref}
      style={{
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
};