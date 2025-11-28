import React, { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { Check, ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';
import { gsap } from 'gsap';

interface Servicio {
  titulo: string;
  descripcion: string;
  icono: string;
  tecnologias: string[];
  incluye: string[];
  entregables: string;
}

interface ServiciosProps {
  servicios: Servicio[];
  onContactClick: () => void;
}

const ServiciosSection: React.FC<ServiciosProps> = ({ servicios, onContactClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  const { 
    createSectionReveal, 
    createTextReveal, 
    createGridReveal,
    prefersReducedMotion 
  } = useScrollAnimations();

  // Detectar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  useEffect(() => {
    setCurrentIndex(0);
  }, [servicios.length]);

  const goToNext = () => {
    if (currentIndex < servicios.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch/swipe handling with vanilla JS
  const handleTouchStart = useRef<{ x: number; y: number } | null>(null);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!handleTouchStart.current) return;
    
    const touchEnd = e.changedTouches[0];
    const deltaX = touchEnd.clientX - handleTouchStart.current.x;
    const swipeThreshold = 50;
    
    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX < 0 && currentIndex < servicios.length - 1) {
        goToNext();
      } else if (deltaX > 0 && currentIndex > 0) {
        goToPrev();
      }
    }
    
    handleTouchStart.current = null;
  };

  const handleTouchStartCapture = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleTouchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  // GSAP Animations
  useGSAP(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    // Animate title
    if (titleRef.current) {
      createTextReveal(titleRef.current, {
        start: "top 85%"
      });
    }

    // Animate description
    if (descRef.current) {
      createTextReveal(descRef.current, {
        start: "top 90%"
      });
    }

    // Animate cards for desktop
    if (!isMobile && cardsRef.current.length > 0) {
      const validCards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      if (validCards.length > 0) {
        // Convert to NodeList-like for createGridReveal
        createGridReveal(validCards as any, {
          start: "top 85%"
        });
      }
    }

    // Animate CTA section
    if (ctaRef.current) {
      // Ensure initial visibility
      gsap.set(ctaRef.current, { opacity: 1, visibility: 'visible' });
      
      const result = createSectionReveal(ctaRef.current, {
        start: "top 90%"
      });
      console.log('💼 Services CTA animation setup:', result ? 'SUCCESS' : 'FAILED');
    }
  }, { dependencies: [servicios.length, isMobile, prefersReducedMotion] });

  // Mobile card transition animation
  useGSAP(() => {
    if (!isMobile || prefersReducedMotion) return;
    
    const currentCard = cardsRef.current[currentIndex];
    if (!currentCard) return;

    // Animate current card in
    gsap.fromTo(currentCard, 
      {
        opacity: 0,
        x: 50,
        scale: 0.95
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)"
      }
    );
  }, { dependencies: [currentIndex, isMobile] });

  const renderServiceCard = (servicio: Servicio, index: number) => (
    <div
      key={servicio.titulo}
      ref={el => cardsRef.current[index] = el}
      className="group relative w-full gsap-card"
      onMouseEnter={!isMobile ? (e) => {
        if (!prefersReducedMotion) {
          gsap.to(e.currentTarget, {
            y: -8,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      } : undefined}
      onMouseLeave={!isMobile ? (e) => {
        if (!prefersReducedMotion) {
          gsap.to(e.currentTarget, {
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      } : undefined}
    >
      {/* Featured Badge for Full Stack */}
      {servicio.titulo.includes('Full Stack') && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex items-center gap-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            <Star className="w-3 h-3" />
            Más Popular
          </div>
        </div>
      )}

      {/* Service Card */}
      <div className="relative h-full bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-primary/30 overflow-hidden">
        
        {/* Background Gradient Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div
              className="text-4xl service-icon"
              ref={el => {
                if (el && !prefersReducedMotion) {
                  gsap.to(el, {
                    rotation: "360_cw",
                    duration: 20,
                    ease: "none",
                    repeat: -1
                  });
                }
              }}
            >
              {servicio.icono}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {servicio.titulo}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {servicio.descripcion}
              </p>
            </div>
          </div>


          {/* Technologies - SIMPLIFIED for HomePage */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {servicio.tecnologias.slice(0, 4).map((tech, techIndex) => (
                <div
                  key={tech}
                  className={`tech-badge tech-badge-${index}-${techIndex}`}
                >
                  <Badge 
                    variant="secondary" 
                    className="bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                  >
                    {tech}
                  </Badge>
                </div>
              ))}
              {servicio.tecnologias.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{servicio.tecnologias.length - 4} más
                </Badge>
              )}
            </div>
          </div>

          {/* Key Features - SIMPLIFIED */}
          <div className="mb-6">
            <ul className="space-y-2">
              {servicio.incluye.slice(0, 3).map((item, itemIndex) => (
                <li
                  key={item}
                  className={`flex items-start gap-3 text-sm include-item include-item-${index}-${itemIndex}`}
                >
                  <div className="mt-0.5 p-0.5 bg-green-500/20 rounded-full">
                    <Check className="w-3 h-3 text-green-500" />
                  </div>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
              {servicio.incluye.length > 3 && (
                <li className="text-sm text-muted-foreground pl-6">
                  y {servicio.incluye.length - 3} características más...
                </li>
              )}
            </ul>
          </div>

          {/* CTA Button - SIMPLIFIED */}
          <div className="flex gap-3">
            <button
              onClick={onContactClick}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-md group/btn font-medium text-sm service-cta-btn"
            >
              <span>Cotizar</span>
              <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
            </button>
            <a
              href="/servicios"
              className="flex items-center justify-center px-4 py-2.5 border border-border rounded-lg hover:bg-muted/50 transition-all duration-300 text-sm font-medium"
            >
              Ver detalles
            </a>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-secondary/10 to-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} id="servicios" className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h2 
          ref={titleRef}
          className="text-4xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent"
        >
          Servicios
        </h2>
        <p 
          ref={descRef}
          className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          ¿Tienes una idea genial? Te ayudo a convertirla en realidad con código limpio y diseño moderno.
        </p>
      </div>

        {/* Desktop Grid View */}
        {!isMobile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {servicios.map((servicio, index) => renderServiceCard(servicio, index))}
          </div>
        )}

        {/* Mobile Carousel View */}
        {isMobile && servicios.length > 0 && (
          <div className="relative max-w-sm mx-auto">
            {/* Navigation Buttons */}
            {currentIndex > 0 && (
              <button
                onClick={goToPrev}
                className="absolute left-[-50px] top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-primary hover:text-primary-foreground shadow-lg transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {currentIndex < servicios.length - 1 && (
              <button
                onClick={goToNext}
                className="absolute right-[-50px] top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-primary hover:text-primary-foreground shadow-lg transition-all duration-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* Carousel Container */}
            <div
              className="overflow-hidden relative"
              onTouchStart={handleTouchStartCapture}
              onTouchEnd={handleTouchEnd}
            >
              <div className="w-full">
                {servicios[currentIndex] && renderServiceCard(servicios[currentIndex], currentIndex)}
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center items-center mt-6 gap-2">
              {servicios.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`relative overflow-hidden transition-all duration-300 ${
                    index === currentIndex 
                      ? 'w-8 h-3 bg-primary' 
                      : 'w-3 h-3 bg-muted hover:bg-muted-foreground/30'
                  } rounded-full`}
                >
                  {index === currentIndex && (
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-primary/70 to-secondary/70 rounded-full"
                      ref={el => {
                        if (el && !prefersReducedMotion) {
                          gsap.to(el, {
                            opacity: 0.7,
                            yoyo: true,
                            repeat: -1,
                            duration: 1,
                            ease: "power2.inOut"
                          });
                        }
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Swipe Indicator */}
            <div 
              className="flex justify-center mt-4"
              ref={el => {
                if (el && !prefersReducedMotion) {
                  gsap.fromTo(el, 
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.6, delay: 0.3 }
                  );
                }
              }}
            >
              <div className="text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-full backdrop-blur-sm">
                Desliza para ver más servicios
              </div>
            </div>
          </div>
        )}

        {/* Empty state for mobile when no services */}
        {isMobile && servicios.length === 0 && (
          <div className="text-center text-muted-foreground">
            Los servicios se están cargando...
          </div>
        )}

        {/* Call to Action Section */}
        <div className="mt-16 text-center">
          <div 
            ref={ctaRef}
            className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-xl max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-bold mb-4">
              ¿Tienes un proyecto en mente?
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Me encanta trabajar en proyectos nuevos. Cuéntame tu idea y juntos 
              encontraremos la mejor manera de hacerla realidad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onContactClick}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg font-medium"
              >
                Hablemos de tu proyecto
              </button>
              <a
                href="https://wa.me/543865351958?text=Hola! Me gustaría conocer más sobre tus servicios de desarrollo"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 border border-border rounded-xl hover:bg-muted/50 transition-all duration-300 shadow-md font-medium"
              >
                WhatsApp directo
              </a>
            </div>
          </div>
        </div>
      </section>
  );
};

export default ServiciosSection;
