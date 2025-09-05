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
import { useScrollAnimations } from '@/hooks/useScrollAnimations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BentoGrid } from '@/components/BentoGrid';
import GSAPHero from '@/components/GSAPHero';
import ServiciosSection from '@/components/ServiciosSection';
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
  const servicesSectionRef = useRef<HTMLDivElement>(null);
  const projectsSectionRef = useRef<HTMLElement>(null);
  const contactSectionRef = useRef<HTMLElement>(null);
  
  // Hook de animaciones de scroll originales
  const {
    createSectionReveal,
    createTextReveal,
    createBlurTextReveal,
    createGridReveal,
    prefersReducedMotion,
    isMobile
  } = useScrollAnimations();
  
  // Registrar ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  
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

  // EFECTO MAGNÉTICO SIMPLE - UN SOLO SISTEMA GLOBAL
  useEffect(() => {
    if (isMobile || prefersReducedMotion) {
      console.log('📱 Móvil o reduced motion - sin efectos magnéticos');
      return;
    }
    
    console.log('🧢 Configurando efectos magnéticos globales...');
    
    // CLEAN MAGNETIC SYSTEM - Works with CSS transitions by using CSS custom properties
    const applyMagneticEffect = (element: Element, strength: number = 0.1) => {
      if (!(element instanceof HTMLElement)) return;
      
      // Store original transform and add magnetic CSS class
      const originalTransform = element.style.transform || '';
      element.classList.add('magnetic-active');
      
      const handleMouseEnter = () => {
        // Temporarily disable existing transitions for magnetic effect
        element.style.setProperty('--magnetic-transition', 'transform 0.2s ease-out');
        element.style.transition = 'var(--magnetic-transition)';
      };
      
      const handleMouseMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;
        
        // Use CSS transform that works with existing styles
        const currentTransform = originalTransform.replace(/translate\([^)]*\)/g, '');
        element.style.transform = `${currentTransform} translate(${deltaX}px, ${deltaY}px)`.trim();
      };
      
      const handleMouseLeave = () => {
        // Return to center with elastic effect
        element.style.setProperty('--magnetic-transition', 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)');
        element.style.transition = 'var(--magnetic-transition)';
        
        const currentTransform = originalTransform.replace(/translate\([^)]*\)/g, '');
        element.style.transform = `${currentTransform} translate(0px, 0px)`.trim();
        
        // Restore original transition after animation
        setTimeout(() => {
          element.style.removeProperty('--magnetic-transition');
          element.style.transition = '';
        }, 600);
      };
      
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
        element.classList.remove('magnetic-active');
        element.style.transform = originalTransform;
        element.style.removeProperty('--magnetic-transition');
        element.style.transition = '';
      };
    };
    
    // Apply magnetic effects with better targeting
    const timer = setTimeout(() => {
      const cleanupFunctions: (() => void)[] = [];
      
      // Specific targeting for different element types
      const magneticSelectors = [
        // Services section buttons
        'button.service-cta-btn',
        '.service-card button',
        // Project buttons
        '.unified-card button', 
        '.project-card button',
        // General buttons excluding hero and navigation
        'button:not(.gsap-magnetic-btn):not([class*="nav"]):not([class*="scroll"]):not([class*="close"]):not([class*="dialog"])',
        // Links excluding hero
        'a[href]:not(.gsap-magnetic-btn):not([class*="nav"])'
      ];
      
      let totalElements = 0;
      magneticSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        console.log(`🧲 Selector "${selector}": ${elements.length} elementos`);
        totalElements += elements.length;
        
        elements.forEach(element => {
          const cleanup = applyMagneticEffect(element, 0.12);
          if (cleanup) cleanupFunctions.push(cleanup);
        });
      });
      
      console.log(`🧲 Total elementos con efecto magnético: ${totalElements}`);
      
      return () => {
        console.log('🧹 Limpiando efectos magnéticos');
        cleanupFunctions.forEach(cleanup => cleanup());
      };
    }, 1500); // Increased delay to ensure all components are rendered
    
    return () => {
      clearTimeout(timer);
    };
  }, [servicios, isMobile, prefersReducedMotion]);

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

  // GSAP Animations - Con debugging para identificar problemas
  useGSAP(() => {
    // Si el usuario prefiere reducir movimiento, no animar
    if (prefersReducedMotion) return;
    
    // Limpiar animaciones previas
    ScrollTrigger.getAll().forEach(st => st.kill());
    
    console.log('🎬 Iniciando configuración de animaciones de scroll');
    
    // 1. About Section - "Mi historia" - CON BLUR EFFECT
    if (aboutSectionRef.current) {
      const aboutTitle = aboutSectionRef.current.querySelector('h2');
      const aboutText = aboutSectionRef.current.querySelector('p');
      
      if (aboutTitle) {
        const result = createTextReveal(aboutTitle);
        console.log('📖 About title animation:', result ? 'SUCCESS' : 'FAILED');
      }
      
      if (aboutText) {
        const result = createBlurTextReveal(aboutText, {
          start: "top 85%"
        });
        console.log('🌪️ About text blur animation:', result ? 'SUCCESS' : 'FAILED');
      }
    }

    // 2. Skills Section - "Stack tecnológico" - RESTORED
    if (skillsSectionRef.current) {
      const skillsTitle = skillsSectionRef.current.querySelector('h2');
      const skillsCard = skillsSectionRef.current.querySelector('.unified-card');
      
      if (skillsTitle) {
        const result = createTextReveal(skillsTitle);
        console.log('🛠️ Skills title animation:', result ? 'SUCCESS' : 'FAILED');
      }
      
      if (skillsCard) {
        const result = createSectionReveal(skillsCard);
        console.log('🛠️ Skills card animation:', result ? 'SUCCESS' : 'FAILED');
      }
    }

    // 3. Services Section - SKIP CTA (has its own internal animation)
    if (servicesSectionRef.current) {
      const servicesTitle = servicesSectionRef.current.querySelector('h2');
      const servicesDesc = servicesSectionRef.current.querySelector('p');
      
      if (servicesTitle) {
        const result = createTextReveal(servicesTitle);
        console.log('🏢 Services title animation:', result ? 'SUCCESS' : 'FAILED');
      }
      
      if (servicesDesc) {
        const result = createTextReveal(servicesDesc);
        console.log('🏢 Services desc animation:', result ? 'SUCCESS' : 'FAILED');
      }
      
      console.log('🏢 Services section: CTA has internal animation');
    }

    // 4. Projects Section - RESTORED
    if (projectsSectionRef.current) {
      const projectsTitle = projectsSectionRef.current.querySelector('h2');
      const projectCards = projectsSectionRef.current.querySelectorAll('.unified-card');
      
      if (projectsTitle) {
        const result = createTextReveal(projectsTitle);
        console.log('💼 Projects title animation:', result ? 'SUCCESS' : 'FAILED');
      }
      
      if (projectCards.length > 0) {
        const result = createGridReveal(projectCards);
        console.log('💼 Projects cards animation:', result ? 'SUCCESS' : 'FAILED');
      }
    }

    // 5. Contact Section - RESTORED
    if (contactSectionRef.current) {
      const contactTitle = contactSectionRef.current.querySelector('h2');
      const contactCard = contactSectionRef.current.querySelector('.unified-card');
      
      if (contactTitle) {
        const result = createTextReveal(contactTitle);
        console.log('📞 Contact title animation:', result ? 'SUCCESS' : 'FAILED');
      }
      
      if (contactCard) {
        const result = createSectionReveal(contactCard);
        console.log('📞 Contact card animation:', result ? 'SUCCESS' : 'FAILED');
      }
    }

    // 6. BentoGrid Section (FUNCIONA)
    if (bentoGridRef.current) {
      const bentoCards = bentoGridRef.current.querySelectorAll('.bento-card');
      
      console.log('📊 BentoGrid section:', { cards: bentoCards.length });
      
      if (bentoCards.length > 0) {
        const result = createGridReveal(bentoCards);
        console.log('📊 BentoGrid cards animation:', result ? 'SUCCESS' : 'FAILED');
      }
    } else {
      console.error('❌ BentoGrid section ref not found');
    }
    
    console.log('✅ Configuración de animaciones completada');
  });


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
        <UnifiedCard variant="subtle" size="lg" delay={0} data-scroll-animated="true">
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

      {/* Servicios Section - MIGRADO A GSAP */}
      <div ref={servicesSectionRef}>
        <ServiciosSection 
          servicios={servicios} 
          onContactClick={handleContactClick}
        />
      </div>

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
              data-scroll-animated="true"
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
            <UnifiedCard variant="glass" size="xl" data-scroll-animated="true">
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
