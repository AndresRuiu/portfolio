import React, { Suspense } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import ScrollToTop from '@/components/ScrollToTop';
import { CommandPalette, useCommandPalette } from '@/components/CommandPalette';
import { useTheme } from '@/components/theme-provider';

const Particles = React.lazy(() => import('@/components/magicui/particles'));

interface LayoutProps {
  children: React.ReactNode;
  showParticles?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showParticles = true
}) => {
  const { open, setOpen } = useCommandPalette();
  const { theme } = useTheme();

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
    <main className="flex flex-col min-h-[100dvh] items-center bg-background overflow-x-hidden magnetic-environment">
      {/* Enhanced Particles Background - Full page coverage with better visibility */}
      {showParticles && (
        <Suspense fallback={<div />}>
          <Particles
            key={theme}
            className="fixed inset-0 pointer-events-none"
            quantity={10} // Solo 10 partículas para máximo rendimiento
            ease={80} // Reducir aún más la responsividad
            color={getParticleColor()}
            refresh={false}
            size={typeof window !== 'undefined' && window.innerWidth < 768 ? 3 : 4} // Partículas más pequeñas
            fullPage={true}
            vx={0.05} // Reducir movimiento horizontal
            vy={0.025} // Reducir movimiento vertical
            staticity={80} // Mayor estabilidad
          />
        </Suspense>
      )}
      
      {/* Scroll Progress Indicator */}
      <ScrollProgress />
      
      {/* Environmental Effects - DESHABILITADO por performance */}
      {/* {showEnvironmentalEffects && (
        <EnvironmentalEffects
          intensity={environmentalIntensity}
          enableDistortionField={true}
          enableQuantumFluctuations={true}
          enableEnergyWaves={false}
        />
      )} */}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-background/80 z-[1]" />
      
      <div className="w-full max-w-[90%] md:max-w-[90%] lg:max-w-[85%] xl:max-w-[75%] px-4 pb-16 relative z-10 flex-1">
        {children}
      </div>
      
      {/* Footer */}
      <Footer />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
      
      {/* Navbar fixed to viewport - outside content container */}
      <NavBar />
      
      {/* Command Palette */}
      <CommandPalette open={open} onOpenChange={setOpen} />
      
    </main>
  );
};

export default Layout;
