import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useGSAP } from '@gsap/react';
import { Download, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePortfolioCompleto, useProyectosDestacados } from '@/hooks/usePortfolioSupabase';
import { adapters } from '@/lib/adapters';
import Layout from '@/components/Layout';
import { Icons } from '@/components/ui/icons';
import { getIcon } from '@/lib/iconResolver';
import { ModalSkeleton } from '@/components/LoadingFallbacks';
import { useKeyboardNavigation } from '@/hooks/useNavigation';
import { useMagneticHover } from '@/hooks/useMagneticHover';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BentoGrid } from '@/components/BentoGrid';
import GSAPHero from '@/components/GSAPHero';
import { Project } from '@/types';
import { 
  UnifiedCard, 
  UnifiedCardHeader, 
  UnifiedCardTitle, 
  UnifiedCardDescription, 
  UnifiedCardContent,
  UnifiedCardFooter,
  UnifiedGrid
} from '@/components/ui/UnifiedCard';

const ContactModal = React.lazy(() => import('@/components/ContactModal'));
const ProjectModal = React.lazy(() => import('@/components/ProjectModal'));

interface ProjectForModal {
  id: string;
  titulo: string;
  fechas: string;
  descripcion?: string;
  imagen?: string;
  tecnologias: readonly string[];
  destacado?: boolean;
  enlaces: readonly {
    tipo: string;
    href: string;
    icon: string;
  }[];
}

