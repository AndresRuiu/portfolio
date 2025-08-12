import React, { useState, useRef, useEffect, Suspense } from 'react';
import { 
  AnimatePresence, 
  motion, 
  useScroll, 
  useTransform
} from 'framer-motion';

// Type definitions
interface Project {
  titulo: string;
  imagen?: string;
  video?: string;
  tecnologias: string[];
  fechas: string;
  descripcion?: string;
  activo?: boolean;
  enlaces: Array<{
    tipo: string;
    href: string;
    icon: React.ReactElement;
  }>;
}

interface Servicio {
  titulo: string;
  descripcion: string;
  icono: string;
  tecnologias: string[];
  incluye: string[];
  entregables: string;
}
import { Download, MessageCircle } from 'lucide-react';
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATOS } from "@/data/resumen";
import Navbar from '@/components/NavBar';
import { Icons } from './ui/icons';
import { SectionReveal, AnimateElements, AnimatedElement } from '@/components/SectionReveal';
import ScrollProgress from './ScrollProgress';
import { ProjectsSkeleton, ServicesSkeleton, ModalSkeleton } from './LoadingFallbacks';

// Lazy loading for heavy components
const ProjectModal = React.lazy(() => import('./ProjectModal'));
const ProjectsCarousel = React.lazy(() => import('./ProjectsCarousel'));
const ContactModal = React.lazy(() => import('./ContactModal'));
const ServiciosSection = React.lazy(() => import('./ServiciosSection'));
const Particles = React.lazy(() => import('./magicui/particles'));
import { useSmoothScroll, useKeyboardNavigation } from '@/hooks/useNavigation';

const BLUR_FADE_DELAY = 0.02;

