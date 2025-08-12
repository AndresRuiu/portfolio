import React, { Suspense } from 'react';
import Navbar from '@/components/NavBar';
import ScrollProgress from '@/components/ScrollProgress';

const Particles = React.lazy(() => import('@/components/magicui/particles'));

interface LayoutProps {
  children: React.ReactNode;
  showParticles?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showParticles = true }) => {
  return (
    <main className="flex flex-col min-h-[100dvh] items-center bg-background relative overflow-x-hidden">
      {/* Particles Background */}
      {showParticles && (
        <Suspense fallback={<div />}>
          <Particles
            className="absolute inset-0 z-0"
            quantity={120}
            ease={90}
            color="#4b6faa"
            refresh={false}
            size={8}
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
    </main>
  );
};

export default Layout;
