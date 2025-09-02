import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModeToggle } from '@/components/mode-toggle';
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePortfolioCompleto } from '@/hooks/usePortfolioSupabase';
import { cn } from "@/lib/utils";
import { getIcon } from '@/lib/iconResolver';
import { Link, useLocation } from 'react-router-dom';
import { useAppState } from '@/contexts/AppContext';

// Tipos para mejorar TypeScript
interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

// Componente móvil para botones de navegación con hover sutil
const MobileNavButton: React.FC<{
  item: NavItem;
  isActive: boolean;
  index: number;
}> = ({ item, isActive, index }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 400 }}
    >
      <Link
        to={item.href}
        className={cn(
          "flex aspect-square w-10 h-10 items-center justify-center rounded-2xl transition-all duration-300 active:scale-95",
          "relative", // Added for proper positioning
          isActive 
            ? "bg-primary/20 text-primary shadow-lg" 
            : "text-foreground/70 active:bg-muted/50"
        )}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onTouchCancel={() => setIsPressed(false)}
      >
        <motion.div
          className="flex items-center justify-center w-full h-full"
          animate={{
            scale: isPressed ? 0.9 : 1
          }}
          transition={{ duration: 0.1 }}
        >
          <item.icon className="w-4 h-4 flex-shrink-0" />
        </motion.div>
      </Link>
      {isActive && (
        <motion.div
          className="absolute -bottom-1 left-1/2 w-1 h-1 bg-primary rounded-full"
          layoutId="mobile-indicator"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{ x: "-50%" }}
        />
      )}
    </motion.div>
  );
};

// Componente móvil para iconos sociales
const MobileSocialButton: React.FC<{
  href: string;
  tooltip: string;
  icon: string;
}> = ({ href, tooltip, icon }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex aspect-square w-10 h-10 items-center justify-center rounded-2xl transition-all duration-300",
            "text-foreground/70 active:scale-95 active:bg-muted/50 relative" // Added relative positioning
          )}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          onTouchCancel={() => setIsPressed(false)}
        >
          <motion.div
            className="flex items-center justify-center w-full h-full"
            animate={{
              scale: isPressed ? 0.9 : 1
            }}
            transition={{ duration: 0.1 }}
          >
            {getIcon(icon, { 
              className: "w-4 h-4 transition-colors flex-shrink-0" 
            })}
          </motion.div>
        </a>
      </TooltipTrigger>
      <TooltipContent side="top">{tooltip}</TooltipContent>
    </Tooltip>
  );
};

// Componente móvil para el toggle de tema
const MobileThemeButton: React.FC = () => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "flex aspect-square w-10 h-10 items-center justify-center rounded-2xl transition-all duration-300",
            "text-foreground/70 active:scale-95 active:bg-muted/50 cursor-pointer relative" // Added relative positioning
          )}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          onTouchCancel={() => setIsPressed(false)}
        >
          <motion.div
            className="flex items-center justify-center w-full h-full"
            animate={{
              scale: isPressed ? 0.9 : 1
            }}
            transition={{ duration: 0.1 }}
          >
            <ModeToggle />
          </motion.div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">Cambiar tema</TooltipContent>
    </Tooltip>
  );
};

