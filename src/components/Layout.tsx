import React, { Suspense } from 'react';
import Navbar from '@/components/NavBar';
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
  
  // Configurar smooth scrolling con Lenis
  useSmoothScrolling({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  // Color dinámico de partículas basado en el tema
  const getParticleColor = () => {
    if (theme === 'dark') {
      return '#6b7280'; // Gris claro para modo oscuro
    } else if (theme === 'light') {
      return '#374151'; // Gris oscuro para modo claro
    } else {
      // Sistema - detectar preferencia actual
      if (typeof window !== 'undefined') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? '#6b7280' : '#374151';
      }
      return '#6b7280';
    }
  };
  
  return (
    <main className="flex flex-col min-h-[100dvh] items-center bg-background relative overflow-x-hidden">
      {/* Particles Background */}
      {showParticles && (
        <Suspense fallback={<div />}>
          <Particles
            key={theme} // Force re-render when theme changes
            className="absolute inset-0 z-0"
            quantity={150}
            ease={90}
            color={getParticleColor()}
            refresh={true}
            size={10}
          />
        </Suspense>
      )}
      
      {/* Scroll Progress Indicator */}
      <ScrollProgress />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-background/80 z-[1]" />
      
      <div className="w-full max-w-[90%] md:max-w-[90%] lg:max-w-[85%] xl:max-w-[75%] px-4 pb-16 relative z-10">
        <Navbar />
        {children}
      </div>
      
      {/* Command Palette */}
      <CommandPalette open={open} onOpenChange={setOpen} />
    </main>
  );
};

export default Layout;
