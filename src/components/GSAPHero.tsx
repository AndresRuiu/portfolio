import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { useTextAnimations, useMagneticEffects, useGSAPResponsive } from '@/hooks/useGSAPAnimations';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GSAPHeroProps {
  nombre: string;
  description: string;
  urlAvatar: string;
  iniciales: string;
  onContactClick: () => void;
}

export default function GSAPHero({ 
  nombre, 
  description, 
  urlAvatar, 
  iniciales, 
  onContactClick 
}: GSAPHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroDescRef = useRef<HTMLParagraphElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const projectsButtonRef = useRef<HTMLButtonElement>(null);
  
  const { scrambleReveal, typewriterReveal } = useTextAnimations();
  const { createMagneticButton, magneticEffect } = useMagneticEffects();
  const { isMobile, prefersReducedMotion, gsap } = useGSAPResponsive();
  

  useGSAP(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current) return;
      
      // Establecer estado inicial seguro
      gsap.set([heroTitleRef.current, heroDescRef.current], {
        opacity: 1,
        visibility: 'visible'
      });

      // Timeline principal con animaciones originales
      const tl = gsap.timeline({ delay: 0.3 });

      // Título - usar scramble effect si no es móvil
      if (heroTitleRef.current) {
        // Estado inicial garantizado
        gsap.set(heroTitleRef.current, {
          opacity: 1,
          visibility: 'visible',
          zIndex: 10,
          display: 'block'
        });
        
        if (!isMobile) {
          // Scramble animation para desktop
          const scrambleAnim = scrambleReveal(heroTitleRef.current);
          if (scrambleAnim) {
            tl.add(scrambleAnim, 0);
            // CALLBACK DE MONITOREO
            tl.call(() => {
              console.log('🚀 Scramble completado - verificando visibilidad:', {
                element: heroTitleRef.current,
                opacity: heroTitleRef.current?.style.opacity,
                visibility: heroTitleRef.current?.style.visibility,
                display: heroTitleRef.current?.style.display
              });
            }, [], 2); // 2 segundos después del inicio
          } else {
            // Fallback si scramble falla
            tl.fromTo(heroTitleRef.current, 
              { opacity: 0, y: 50, rotationX: -90 },
              { 
                opacity: 1, 
                y: 0, 
                rotationX: 0, 
                duration: 1.2, 
                ease: "back.out(1.7)",
                clearProps: "rotationX,y",
                onComplete: () => {
                  gsap.set(heroTitleRef.current, { 
                    opacity: 1, 
                    visibility: 'visible',
                    zIndex: 10 
                  });
                }
              },
              0
            );
          }
        } else {
          // Animación simple para móvil
          tl.fromTo(heroTitleRef.current, 
            { opacity: 0, y: 30, scale: 0.9 },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              duration: 1, 
              ease: "power3.out",
              clearProps: "y,scale",
              onComplete: () => {
                gsap.set(heroTitleRef.current, { 
                  opacity: 1, 
                  visibility: 'visible',
                  zIndex: 10 
                });
              }
            },
            0
          );
        }
      }

      // Descripción - usar typewriter effect
      if (heroDescRef.current) {
        const typewriterAnim = typewriterReveal(heroDescRef.current);
        if (typewriterAnim) {
          tl.add(typewriterAnim, isMobile ? 0.4 : 0.8);
        } else {
          // Fallback
          tl.fromTo(heroDescRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
            isMobile ? 0.4 : 0.8
          );
        }
      }

      // Botones con efecto magnético
      const buttons = [ctaButtonRef.current, projectsButtonRef.current].filter(Boolean);
      if (buttons.length > 0) {
        tl.fromTo(buttons,
          {
            opacity: 0,
            y: 40,
            scale: 0.8,
            rotation: -5
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 1,
            stagger: 0.15,
            ease: "elastic.out(1, 0.6)"
          },
          1
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, { scope: containerRef });

  // Configurar avatar magnético separadamente
  useGSAP(() => {
    if (!avatarRef.current || prefersReducedMotion || isMobile) return;

    const avatar = avatarRef.current;
    
    // Animación de entrada del avatar
    gsap.fromTo(avatar, 
      {
        opacity: 0,
        scale: 0.8,
        rotation: -15,
        filter: "blur(10px)"
      },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        filter: "blur(0px)",
        duration: 1.5,
        delay: 1.8,
        ease: "elastic.out(1, 0.5)"
      }
    );

    // Efecto magnético del avatar
    const cleanup = magneticEffect(avatar, 2);

    // Hover effect adicional
    const handleMouseEnter = () => {
      gsap.to(avatar, {
        scale: 1.1,
        rotation: 5,
        filter: "brightness(1.1) saturate(1.2)",
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(avatar, {
        scale: 1,
        rotation: 0,
        filter: "brightness(1) saturate(1)",
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    };

    avatar.addEventListener('mouseenter', handleMouseEnter);
    avatar.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cleanup?.();
      avatar.removeEventListener('mouseenter', handleMouseEnter);
      avatar.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, { scope: containerRef });

  // Configurar botones magnéticos - sin efectos glitch problemáticos
  useEffect(() => {
    const cleanupCTA = ctaButtonRef.current ? createMagneticButton(ctaButtonRef.current) : undefined;
    const cleanupProjects = projectsButtonRef.current ? createMagneticButton(projectsButtonRef.current) : undefined;
    
    // NO añadir efectos glitch al título para evitar problemas de rendimiento y duplicación
    // El título permanece estático sin efectos hover
    
    // NO añadir glitch al avatar para evitar destellos molestos
    // Solo mantener el efecto magnético que se configura en otro useEffect
    
    return () => {
      cleanupCTA?.();
      cleanupProjects?.();
    };
  }, [createMagneticButton]);

  return (
    <section 
      ref={containerRef}
      className="container mx-auto px-4 py-12 relative min-h-screen flex items-center justify-center"
    >
      
      <div className="mx-auto w-full max-w-6xl">
        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col items-center space-y-8 text-center">
          {/* Avatar First on Mobile */}
          <div ref={avatarRef} className="gsap-avatar magnetic-element">
            <Avatar className="size-48 border-2 border-primary/20 shadow-2xl">
              <AvatarImage alt={nombre} src={urlAvatar} loading="eager" />
              <AvatarFallback>{iniciales}</AvatarFallback>
            </Avatar>
          </div>

          {/* Title and Description */}
          <div className="space-y-6">
            <h1 
              ref={heroTitleRef}
              className="text-4xl font-bold tracking-tighter gsap-hero-title"
              style={{
                color: 'hsl(var(--foreground))',
                textShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
                userSelect: 'none',
                pointerEvents: 'none'
              }}
            >
              {`Hola, soy ${nombre.split(" ")[0]}`}
            </h1>
            
            <p 
              ref={heroDescRef}
              className="text-sm text-muted-foreground leading-relaxed px-4 gsap-hero-desc"
            >
              {description}
            </p>
          </div>

          {/* Full Width Buttons */}
          <div className="flex flex-col gap-4 w-full px-4">
            <button
              ref={ctaButtonRef}
              onClick={onContactClick}
              className="gsap-magnetic-btn group relative w-full px-6 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 overflow-hidden"
            >
              <MessageCircle className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="font-medium">¡Conversemos de tu idea!</span>
            </button>
            
            <Link to="/proyectos" className="w-full">
              <button
                ref={projectsButtonRef}
                className="gsap-magnetic-btn w-full px-6 py-4 border border-border rounded-xl hover:bg-muted/50 transition-all duration-300 flex items-center justify-center gap-2 group backdrop-blur-sm"
              >
                <span className="font-medium">Ver proyectos</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex gap-8 justify-between items-center">
          <div className="flex-col flex flex-1 space-y-8 text-left">
            <h1 
              ref={heroTitleRef}
              className="text-6xl xl:text-7xl font-bold tracking-tighter gsap-hero-title"
              style={{
                color: 'hsl(var(--foreground))',
                textShadow: '0 6px 40px rgba(0, 0, 0, 0.4)',
                userSelect: 'none',
                pointerEvents: 'none'
              }}
            >
              {`Hola, soy ${nombre.split(" ")[0]}`}
            </h1>
            
            <p 
              ref={heroDescRef}
              className="max-w-[600px] text-lg text-muted-foreground leading-relaxed gsap-hero-desc"
              style={{
                opacity: 1,
                visibility: 'visible',
                display: 'block',
                transform: 'none'
              }}
            >
              {description}
            </p>
            
            {/* Desktop CTA Buttons */}
            <div className="flex gap-6">
              <button
                ref={ctaButtonRef}
                onClick={onContactClick}
                className="gsap-magnetic-btn group relative px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 overflow-hidden"
              >
                <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="font-medium text-lg">¡Conversemos de tu idea!</span>
              </button>
              
              <Link to="/proyectos">
                <button
                  ref={projectsButtonRef}
                  className="gsap-magnetic-btn px-8 py-4 border border-border rounded-xl hover:bg-muted/50 transition-all duration-300 flex items-center justify-center gap-3 group backdrop-blur-sm"
                >
                  <span className="font-medium text-lg">Ver proyectos</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
          
          <div ref={avatarRef} className="gsap-avatar magnetic-element">
            <Avatar className="size-64 border-4 border-primary/20 shadow-2xl">
              <AvatarImage alt={nombre} src={urlAvatar} loading="eager" />
              <AvatarFallback>{iniciales}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </section>
  );
}