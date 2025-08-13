import React, { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { useDevice, usePrefersReducedMotion } from '@/hooks/useDevice';

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
  const ref = useRef(null);
  const { isMobile } = useDevice();
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const isInView = useInView(ref, { 
    once: false,  
    amount: isMobile ? Math.max(threshold * 0.5, 0.02) : threshold,
    margin: isMobile ? "0px 0px -10% 0px" : "0px 0px -5% 0px"
  });

  const variants: Variants = {
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : (isMobile ? yOffset * 0.7 : yOffset),
      scale: prefersReducedMotion ? 1 : scaleOffset 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: prefersReducedMotion ? 0.01 : (isMobile ? 0.35 : 0.55), 
        ease: prefersReducedMotion ? "linear" : (isMobile ? "easeOut" : [0.25, 0.1, 0.25, 1]),
        delay: prefersReducedMotion ? 0 : (isMobile ? delay * 0.6 : delay * 0.8)
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      style={{
        willChange: isInView ? 'opacity, transform' : 'auto'
      }}
    >
      {children}
    </motion.div>
  );
};

export const AnimateElements: React.FC<{
  children: React.ReactNode;
  staggerDelay?: number;
}> = ({ 
  children, 
  staggerDelay = 0.08 
}) => {
  const { isMobile } = useDevice();
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const variants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0.01 : (isMobile ? staggerDelay * 0.5 : staggerDelay * 0.8),
        delayChildren: prefersReducedMotion ? 0 : (isMobile ? 0.08 : 0.12),
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ 
        once: false, 
        amount: isMobile ? 0.03 : 0.12,
        margin: isMobile ? "0px 0px -20% 0px" : "0px 0px -8% 0px"
      }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedElement: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ 
  children, 
  delay = 0 
}) => {
  const { isMobile } = useDevice();
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const variants: Variants = {
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : (isMobile ? 15 : 25),
      scale: prefersReducedMotion ? 1 : (isMobile ? 0.99 : 0.97)
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: prefersReducedMotion ? "tween" : (isMobile ? "tween" : "spring"),
        stiffness: (!prefersReducedMotion && !isMobile) ? 160 : undefined,
        damping: (!prefersReducedMotion && !isMobile) ? 16 : undefined,
        duration: prefersReducedMotion ? 0.01 : (isMobile ? 0.25 : undefined),
        ease: prefersReducedMotion ? "linear" : (isMobile ? "easeOut" : undefined),
        delay: prefersReducedMotion ? 0 : (isMobile ? delay * 0.5 : delay * 0.7)
      }
    }
  };

  return (
    <motion.div
      variants={variants}
      style={{
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </motion.div>
  );
};