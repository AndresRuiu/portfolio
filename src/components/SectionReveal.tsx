import React, { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

export const SectionReveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  threshold?: number;
  yOffset?: number;
  scaleOffset?: number;
}> = ({ 
  children, 
  delay = 0.2, 
  threshold = 0.1,
  yOffset = 50,
  scaleOffset = 0.95
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: false,  
    amount: threshold  
  });

  const variants: Variants = {
    hidden: { 
      opacity: 0, 
      y: yOffset,
      scale: scaleOffset 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        delay: delay 
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
        willChange: 'opacity, transform'
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
  staggerDelay = 0.1 
}) => {
  const variants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
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
  const variants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: delay 
      }
    }
  };

  return (
    <motion.div
      variants={variants}
    >
      {children}
    </motion.div>
  );
};