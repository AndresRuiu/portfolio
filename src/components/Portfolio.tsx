import React, { useState, useRef, useEffect } from 'react';
import { 
  AnimatePresence, 
  motion, 
  useScroll, 
  useTransform
} from 'framer-motion';
import { Code, Download } from 'lucide-react';
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATOS } from "@/data/resumen";
import ProjectModal from './ProjectModal';
import Navbar from '@/components/NavBar';
import { Icons } from './ui/icons';
import { SectionReveal, AnimateElements, AnimatedElement }  from '@/components/SectionReveal'

const BLUR_FADE_DELAY = 0.04;

const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const handleExternalLink = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex flex-col min-h-[100dvh] items-center bg-background">
      <div className="w-full max-w-[90%] md:max-w-[90%] lg:max-w-[80%] xl:max-w-[60%] px-4 pb-16">
        <Navbar />
        
        {/* Hero Section with Parallax */}
        <SectionReveal delay={0.2}>
          <motion.section 
            ref={heroRef}
            style={{
              y: heroY,
              scale: heroScale,
              opacity: heroOpacity
            }}
            id="hero" 
            className="container mx-auto px-4 py-12"
          >
            <div className="mx-auto w-full max-w-3xl space-y-8">
              <div className="gap-4 flex flex-col md:flex-row justify-between items-center">
                <div className="flex-col flex flex-1 space-y-1.5 text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center justify-center md:justify-start space-x-2 mb-6 md:mb-2">
                    <BlurFadeText
                      delay={BLUR_FADE_DELAY}
                      className="text-4xl font-bold tracking-tighter xl:text-6xl"
                      yOffset={8}
                      text={`Hola, soy ${DATOS.nombre.split(" ")[0]}`}
                    />
                    <img 
                      src="https://fonts.gstatic.com/s/e/notoemoji/15.1/1faf0/72.png" 
                      alt="emoji" 
                      className="inline-block align-middle w-8 h-8 sm:w-10 sm:h-10"
                    />
                  </div>
                  <BlurFadeText
                    className="max-w-[600px] text-sm md:text-base text-muted-foreground text-center md:text-left"
                    delay={BLUR_FADE_DELAY}
                    text={DATOS.description}
                  />
                </div>
                <BlurFade delay={BLUR_FADE_DELAY} className="flex justify-center">
                  <Avatar className="size-48 border">
                    <AvatarImage alt={DATOS.nombre} src={DATOS.urlAvatar} />
                    <AvatarFallback>{DATOS.iniciales}</AvatarFallback>
                  </Avatar>
                </BlurFade>
              </div>
            </div>
          </motion.section>
        </SectionReveal>

        {/* About Section */}
        <AnimateElements>
          <section id="about" className="container mx-auto pb-6">
            <AnimatedElement delay={0}>
              <h2 className="text-2xl md:text-xl font-bold mb-4 text-center md:text-left">Sobre mí</h2>
            </AnimatedElement>
            <AnimatedElement delay={0.1}>
              <p className="text-muted-foreground text-center md:text-left">{DATOS.resumen}</p>
            </AnimatedElement>
          </section>
        </AnimateElements>

        {/* Skills Section */}
        <AnimateElements>
          <section id="skills" className="container mx-auto mt-6">
            <AnimatedElement delay={0}>
              <h2 className="text-2xl md:text-xl font-bold mb-4 text-center md:text-left">Habilidades</h2>
            </AnimatedElement>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {DATOS.habilidades.map((skill, index) => (
                <AnimatedElement key={skill} delay={index * 0.05}>
                  <Badge variant="secondary">{skill}</Badge>
                </AnimatedElement>
              ))}
            </div>
          </section>
        </AnimateElements>

        {/* Projects Section */}
        <SectionReveal delay={0.5}>
          <AnimateElements>
          <motion.section 
            id="projects" 
            className="container mx-auto pt-12 pb-12"
          >
            <AnimatedElement delay={0}>
              <h2 className="text-3xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Proyectos</h2>
            </AnimatedElement>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
              {DATOS.proyectos.map((project, index) => (
                <AnimatedElement key={project.titulo} delay={index * 0.1}>
                  <motion.div 
                    className="group relative h-full"
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.12)"
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300 
                    }}
                  >
                    <div className="rounded-lg bg-card text-card-foreground flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full">
                      {project.imagen || project.video ? (
                        <div 
                          className="w-full h-40 sm:h-48 md:h-56 object-cover cursor-pointer"
                          onClick={() => setSelectedProject(project)}
                        >
                          {project.video ? (
                            <video 
                              src={project.video} 
                              className="w-full h-full object-cover"
                              muted 
                              loop 
                              playsInline
                            />
                          ) : (
                            <img 
                              src={project.imagen || '/placeholder.jpg'} 
                              alt={project.titulo}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ) : null}
                      <div className="p-3 sm:p-4 flex flex-col flex-grow">
                        <div className="flex items-center mb-2">
                          <Code className="mr-2 text-primary" size={16} sm:size={20} />
                          <h3 className="font-semibold text-sm sm:text-base">{project.titulo}</h3>
                        </div>
                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                          {project.tecnologias.map((tech) => (
                            <Badge key={tech} variant="outline" className="text-[10px] sm:text-xs">{tech}</Badge>
                          ))}
                        </div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground pb-2">{project.fechas}</p>
                        <div className="flex flex-row flex-wrap items-start gap-1 mt-auto">
                          {project.href && (
                            <Badge 
                              onClick={() => handleExternalLink(project.href)} 
                              className="flex gap-1 sm:gap-2 px-1 sm:px-2 py-0.5 sm:py-1 text-[8px] sm:text-[10px] cursor-pointer hover:bg-accent"
                            >
                              Sitio Web
                            </Badge>
                          )}
                          {project.enlaces[0] && (
                            <Badge 
                              onClick={() => handleExternalLink(project.enlaces[0].href)} 
                              className="flex gap-1 sm:gap-2 px-1 sm:px-2 py-0.5 sm:py-1 text-[8px] sm:text-[10px] cursor-pointer hover:bg-accent"
                            >
                              Repositorio
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatedElement>
              ))}
            </div>
          </motion.section>
          </AnimateElements>
        </SectionReveal>

        {/* Education Section */}
        <SectionReveal delay={0.2}>
          <AnimateElements>
          <section id="education" className="container mx-auto px-4 py-8 relative">
            <div className="relative flex flex-col items-center">
              <div className="hidden md:block absolute left-1/2 top-8 bottom-0 w-0.5 bg-muted-foreground/30 transform -translate-x-1/2"></div>
              
              <BlurFade delay={BLUR_FADE_DELAY * 5}>
                <h2 className="text-3xl font-bold text-center mb-12">Trayectoria Académica</h2>
              </BlurFade>
              
              <div className="w-full space-y-8">
                {DATOS.educacion.map((edu, index) => (
                  <BlurFade 
                    key={edu.titulo} 
                    delay={BLUR_FADE_DELAY * 6 + index * 0.05}
                    className={`
                      relative 
                      w-full 
                      flex 
                      flex-col 
                      md:flex-row
                      ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}
                      items-center
                      gap-4
                    `}
                  >
                    <div 
                      className="
                        hidden
                        md:block
                        absolute 
                        left-1/2 
                        transform 
                        -translate-x-1/2 
                        w-10 
                        h-10 
                        bg-primary 
                        rounded-full 
                        z-10
                      "
                    />

                    <motion.div 
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className={`
                        w-full
                        md:w-1/2 
                        bg-card 
                        rounded-lg 
                        p-6 
                        border 
                        shadow-sm 
                        hover:shadow-md 
                        transition-all
                        text-center
                        md:text-left
                      `}
                    >
                      {edu.logoUrl && (
                        <div className="flex justify-center md:block">
                          <img 
                            src={edu.logoUrl} 
                            alt={`${edu.institucion} logo`} 
                            className="w-16 h-16 mb-4 object-contain mx-auto md:mx-0"
                          />
                        </div>
                      )}
                      <h3 className="text-xl font-semibold">{edu.titulo}</h3>
                      <p className="text-muted-foreground">{edu.institucion}</p>
                      <p className="text-sm text-muted-foreground">
                        {edu.inicio} - {edu.fin}
                      </p>
                      {edu.href && (
                        <a 
                          href={edu.href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm mt-2 block"
                        >
                          Visitar institución
                        </a>
                      )}
                    </motion.div>
                  </BlurFade>
                ))}
              </div>
            </div>
          </section>
          </AnimateElements>
        </SectionReveal>

        {/* Contact Section */}
        <SectionReveal delay={0.2}>
          <AnimateElements>
            <section id="contact" className="container mx-auto px-4 py-12">
              <BlurFade delay={BLUR_FADE_DELAY * 16}>
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold">Contáctame</h2>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex justify-center space-x-4">
                      {Object.values(DATOS.contacto.social)
                        .filter(social => social.navbar)
                        .map((social) => (
                          <a
                            key={social.name}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {React.createElement(social.icon, { className: "size-6" })}
                          </a>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 items-center justify-center w-full">
                      <a
                        href={`mailto:${DATOS.contacto.email}`}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                      >
                        <Icons.email className="size-6" />
                        <span className="text-sm md:text-base">{DATOS.contacto.email}</span>
                      </a>

                      <a
                        href={`https://wa.me/54${DATOS.contacto.tel.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                      >
                        <Icons.whatsapp className="size-6" />
                        <span className="text-sm md:text-base">{DATOS.contacto.tel}</span>
                        </a>
                    </div>

                    <div className="flex items-center justify-center mt-6 w-full">
                      <a
                        href="/CV-Andres-Ruiu.pdf"
                        download
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors w-full max-w-xs text-center justify-center"
                      >
                        <Download className="size-5" />
                        <span>Descargar Curriculum Vitae</span>
                      </a>
                    </div>
                  </div>
                </div>
              </BlurFade>
            </section>
          </AnimateElements>
        </SectionReveal>
        
        <AnimatePresence>
          {selectedProject && (
            <ProjectModal 
              project={selectedProject} 
              onClose={() => setSelectedProject(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Portfolio;