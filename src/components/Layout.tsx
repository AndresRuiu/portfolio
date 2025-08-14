import React, { Suspense } from 'react';
import NavBar from '@/components/NavBar';
import ScrollProgress from '@/components/ScrollProgress';
import { CommandPalette, useCommandPalette } from '@/components/CommandPalette';
import { useSmoothScrolling } from '@/hooks/useSmoothScrolling';
import { useTheme } from '@/components/theme-provider';

const Particles = React.lazy(() => import('@/components/magicui/particles'));

interface LayoutProps {
  children: React.ReactNode;
  showParticles?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showParticles = true }) => {
  const { open, setOpen } = useCommandPalette();
  const { theme } = useTheme();
  
  // Configurar smooth scrolling con Lenis - Optimizado para mobile
  useSmoothScrolling({
    duration: 0.8, // Más rápido
    easing: (t: number) => 1 - (1 - t) * (1 - t), // Easing más simple
  });

  // Enhanced theme-aware particle colors for better visibility
  const getParticleColor = () => {
    if (theme === 'dark') {
      return '#93c5fd'; // Light blue for dark mode - better visibility
    } else if (theme === 'light') {
      return '#3b82f6'; // Vibrant blue for light mode - much better visibility
    } else {
      // System - detect current preference
      if (typeof window !== 'undefined') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? '#93c5fd' : '#3b82f6';
      }
      return '#3b82f6';
    }
  };
  
  return (
    <main className="flex flex-col min-h-[100dvh] items-center bg-background overflow-x-hidden">
      {/* Enhanced Particles Background - Full page coverage with better visibility */}
      {showParticles && (
        <Suspense fallback={<div />}>
          <Particles
            key={theme}
            className="fixed inset-0"
            quantity={typeof window !== 'undefined' && window.innerWidth < 768 ? 80 : 120} // Responsive quantity
            ease={80}
            color={getParticleColor()}
            refresh={false}
            size={typeof window !== 'undefined' && window.innerWidth < 768 ? 4 : 6} // Responsive size
            fullPage={true} // Enable full page coverage
            vx={0.1} // Slight horizontal movement
            vy={0.05} // Slight vertical movement
            staticity={60} // Balanced responsiveness
          />
        </Suspense>
      )}
      
      {/* Scroll Progress Indicator */}
      <ScrollProgress />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-background/80 z-[1]" />
      
      <div className="w-full max-w-[90%] md:max-w-[90%] lg:max-w-[85%] xl:max-w-[75%] px-4 pb-16 relative z-10">
        {children}
      </div>
      
      {/* Navbar fixed to viewport - outside content container */}
      <NavBar />
      
      {/* Command Palette */}
      <CommandPalette open={open} onOpenChange={setOpen} />
    </main>
  );
};

export default Layout;