const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const heroRef = useRef(null);
  const { scrollToSection } = useSmoothScroll();
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  // Keyboard navigation
  useKeyboardNavigation(() => {
    setSelectedProject(null);
    setIsContactModalOpen(false);
  });

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleExternalLink = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const handleSmoothScroll = (sectionId: string) => {
    scrollToSection(sectionId);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex flex-col min-h-[100dvh] items-center bg-background relative overflow-x-hidden">
      {/* Enhanced Particles Background */}
      <Suspense fallback={<div />}>
        <Particles
          className="absolute inset-0 z-0"
          quantity={180}
          ease={90}
          color="#4b6faa"
          refresh={false}
          size={12}
        />
      </Suspense>
      
      {/* Scroll Progress Indicator */}
      <ScrollProgress />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-background/80 z-[1]" />
      
      <div className="w-full max-w-[90%] md:max-w-[90%] lg:max-w-[85%] xl:max-w-[75%] px-4 pb-16 relative z-10">
        <Navbar />
        
        {/* Enhanced Hero Section */}
        <SectionReveal delay={0.2}>
          <motion.section 
            ref={heroRef}
            style={{
              y: heroY,
              scale: heroScale,
              opacity: heroOpacity
            }}
            id="hero" 
            className="container mx-auto px-4 py-12 relative"
          >
            <div className="mx-auto w-full max-w-3xl space-y-8">
              <div className="gap-4 flex flex-col md:flex-row justify-between items-center">
                <div className="flex-col flex flex-1 space-y-1.5 text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center justify-center md:justify-start space-x-2 mb-6 md:mb-2">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-4xl font-bold tracking-tighter xl:text-6xl bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent"
                    >
                      {`Hola, soy ${DATOS.nombre.split(" ")[0]}`}
                    </motion.h1>
                    <motion.img 
                      src="https://fonts.gstatic.com/s/e/notoemoji/15.1/1faf0/72.png" 
                      alt="emoji" 
                      loading="lazy"
                      className="inline-block align-middle w-8 h-8 sm:w-10 sm:h-10"
                      animate={{ 
                        rotate: [0, 10, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        repeatDelay: 4,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                  <BlurFadeText
                    className="max-w-[600px] text-sm md:text-base text-muted-foreground text-center md:text-left leading-relaxed"
                    delay={BLUR_FADE_DELAY}
                    text={DATOS.description}
                  />
                  
                  {/* Enhanced CTA Buttons */}
                  <motion.div 
                    className="flex flex-col sm:flex-row gap-4 mt-8 justify-center md:justify-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <motion.button
                      onClick={handleContactClick}
                      className="group relative px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 overflow-hidden"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                      <MessageCircle className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      <span className="font-medium">¡Trabajemos juntos!</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => handleSmoothScroll('projects')}
                      className="px-6 py-3 border border-border rounded-xl hover:bg-muted/50 transition-all duration-300 flex items-center justify-center gap-2 group backdrop-blur-sm"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="font-medium">Ver proyectos</span>
                      <motion.div
                        animate={{ y: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        ↓
                      </motion.div>
                    </motion.button>
                  </motion.div>
                </div>
                <BlurFade delay={BLUR_FADE_DELAY} className="flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Avatar className="size-48 border-2 border-primary/20 shadow-2xl">
                      <AvatarImage alt={DATOS.nombre} src={DATOS.urlAvatar} loading="lazy" />
                      <AvatarFallback>{DATOS.iniciales}</AvatarFallback>
                    </Avatar>
                  </motion.div>
                </BlurFade>
              </div>
            </div>
          </motion.section>
        </SectionReveal>

        {/* Enhanced About Section */}
        <AnimateElements>
          <section id="about" className="container mx-auto pb-8">
            <AnimatedElement delay={0}>
              <h2 className="text-3xl md:text-2xl font-bold mb-6 text-center md:text-left bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Sobre mí
              </h2>
            </AnimatedElement>
            <AnimatedElement delay={0.1}>
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
                <p className="text-muted-foreground text-center md:text-left leading-relaxed text-base">
                  {DATOS.resumen}
                </p>
              </div>
            </AnimatedElement>
          </section>
        </AnimateElements>

        {/* Enhanced Skills Section */}
        <AnimateElements>
          <section id="skills" className="container mx-auto mt-8">
            <AnimatedElement delay={0}>
              <h2 className="text-3xl md:text-2xl font-bold mb-6 text-center md:text-left bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Habilidades
              </h2>
            </AnimatedElement>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {DATOS.habilidades.map((skill, index) => (
                  <AnimatedElement key={skill} delay={index * 0.05}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge 
                        variant="secondary" 
                        className="px-4 py-2 text-sm bg-muted/70 hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-pointer shadow-md"
                      >
                        {skill}
                      </Badge>
                    </motion.div>
                  </AnimatedElement>
                ))}
              </div>
            </div>
          </section>
        </AnimateElements>

        {/* Services Section */}
        <Suspense fallback={<ServicesSkeleton />}>
          <ServiciosSection
            servicios={DATOS.servicios as unknown as Servicio[]}
            onContactClick={handleContactClick}
          />
        </Suspense>

        {/* Enhanced Projects Section */}
        <SectionReveal delay={0.5}>
          <AnimateElements>
            <motion.section 
              id="projects" 
              className="container mx-auto pt-16 pb-16"
            >
              <AnimatedElement delay={0}>
                <h2 className="text-4xl sm:text-3xl font-bold text-center mb-12 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
                  Proyectos Destacados
                </h2>
              </AnimatedElement>
              
              <Suspense fallback={<ProjectsSkeleton />}>
                <ProjectsCarousel 
                  projects={DATOS.proyectos as unknown as Project[]}
                  onProjectClick={handleProjectClick}
                  handleExternalLink={handleExternalLink}
                />
              </Suspense>
            </motion.section>
          </AnimateElements>
        </SectionReveal>

        {/* Enhanced Education Section */}
        <SectionReveal delay={0.2}>
          <AnimateElements>
            <section id="education" className="container mx-auto px-4 py-12 relative">
              <div className="relative flex flex-col items-center">
                <div className="hidden md:block absolute left-1/2 top-8 bottom-0 w-0.5 bg-gradient-to-b from-primary via-muted-foreground/30 to-transparent transform -translate-x-1/2"></div>
                
                <BlurFade delay={BLUR_FADE_DELAY * 5}>
                  <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
                    Trayectoria Académica
                  </h2>
                </BlurFade>
                
                <div className="w-full space-y-12">
                  {DATOS.educacion.map((edu, index) => (
                    <BlurFade 
                      key={edu.titulo} 
                      delay={BLUR_FADE_DELAY * 6 + index * 0.1}
                      className={`
                        relative 
                        w-full 
                        flex 
                        flex-col 
                        md:flex-row
                        ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}
                        items-center
                        gap-6
                      `}
                    >
                      <motion.div 
                        className="
                          hidden
                          md:flex
                          absolute 
                          left-1/2 
                          transform 
                          -translate-x-1/2 
                          w-12 
                          h-12 
                          bg-gradient-to-br from-primary to-secondary
                          rounded-full 
                          z-10
                          items-center
                          justify-center
                          shadow-lg
                          border-4
                          border-background
                        "
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="w-4 h-4 bg-background rounded-full" />
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`
                          w-full
                          md:w-1/2 
                          bg-card/80
                          backdrop-blur-sm
                          rounded-2xl 
                          p-8 
                          border 
                          border-border/50
                          shadow-xl
                          hover:shadow-2xl 
                          transition-all
                          duration-500
                          text-center
                          md:text-left
                          group
                          hover:border-primary/30
                        `}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        {edu.logoUrl && (
                          <div className="flex justify-center md:block mb-6">
                            <motion.img 
                              src={edu.logoUrl} 
                              alt={`${edu.institucion} logo`} 
                              className="w-20 h-20 object-contain mx-auto md:mx-0 rounded-lg shadow-md"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            />
                          </div>
                        )}
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {edu.titulo}
                        </h3>
                        <p className="text-muted-foreground font-medium mb-2">{edu.institucion}</p>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground mb-4">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          {edu.inicio} - {edu.fin}
                        </div>
                        {edu.href && (
                          <motion.a 
                            href={edu.href} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-primary hover:text-secondary font-medium text-sm mt-4 group-hover:underline"
                            whileHover={{ x: 5 }}
                          >
                            Visitar institución
                            <span>→</span>
                          </motion.a>
                        )}
                      </motion.div>
                    </BlurFade>
                  ))}
                </div>
              </div>
            </section>
          </AnimateElements>
        </SectionReveal>

        {/* Enhanced Contact Section */}
        <SectionReveal delay={0.2}>
          <AnimateElements>
            <section id="contact" className="container mx-auto px-4 py-16">
              <BlurFade delay={BLUR_FADE_DELAY * 16}>
                <div className="text-center space-y-8">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
                    ¡Conectemos!
                  </h2>
                  
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
                    <div className="flex flex-col items-center space-y-6">
                      {/* Social Links */}
                      <div className="flex justify-center space-x-6">
                        {Object.values(DATOS.contacto.social)
                          .filter(social => social.navbar)
                          .map((social) => (
                            <motion.a
                              key={social.name}
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 bg-muted/50 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-md"
                              whileHover={{ scale: 1.1, y: -2, rotate: 5 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {React.createElement(social.icon, { className: "size-6" })}
                            </motion.a>
                          ))}
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <motion.div
                          className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-xl"
                          whileHover={{ scale: 1.02 }}
                        >
                          <Icons.email className="size-5 text-primary" />
                          <span className="text-sm font-medium">{DATOS.contacto.email}</span>
                        </motion.div>

                        <motion.a
                          href={`https://wa.me/54${DATOS.contacto.tel}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-xl hover:bg-green-500/20 transition-colors"
                          whileHover={{ scale: 1.02 }}
                        >
                          <Icons.whatsapp className="size-5 text-green-500" />
                          <span className="text-sm font-medium">{DATOS.contacto.tel}</span>
                        </motion.a>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <motion.button
                          onClick={handleContactClick}
                          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg font-medium"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <MessageCircle className="size-5" />
                          <span>Enviar mensaje</span>
                        </motion.button>

                        <motion.a
                          href="/CV-Andres-Ruiu.pdf"
                          download
                          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 border border-border rounded-xl hover:bg-muted/50 transition-all duration-300 shadow-md font-medium"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Download className="size-5" />
                          <span>Descargar CV</span>
                        </motion.a>
                      </div>
                    </div>
                  </div>
                </div>
              </BlurFade>
            </section>
          </AnimateElements>
        </SectionReveal>
        
        {/* Modals */}
        <AnimatePresence>
          {selectedProject && (
            <Suspense fallback={<ModalSkeleton />}>
              <ProjectModal 
                project={selectedProject} 
                onClose={() => setSelectedProject(null)} 
              />
            </Suspense>
          )}
        </AnimatePresence>

        {isContactModalOpen && (
          <Suspense fallback={<ModalSkeleton />}>
            <ContactModal
              isOpen={isContactModalOpen}
              onClose={() => setIsContactModalOpen(false)}
            />
          </Suspense>
        )}
      </div>
    </main>
  );
};

export default Portfolio;
