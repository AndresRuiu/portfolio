import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModeToggle } from '@/components/mode-toggle';
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DATOS } from "@/data/resumen";
import { cn } from "@/lib/utils";
import { getIcon } from '@/lib/iconResolver';
import { Link, useLocation } from 'react-router-dom';

// Componente individual para botones con animaciones suaves
const NavButton: React.FC<{
  item: any;
  isActive: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = ({ item, isActive, isHovered, onMouseEnter, onMouseLeave }) => {

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          className="relative flex cursor-pointer items-center justify-center rounded-xl overflow-hidden"
          animate={{
            width: (isHovered || isActive) ? "auto" : 44,
            minWidth: 44,
            height: 44
          }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 30, 
            mass: 0.8 
          }}
          whileHover={{ 
            scale: 1.05,
            transition: { type: "spring", stiffness: 600, damping: 25 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Fondo animado */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            animate={{
              background: isActive 
                ? "linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--primary) / 0.1))"
                : isHovered 
                  ? "linear-gradient(135deg, hsl(var(--muted) / 0.8), hsl(var(--muted) / 0.4))"
                  : "transparent"
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          
          {/* Efecto de brillo en hover */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
              transform: "translateX(-100%)"
            }}
            animate={{
              transform: isHovered ? "translateX(100%)" : "translateX(-100%)"
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />

          <Link
            to={item.href}
            className="relative z-10 flex items-center justify-center gap-3 h-full w-full rounded-xl px-3"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            {/* Contenedor del icono con animación */}
            <motion.div
              animate={{
                scale: isActive ? 1.1 : 1,
                rotate: isHovered ? [0, -5, 5, 0] : 0
              }}
              transition={{ 
                scale: { type: "spring", stiffness: 400, damping: 20 },
                rotate: { duration: 0.6, ease: "easeInOut" }
              }}
            >
              <item.icon 
                className={cn(
                  "w-5 h-5 transition-colors duration-300",
                  isActive ? "text-primary" : "text-foreground/70"
                )} 
              />
            </motion.div>

            {/* Texto con animación fluida */}
            <AnimatePresence mode="wait">
              {(isHovered || isActive) && (
                <motion.span
                  initial={{ 
                    opacity: 0, 
                    width: 0,
                    x: -10
                  }}
                  animate={{ 
                    opacity: 1, 
                    width: "auto",
                    x: 0
                  }}
                  exit={{ 
                    opacity: 0, 
                    width: 0,
                    x: 10
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30,
                    opacity: { duration: 0.2 }
                  }}
                  className={cn(
                    "text-sm font-medium whitespace-nowrap overflow-hidden",
                    isActive ? "text-primary" : "text-foreground"
                  )}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          
          {/* Indicador activo */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                className="absolute bottom-0 left-1/2 w-1 h-1 bg-primary rounded-full"
                initial={{ opacity: 0, scale: 0, x: "-50%" }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent 
        side="top" 
        className={cn(
          "transition-opacity duration-200",
          (isHovered || isActive) && "opacity-0 pointer-events-none"
        )}
      >
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
};

// Componente para iconos sociales y de configuración
const IconButton: React.FC<{
  children: React.ReactNode;
  tooltip: string;
  href?: string;
  onClick?: () => void;
}> = ({ children, tooltip, href, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const content = (
    <motion.div
      className="relative flex aspect-square cursor-pointer items-center justify-center rounded-xl w-11 h-11 overflow-hidden"
      whileHover={{ 
        scale: 1.1,
        transition: { type: "spring", stiffness: 600, damping: 25 }
      }}
      whileTap={{ scale: 0.9 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fondo con gradiente animado */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{
          background: isHovered 
            ? "linear-gradient(135deg, hsl(var(--muted) / 0.8), hsl(var(--muted) / 0.4))"
            : "transparent"
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
      
      {/* Efecto de ondas en hover */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-primary/0"
        animate={{
          borderColor: isHovered ? "hsl(var(--primary) / 0.3)" : "hsl(var(--primary) / 0)",
          scale: isHovered ? [1, 1.05, 1] : 1
        }}
        transition={{ 
          duration: 0.8, 
          ease: "easeOut",
          scale: { repeat: isHovered ? Infinity : 0, duration: 2 }
        }}
      />
      
      <motion.div 
        className="relative z-10 flex items-center justify-center h-full w-full"
        animate={{
          rotate: isHovered ? [0, -3, 3, 0] : 0
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {href ? (
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            {content}
          </a>
        ) : (
          <div onClick={onClick}>
            {content}
          </div>
        )}
      </TooltipTrigger>
      <TooltipContent side="top">{tooltip}</TooltipContent>
    </Tooltip>
  );
};

export default function Navbar() {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  // Auto-hide navbar on scroll down
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-center py-3"
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: isVisible ? 0 : 100,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          mass: 0.8
        }}
      >
        {/* Desktop version */}
        <motion.div 
          className="hidden md:block"
          layout
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <motion.div
            className="mx-auto flex gap-2 rounded-3xl border border-border/20 p-3 shadow-2xl"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
            }}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 25,
              delay: 0.1
            }}
          >
            {/* Navigation buttons */}
            {DATOS.navegacion.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (index * 0.05) }}
              >
                <NavButton
                  item={item}
                  isActive={isActive(item.href)}
                  isHovered={hoveredItem === item.href}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                />
              </motion.div>
            ))}

            {/* Separator */}
            <motion.div
              className="flex items-center justify-center px-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Separator 
                orientation="vertical" 
                className="h-8 bg-border/30" 
              />
            </motion.div>

            {/* Social icons */}
            {Object.entries(DATOS.contacto.social)
              .filter(([, social]) => social.navbar)
              .map(([name, social], index) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + (index * 0.05) }}
                >
                  <IconButton
                    href={social.url}
                    tooltip={name}
                  >
                    {getIcon(social.icon, { 
                      className: "w-5 h-5 text-foreground/70 hover:text-foreground transition-colors" 
                    })}
                  </IconButton>
                </motion.div>
              ))}

            {/* Another separator */}
            <motion.div
              className="flex items-center justify-center px-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Separator 
                orientation="vertical" 
                className="h-8 bg-border/30" 
              />
            </motion.div>

            {/* Theme toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <IconButton tooltip="Cambiar tema">
                <ModeToggle />
              </IconButton>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Mobile version - Simplified but still smooth */}
        <motion.div 
          className="md:hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 25,
            delay: 0.1
          }}
        >
          <div 
            className="mx-auto flex gap-3 rounded-3xl border border-border/20 p-3 shadow-2xl"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
            }}
          >
            {DATOS.navegacion.map((item, index) => (
              <motion.div
                key={item.href}
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 400 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  to={item.href}
                  className={cn(
                    "flex aspect-square w-11 h-11 items-center justify-center rounded-2xl transition-all duration-300",
                    isActive(item.href) 
                      ? "bg-primary/20 text-primary shadow-lg" 
                      : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                </Link>
                {isActive(item.href) && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 w-1 h-1 bg-primary rounded-full"
                    layoutId="mobile-indicator"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    style={{ x: "-50%" }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}