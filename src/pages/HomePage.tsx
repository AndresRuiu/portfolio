import React, { useState, useRef, useEffect, Suspense } from 'react';
import { 
  motion, 
  useScroll, 
  useTransform
} from 'framer-motion';
import { Download, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DATOS } from "@/data/resumen";
import Layout from '@/components/Layout';
import { Icons } from '@/components/ui/icons';
import { SectionReveal, AnimateElements, AnimatedElement } from '@/components/SectionReveal';
import { ModalSkeleton } from '@/components/LoadingFallbacks';
import { useSmoothScroll, useKeyboardNavigation } from '@/hooks/useNavigation';
import { BentoGrid } from '@/components/BentoGrid';
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

const BLUR_FADE_DELAY = 0.02;

const HomePage = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const heroRef = useRef(null);
  useSmoothScroll();
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  // Keyboard navigation
  useKeyboardNavigation(() => {
    setIsContactModalOpen(false);
  });

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };


  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Obtener proyectos destacados (los 3 más recientes)
  const proyectosDestacados = DATOS.proyectos.slice(0, 3);
  
  // Obtener servicios principales (los 2 primeros)
  const serviciosPrincipales = DATOS.servicios.slice(0, 2);

  return (
    <Layout>
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
            {/* Mobile Layout */}
            <div className="md:hidden flex flex-col items-center space-y-6">
              {/* Photo First on Mobile */}
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

              {/* Title and Description */}
              <div className="text-center space-y-4">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent"
                  >
                    {`Hola, soy ${DATOS.nombre.split(" ")[0]}`}
                  </motion.h1>
                  <motion.img 
                    src="https://fonts.gstatic.com/s/e/notoemoji/15.1/1faf0/72.png" 
                    alt="emoji" 
                    loading="lazy"
                    className="w-8 h-8"
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
                  className="text-sm text-muted-foreground text-center leading-relaxed px-4"
                  delay={BLUR_FADE_DELAY}
                  text={DATOS.description}
                />
              </div>

              {/* Full Width Buttons */}
              <motion.div 
                className="flex flex-col gap-4 w-full px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  onClick={handleContactClick}
                  className="group relative w-full px-6 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 overflow-hidden"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <MessageCircle className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span className="font-medium">¡Conversemos de tu idea!</span>
                </motion.button>
                
                <Link to="/proyectos" className="w-full">
                  <motion.button
                    className="w-full px-6 py-4 border border-border rounded-xl hover:bg-muted/50 transition-all duration-300 flex items-center justify-center gap-2 group backdrop-blur-sm"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-medium">Ver proyectos</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex gap-4 justify-between items-center">
              <div className="flex-col flex flex-1 space-y-1.5 text-left">
                <div className="flex items-center justify-start space-x-2 mb-2">
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
                  className="max-w-[600px] text-base text-muted-foreground text-left leading-relaxed"
                  delay={BLUR_FADE_DELAY}
                  text={DATOS.description}
                />
                
                {/* Desktop CTA Buttons */}
                <motion.div 
                  className="flex gap-4 mt-8 justify-start"
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
                    <span className="font-medium">¡Conversemos de tu idea!</span>
                  </motion.button>
                  
                  <Link to="/proyectos">
                    <motion.button
                      className="px-6 py-3 border border-border rounded-xl hover:bg-muted/50 transition-all duration-300 flex items-center justify-center gap-2 group backdrop-blur-sm"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="font-medium">Ver proyectos</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
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

      {/* Bento Grid Section */}
      <SectionReveal delay={0.3}>
        <section className="container mx-auto px-4 py-16">
          <BentoGrid />
        </section>
      </SectionReveal>

      {/* Enhanced About Section */}
      <AnimateElements>
        <section id="about" className="container mx-auto pb-8">
          <AnimatedElement delay={0}>
            <h2 className="text-3xl md:text-2xl font-bold mb-6 text-center md:text-left bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Mi historia
            </h2>
          </AnimatedElement>
          <AnimatedElement delay={0.1}>
            <UnifiedCard variant="gradient" size="lg">
              <UnifiedCardContent>
                <p className="text-muted-foreground text-center md:text-left leading-relaxed text-base">
                  {DATOS.resumen}
                </p>
              </UnifiedCardContent>
            </UnifiedCard>
          </AnimatedElement>
        </section>
      </AnimateElements>

      {/* Enhanced Skills Section */}
      <AnimateElements>
        <section id="skills" className="container mx-auto mt-8">
          <AnimatedElement delay={0}>
            <h2 className="text-3xl md:text-2xl font-bold mb-6 text-center md:text-left bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Mi stack tecnológico
            </h2>
          </AnimatedElement>
          <UnifiedCard variant="subtle" size="lg">
            <UnifiedCardContent>
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
            </UnifiedCardContent>
          </UnifiedCard>
        </section>
      </AnimateElements>

      {/* Preview de Servicios */}
      <SectionReveal delay={0.3}>
        <section className="container mx-auto pt-16 pb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
              Servicios
            </h2>
            <Link to="/servicios">
              <Button variant="outline" className="flex items-center gap-2">
                Ver todos
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <UnifiedGrid columns={2} gap="md">
            {serviciosPrincipales.map((servicio, index) => (
              <UnifiedCard
                key={servicio.titulo}
                variant="highlight"
                size="md"
                delay={index * 0.1}
                hover={true}
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
      </SectionReveal>

      {/* Preview de Proyectos */}
      <SectionReveal delay={0.5}>
        <section className="container mx-auto pt-8 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
              Proyectos Destacados
            </h2>
            <Link to="/proyectos">
              <Button variant="outline" className="flex items-center gap-2">
                Ver todos
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <UnifiedGrid columns={3} gap="md">
            {proyectosDestacados.map((proyecto, index) => (
              <UnifiedCard
                key={proyecto.titulo}
                variant="default"
                size="md"
                delay={index * 0.1}
                hover={true}
                className="overflow-hidden group"
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
                    {proyecto.enlaces.map((enlace, linkIndex) => (
                      <Button
                        key={linkIndex}
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a 
                          href={enlace.href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          {enlace.icon}
                          {enlace.tipo}
                        </a>
                      </Button>
                    ))}
                  </div>
                </UnifiedCardFooter>
              </UnifiedCard>
            ))}
          </UnifiedGrid>
        </section>
      </SectionReveal>

      {/* Enhanced Contact Section */}
      <SectionReveal delay={0.2}>
        <AnimateElements>
          <section id="contact" className="container mx-auto px-4 py-16">
            <BlurFade delay={BLUR_FADE_DELAY * 16}>
              <div className="text-center space-y-8">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
                  ¿Tienes un proyecto en mente?
                </h2>
                
                <div className="max-w-2xl mx-auto">
                  <UnifiedCard variant="glass" size="xl">
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
                        <span>Hablemos</span>
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
                  </UnifiedCard>
                </div>
              </div>
            </BlurFade>
          </section>
        </AnimateElements>
      </SectionReveal>
      
      {/* Contact Modal */}
      {isContactModalOpen && (
        <Suspense fallback={<ModalSkeleton />}>
          <ContactModal
            isOpen={isContactModalOpen}
            onClose={() => setIsContactModalOpen(false)}
          />
        </Suspense>
      )}
    </Layout>
  );
};

export default HomePage;