const HomePage = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectForModal | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [sourceElement, setSourceElement] = useState<Element | null>(null);
  
  const bentoGridRef = useRef<HTMLElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const skillsSectionRef = useRef<HTMLElement>(null);
  const servicesSectionRef = useRef<HTMLElement>(null);
  const projectsSectionRef = useRef<HTMLElement>(null);
  const contactSectionRef = useRef<HTMLElement>(null);
  
  // useSmoothScroll(); // Deshabilitado por performance
  
  // Registrar ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  
  // Media queries y preferencias
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Mantener FLIP animations deshabilitadas
  // const { createHoverFLIP, gsap } = useFLIPAnimations();
  
  // Obtener datos desde Supabase
  const portfolioData = usePortfolioCompleto();
  const {
    // Datos personales (estáticos)
    nombre,
    description,
    resumen,
    habilidades,
    contacto,
    urlAvatar,
    iniciales,
    // Datos dinámicos desde Supabase
    servicios
    // Estados de carga - removed unused hasError, proyectos, testimonios
  } = portfolioData;
  
  // Obtener proyectos destacados específicamente
  const { 
    data: proyectosDestacadosRaw = []
    // Removed unused isLoadingDestacados
  } = useProyectosDestacados();
  
  // Adaptar los proyectos destacados a tipos del frontend
  const proyectosDestacados = proyectosDestacadosRaw ? adapters.projects(proyectosDestacadosRaw) : [];

  // Keyboard navigation
  useKeyboardNavigation(() => {
    setIsContactModalOpen(false);
    setIsProjectModalOpen(false);
  });

  // Magnetic hover effects for buttons and interactive elements
  useMagneticHover('button', { 
    strength: 0.2, 
    speed: 0.3, 
    lightEffect: true,
    morphing: true 
  });
  
  useMagneticHover('.unified-card', { 
    strength: 0.1, 
    speed: 0.4, 
    lightEffect: true 
  });
  
  useMagneticHover('a[href]', { 
    strength: 0.15, 
    speed: 0.25, 
    lightEffect: true 
  });

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const handleProjectClick = (proyecto: Project, element?: Element) => {
    // Convert Project to ProjectForModal
    const projectForModal: ProjectForModal = {
      id: proyecto.titulo, // Use titulo as id since Project doesn't have id
      titulo: proyecto.titulo,
      fechas: proyecto.fechas,
      descripcion: proyecto.descripcion,
      imagen: proyecto.imagen,
      tecnologias: proyecto.tecnologias ? Array.from(proyecto.tecnologias) as readonly string[] : [] as readonly string[],
      destacado: proyecto.activo,
      enlaces: Array.from(proyecto.enlaces)
    };
    setSelectedProject(projectForModal);
    setSourceElement(element || null);
    setIsProjectModalOpen(true);
  };

  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false);
    setSelectedProject(null);
    setSourceElement(null);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // GSAP Animations - Implementación directa y funcional
  useGSAP(() => {
    // Si el usuario prefiere reducir movimiento, no animar
    if (prefersReducedMotion) return;
    
    // Limpiar animaciones previas
    ScrollTrigger.getAll().forEach(st => st.kill());
    
    // 1. About Section - "Mi historia" con texto de izquierda a derecha
    if (aboutSectionRef.current) {
      const aboutTitle = aboutSectionRef.current.querySelector('h2');
      const aboutText = aboutSectionRef.current.querySelector('p');
      
      if (aboutTitle) {
        gsap.fromTo(aboutTitle, 
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: aboutTitle,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
      
      if (aboutText) {
        gsap.fromTo(aboutText, 
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            delay: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: aboutText,
              start: "top 75%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }

    // 2. Skills Section - "Stack tecnológico" badges con animación bottom-to-up como bloques
    if (skillsSectionRef.current) {
      const skillsTitle = skillsSectionRef.current.querySelector('h2');
      const skillsBadges = skillsSectionRef.current.querySelectorAll('.badge');
      
      if (skillsTitle) {
        gsap.fromTo(skillsTitle, 
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: skillsTitle,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
      
      if (skillsBadges.length > 0) {
        gsap.fromTo(skillsBadges, 
          { opacity: 0, y: 40, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
            stagger: 0.1,
            scrollTrigger: {
              trigger: skillsBadges[0],
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }

    // 3. Services Section
    if (servicesSectionRef.current) {
      const servicesTitle = servicesSectionRef.current.querySelector('h2');
      const serviceCards = servicesSectionRef.current.querySelectorAll('.unified-card');
      
      if (servicesTitle) {
        gsap.fromTo(servicesTitle, 
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: servicesTitle,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
      
      if (serviceCards.length > 0) {
        gsap.fromTo(serviceCards, 
          { opacity: 0, y: 50, rotationX: 15 },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.2,
            scrollTrigger: {
              trigger: serviceCards[0],
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }

    // 4. Projects Section
    if (projectsSectionRef.current) {
      const projectsTitle = projectsSectionRef.current.querySelector('h2');
      const projectCards = projectsSectionRef.current.querySelectorAll('.project-card');
      
      if (projectsTitle) {
        gsap.fromTo(projectsTitle, 
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: projectsTitle,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
      
      if (projectCards.length > 0) {
        gsap.fromTo(projectCards, 
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: projectCards[0],
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }

    // 5. Contact Section
    if (contactSectionRef.current) {
      const contactTitle = contactSectionRef.current.querySelector('h2');
      const socialLinks = contactSectionRef.current.querySelectorAll('a[href*="linkedin"], a[href*="github"], a[target="_blank"]');
      const contactInfo = contactSectionRef.current.querySelectorAll('.grid.grid-cols-1 > div');
      const actionButtons = contactSectionRef.current.querySelectorAll('button, a[download]');
      
      if (contactTitle) {
        gsap.fromTo(contactTitle, 
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: contactTitle,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
      
      if (socialLinks.length > 0) {
        gsap.fromTo(socialLinks, 
          { opacity: 0, y: 30, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
            stagger: 0.1,
            delay: 0.2,
            scrollTrigger: {
              trigger: socialLinks[0],
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
      
      if (contactInfo.length > 0) {
        gsap.fromTo(contactInfo, 
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1,
            delay: 0.4,
            scrollTrigger: {
              trigger: contactInfo[0],
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
      
      if (actionButtons.length > 0) {
        gsap.fromTo(actionButtons, 
          { opacity: 0, y: 40, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "back.out(1.7)",
            stagger: 0.1,
            delay: 0.6,
            scrollTrigger: {
              trigger: actionButtons[0],
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }

    // 6. BentoGrid Section - Animación mejorada para cada card
    if (bentoGridRef.current) {
      const bentoCards = bentoGridRef.current.querySelectorAll('.bento-card');
      
      if (bentoCards.length > 0) {
        // Animar las cards del bento grid con diferentes efectos según su tamaño
        bentoCards.forEach((card, index) => {
          const isLargeCard = card.classList.contains('lg:col-span-2');
          const delay = index * 0.08;
          
          gsap.fromTo(card, 
            { 
              opacity: 0, 
              y: isLargeCard ? 60 : 40,
              scale: 0.92,
              rotationX: 8
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotationX: 0,
              duration: isLargeCard ? 1 : 0.7,
              delay: delay,
              ease: "back.out(1.4)",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none reverse"
              }
            }
          );
          
          // Animar elementos internos de cada card con más detalle
          const icons = card.querySelectorAll('svg, .text-3xl, .text-6xl');
          const numbers = card.querySelectorAll('.text-3xl:not(.text-6xl)');
          const texts = card.querySelectorAll('p, .text-sm, h3, h4');
          
          if (icons.length > 0) {
            gsap.fromTo(icons, 
              { scale: 0, rotation: -45 },
              {
                scale: 1,
                rotation: 0,
                duration: 0.6,
                delay: delay + 0.3,
                ease: "back.out(2)",
                stagger: 0.1,
                scrollTrigger: {
                  trigger: card,
                  start: "top 85%",
                  toggleActions: "play none none reverse"
                }
              }
            );
          }
          
          if (numbers.length > 0) {
            gsap.fromTo(numbers, 
              { scale: 0.5, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                delay: delay + 0.4,
                ease: "elastic.out(1, 0.3)",
                scrollTrigger: {
                  trigger: card,
                  start: "top 85%",
                  toggleActions: "play none none reverse"
                }
              }
            );
          }
          
          if (texts.length > 0) {
            gsap.fromTo(texts, 
              { opacity: 0, y: 10 },
              {
                opacity: 1,
                y: 0,
                duration: 0.4,
                delay: delay + 0.5,
                ease: "power2.out",
                stagger: 0.05,
                scrollTrigger: {
                  trigger: card,
                  start: "top 85%",
                  toggleActions: "play none none reverse"
                }
              }
            );
          }
        });
      }
    }
  });
  
  // Obtener servicios principales (los 2 primeros)
  const serviciosPrincipales = servicios.slice(0, 2);

  return (
    <Layout>
      {/* GSAP Hero Section */}
      <GSAPHero 
        nombre={nombre || 'Andrés Ruiu'}
        description={description || 'Desarrollador Full Stack'}
        urlAvatar={urlAvatar || '/yo.webp'}
        iniciales={iniciales || 'AR'}
        onContactClick={handleContactClick}
      />

      {/* Bento Grid Section */}
      <section ref={bentoGridRef} className="container mx-auto px-4 py-16">
        <BentoGrid />
      </section>

      {/* Enhanced About Section */}
      <section ref={aboutSectionRef} id="about" className="container mx-auto pb-8">
        <h2 className="text-3xl md:text-2xl font-bold mb-6 text-center md:text-left bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent performance-optimized">
          Mi historia
        </h2>
        <UnifiedCard variant="gradient" size="lg">
          <UnifiedCardContent>
            <p className="text-muted-foreground text-center md:text-left leading-relaxed text-base no-word-break">
              {resumen || 'Cargando mi historia...'}
            </p>
          </UnifiedCardContent>
        </UnifiedCard>
      </section>

      {/* Enhanced Skills Section */}
      <section ref={skillsSectionRef} id="skills" className="container mx-auto mt-8">
        <h2 className="text-3xl md:text-2xl font-bold mb-6 text-center md:text-left bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent performance-optimized">
          Mi stack tecnológico
        </h2>
        <UnifiedCard variant="subtle" size="lg">
          <UnifiedCardContent>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {habilidades?.map((skill) => (
                <Badge 
                  key={skill}
                  variant="secondary" 
                  className="badge px-4 py-2 text-sm bg-muted/70 hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-pointer shadow-md"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </UnifiedCardContent>
        </UnifiedCard>
      </section>

      {/* Preview de Servicios */}
      <section ref={servicesSectionRef} className="container mx-auto pt-16 pb-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent performance-optimized">
            Servicios
          </h2>
          <Link to="/servicios">
            <Button variant="outline" className="flex items-center gap-2 morphing-button morphing-secondary">
              <span className="text-morph">Ver todos</span>
              <ArrowRight className="w-4 h-4 icon-morph" />
            </Button>
          </Link>
        </div>
        
        <UnifiedGrid columns={2} gap="md">
          {serviciosPrincipales.map((servicio) => (
            <UnifiedCard
              key={servicio.titulo}
              variant="highlight"
              size="md"
              hover={true}
              className="unified-card"
            >
              <UnifiedCardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{servicio.icono}</span>
                  <UnifiedCardTitle size="md">{servicio.titulo}</UnifiedCardTitle>
                </div>
              </UnifiedCardHeader>
              <UnifiedCardContent>
                <UnifiedCardDescription className="mb-4">
                  {servicio.descripcion}
                </UnifiedCardDescription>
                <div className="flex flex-wrap gap-2">
                  {servicio.tecnologias.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {servicio.tecnologias.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{servicio.tecnologias.length - 3} más
                    </Badge>
                  )}
                </div>
              </UnifiedCardContent>
            </UnifiedCard>
          ))}
        </UnifiedGrid>
      </section>

      {/* Preview de Proyectos */}
      <section ref={projectsSectionRef} className="container mx-auto pt-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent performance-optimized">
            Proyectos Destacados
          </h2>
          <Link to="/proyectos">
            <Button variant="outline" className="flex items-center gap-2 morphing-button liquid-morph">
              <span className="text-morph">Ver todos</span>
              <ArrowRight className="w-4 h-4 icon-morph" />
            </Button>
          </Link>
        </div>
        
        <UnifiedGrid columns={3} gap="md">
          {proyectosDestacados.map((proyecto) => (
            <UnifiedCard
              key={proyecto.titulo}
              variant="default"
              size="md"
              hover={true}
              className="overflow-hidden group cursor-pointer project-card"
              onClick={() => {
                handleProjectClick(proyecto);
              }}
            >
              {proyecto.imagen && (
                <div className="relative overflow-hidden -m-6 mb-4">
                  <img 
                    src={proyecto.imagen} 
                    alt={proyecto.titulo}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {proyecto.activo && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500 text-white">Activo</Badge>
                    </div>
                  )}
                </div>
              )}
              
              <UnifiedCardHeader>
                <UnifiedCardTitle size="sm" className="group-hover:text-primary transition-colors">
                  {proyecto.titulo}
                </UnifiedCardTitle>
              </UnifiedCardHeader>
              
              <UnifiedCardContent>
                <UnifiedCardDescription className="mb-4 line-clamp-2">
                  {proyecto.descripcion}
                </UnifiedCardDescription>
                <div className="flex flex-wrap gap-2 mb-4">
                  {proyecto.tecnologias.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {proyecto.tecnologias.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{proyecto.tecnologias.length - 3}
                    </Badge>
                  )}
                </div>
              </UnifiedCardContent>
              
              <UnifiedCardFooter>
                <div className="flex gap-2">
                  {proyecto.enlaces.slice(0, 2).map((enlace, linkIndex) => (
                    <Button
                      key={linkIndex}
                      variant="outline"
                      size="sm"
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <a 
                        href={enlace.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        {getIcon(enlace.icon, { className: "size-3" })}
                        {enlace.tipo}
                      </a>
                    </Button>
                  ))}
                  {proyecto.enlaces.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-primary hover:text-primary/80"
                    >
                      +{proyecto.enlaces.length - 2} más
                    </Button>
                  )}
                </div>
              </UnifiedCardFooter>
            </UnifiedCard>
          ))}
        </UnifiedGrid>
      </section>

      {/* Enhanced Contact Section */}
      <section ref={contactSectionRef} id="contact" className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent performance-optimized">
            ¿Tienes un proyecto en mente?
          </h2>
          
          <div className="max-w-2xl mx-auto">
            <UnifiedCard variant="glass" size="xl">
              <div className="flex flex-col items-center space-y-6">
              {/* Social Links */}
              <div className="flex justify-center space-x-6">
                {Object.values(contacto?.social || {})
                  .filter(social => social.navbar)
                  .map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-muted/50 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-md hover:scale-110 hover:-translate-y-1"
                    >
                      {getIcon(social.icon, { className: "size-6" })}
                    </a>
                  ))}
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-xl hover:scale-105 transition-transform">
                  <Icons.email className="size-5 text-primary" />
                  <span className="text-sm font-medium">{contacto?.email || 'Cargando...'}</span>
                </div>

                <a
                  href={`https://wa.me/54${contacto?.tel || ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-xl hover:bg-green-500/20 transition-colors hover:scale-105"
                >
                  <Icons.whatsapp className="size-5 text-green-500" />
                  <span className="text-sm font-medium">{contacto?.tel || 'Cargando...'}</span>
                </a>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button
                  onClick={handleContactClick}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg font-medium hover:scale-105 hover:-translate-y-1 morphing-button morphing-primary glow-morph"
                >
                  <MessageCircle className="size-5 icon-morph" />
                  <span className="text-morph">Hablemos</span>
                </button>

                <a
                  href="/CV-Andres-Ruiu.pdf"
                  download
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 border border-border rounded-xl hover:bg-muted/50 transition-all duration-300 shadow-md font-medium hover:scale-105 hover:-translate-y-1 morphing-button elastic-morph"
                >
                  <Download className="size-5 icon-morph" />
                  <span className="text-morph">Descargar CV</span>
                </a>
              </div>
              </div>
            </UnifiedCard>
          </div>
        </div>
      </section>
      
      {/* Contact Modal */}
      {isContactModalOpen && (
        <Suspense fallback={<ModalSkeleton />}>
          <ContactModal
            isOpen={isContactModalOpen}
            onClose={() => setIsContactModalOpen(false)}
          />
        </Suspense>
      )}
      
      {/* Project Modal */}
      {isProjectModalOpen && selectedProject && (
        <Suspense fallback={<ModalSkeleton />}>
          <ProjectModal
            project={selectedProject}
            isOpen={isProjectModalOpen}
            onClose={handleCloseProjectModal}
            sourceElement={sourceElement}
          />
        </Suspense>
      )}
    </Layout>
  );
};

export default HomePage;