// Componente individual para botones con animaciones suaves
const NavButton: React.FC<{
  item: NavItem;
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
          {/* Fondo animado - Fixed for Framer Motion */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            animate={{
              opacity: isActive ? 0.2 : isHovered ? 0.8 : 0,
              scale: isActive ? 1 : isHovered ? 1 : 0.95
            }}
            style={{
              background: isActive 
                ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)))"
                : "linear-gradient(135deg, hsl(var(--muted)), hsl(var(--muted)))"
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          
          {/* Efecto de brillo en hover - Fixed for Framer Motion */}
          <motion.div
            className="absolute inset-0 rounded-xl overflow-hidden"
            style={{
              background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)"
            }}
            animate={{
              x: isHovered ? "200%" : "-100%"
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
      {/* Fondo con gradiente animado - Fixed for Framer Motion */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{
          opacity: isHovered ? 0.8 : 0,
          scale: isHovered ? 1 : 0.95
        }}
        style={{
          background: "linear-gradient(135deg, hsl(var(--muted)), hsl(var(--muted)))"
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
      
      {/* Efecto de ondas en hover - Fixed for Framer Motion */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-primary/30"
        animate={{
          opacity: isHovered ? 0.3 : 0,
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
  const [isNearFooter, setIsNearFooter] = useState(false);
  const { ui } = useAppState();
  
  // Obtener datos desde Supabase
  const portfolioData = usePortfolioCompleto();
  const { navegacion, contacto } = portfolioData;

  // Convertir navegacion de Supabase a formato NavItem
  const navItems: NavItem[] = navegacion?.map(item => ({
    href: item.href,
    icon: ({ className }: { className?: string }) => getIcon(item.icon, { className }),
    label: item.label
  })) || [];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  // Detectar proximidad al footer
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const footerThreshold = documentHeight - 200; // 200px antes del final
      
      setIsNearFooter(scrollPosition >= footerThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Ejecutar una vez al montar
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navbar visibility controlled by modal state and footer proximity
  const shouldHideNavbar = ui.hasOpenModals || isNearFooter;

  // No renderizar NavBar hasta que los datos estén cargados
  if (!navegacion || navegacion.length === 0) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {!shouldHideNavbar && (
        <motion.div
          key="navbar"
          className="fixed bottom-0 left-0 right-0 z-[9998] flex justify-center px-4"
          data-lenis-prevent
          data-navbar
          data-fixed
          style={{
            paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
          }}
          initial={{ 
            opacity: 1, 
            y: 0,
            scale: 1
          }}
          animate={{ 
            opacity: 1, 
            y: 0,
            scale: 1
          }}
          exit={{ 
            opacity: 0, 
            y: 20,
            scale: 0.95,
            transition: {
              duration: 0.2,
              ease: "easeInOut"
            }
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut"
          }}
        >
          {/* Desktop version */}
          <motion.div
            className="hidden md:block relative w-full max-w-4xl"
            layout
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
          <motion.div
            className="mx-auto flex gap-2 rounded-3xl border border-border/20 p-3 shadow-2xl w-fit max-w-full"
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
            {navItems.map((item, index) => (
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
            {contacto?.social && Object.entries(contacto.social)
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
        
        {/* Mobile version - Same structure as desktop */}
        <motion.div
          className="md:hidden relative w-full max-w-md"
          layout
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <motion.div 
            className="mx-auto flex items-center justify-center gap-1 rounded-3xl border border-border/20 p-2 shadow-2xl w-fit max-w-full"
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
            {navItems.map((item, index) => (
              <MobileNavButton
                key={item.href}
                item={item}
                isActive={isActive(item.href)}
                index={index}
              />
            ))}
            
            {/* Separator */}
            <motion.div
              className="flex items-center justify-center px-0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Separator 
                orientation="vertical" 
                className="h-6 bg-border/30" 
              />
            </motion.div>
            
            {/* Social icons for mobile */}
            {contacto?.social && Object.entries(contacto.social)
              .filter(([, social]) => social.navbar)
              .map(([name, social], index) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + (index * 0.1), type: "spring", stiffness: 400 }}
                >
                  <MobileSocialButton
                    href={social.url}
                    tooltip={name}
                    icon={social.icon}
                  />
                </motion.div>
              ))}
              
            {/* Separator */}
            <motion.div
              className="flex items-center justify-center px-0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Separator 
                orientation="vertical" 
                className="h-6 bg-border/30" 
              />
            </motion.div>
            
            {/* Theme toggle for mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55, type: "spring", stiffness: 400 }}
            >
              <MobileThemeButton />
            </motion.div>
          </motion.div>
        </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}