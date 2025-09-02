import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { useAppState } from '@/contexts/AppContext';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { ui } = useAppState();

  useEffect(() => {
    const toggleVisibility = () => {
      // Mostrar el botón cuando el usuario haya scrolleado más de 400px
      if (window.pageYOffset > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Ocultar si hay modales abiertos
  const shouldHide = ui.hasOpenModals;

  return (
    <AnimatePresence>
      {isVisible && !shouldHide && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-5 right-4 z-[9999] p-3 rounded-full border border-border/50 shadow-lg group"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
          }}
          initial={{ 
            opacity: 0, 
            scale: 0.8, 
            y: 20 
          }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0 
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.8, 
            y: 20 
          }}
          whileHover={{ 
            scale: 1.1,
            y: -2,
            transition: { 
              type: "spring", 
              stiffness: 400, 
              damping: 25 
            }
          }}
          whileTap={{ 
            scale: 0.95 
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        >
          {/* Efecto de brillo pulsante */}
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Icono con animación */}
          <motion.div
            animate={{
              y: [0, -2, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ChevronUp className="w-5 h-5 text-foreground/80 group-hover:text-primary transition-colors duration-200 relative z-10" />
          </motion.div>

          {/* Efecto de ondas en hover */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{
              scale: [1, 1.3, 1.6],
              opacity: [0.6, 0.3, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;