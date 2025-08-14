import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Code, ExternalLink, Github, Eye, Calendar, Sparkles } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ProjectSkeleton } from './LoadingStates';
import type { Project } from '@/types';

interface ProjectsCarouselProps {
  projects: readonly Project[];
  onProjectClick: (project: Project) => void;
  handleExternalLink: (url: string) => void;
}

const ProjectsCarousel: React.FC<ProjectsCarouselProps> = ({ 
  projects, 
  onProjectClick, 
  handleExternalLink 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [direction, setDirection] = useState(1);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  const projectsPerPage = windowWidth >= 1024 ? 3 : windowWidth >= 640 ? 2 : 1;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    // Simular carga inicial
    const timer = setTimeout(() => setIsLoading(false), 1500);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const goToNextPage = () => {
    if (currentIndex < totalPages - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handlePaginationDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const getCurrentProjects = () => {
    const start = currentIndex * projectsPerPage;
    return projects.slice(start, start + projectsPerPage);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipeThreshold = 100;
    if (info.offset.x < -swipeThreshold && currentIndex < totalPages - 1) {
      goToNextPage();
    } else if (info.offset.x > swipeThreshold && currentIndex > 0) {
      goToPrevPage();
    }
  };

  const getIconForLinkType = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'repositorio':
        return <Github className="w-4 h-4" />;
      case 'sitio web':
        return <ExternalLink className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  };

  const pageVariants = {
    initial: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 300 : -300,
      scale: 0.8,
    }),
    in: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    },
    out: (direction: number) => ({
      opacity: 0,
      x: direction < 0 ? 300 : -300,
      scale: 0.8,
      transition: {
        duration: 0.3
      }
    })
  };

  if (isLoading) {
    return (
      <div className="relative w-full">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {Array.from({ length: projectsPerPage }).map((_, index) => (
            <motion.div key={index} variants={cardVariants}>
              <ProjectSkeleton />
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full" ref={carouselRef}>
      {/* Navigation Buttons */}
      <AnimatePresence>
        {currentIndex > 0 && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={goToPrevPage}
            className="absolute left-[-80px] xl:left-[-100px] top-1/2 -translate-y-1/2 z-10 p-4 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-primary hover:text-primary-foreground shadow-lg transition-all duration-300 group hidden lg:flex items-center justify-center"
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </motion.button>
        )}

        {currentIndex < totalPages - 1 && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={goToNextPage}
            className="absolute right-[-80px] xl:right-[-100px] top-1/2 -translate-y-1/2 z-10 p-4 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-primary hover:text-primary-foreground shadow-lg transition-all duration-300 group hidden lg:flex items-center justify-center"
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Carousel Container */}
      <motion.div 
        className="overflow-hidden rounded-2xl w-full relative"
        drag={windowWidth < 1024 ? "x" : false}
        dragConstraints={carouselRef}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div 
            key={currentIndex}
            custom={direction}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-10 w-full"
          >
            {getCurrentProjects().map((project, index) => (
              <motion.div 
                key={`${project.titulo}-${currentIndex}-${index}`}
                className="group relative"
                onHoverStart={() => setHoveredProject(project.titulo)}
                onHoverEnd={() => setHoveredProject(null)}
                whileHover={{ y: -8 }}
                layout
              >
                {/* Project Card */}
                <div className="relative h-full bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                  
                  {/* Status Badge */}
                  {project.activo && (
                    <motion.div
                      initial={{ scale: 0, rotate: -12 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="absolute top-3 right-3 z-10"
                    >
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 backdrop-blur-sm">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Activo
                      </Badge>
                    </motion.div>
                  )}

                  {/* Image/Video Container */}
                  {(project.imagen || project.video) && (
                    <div className="relative h-48 sm:h-52 overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                      />
                      
                      {project.video ? (
                        <video 
                          src={project.video} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          muted 
                          loop 
                          playsInline
                          onMouseEnter={(e) => e.currentTarget.play()}
                          onMouseLeave={(e) => e.currentTarget.pause()}
                        />
                      ) : (
                        <motion.img 
                          src={project.imagen || '/placeholder.jpg'} 
                          alt={project.titulo}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          whileHover={{ scale: 1.05 }}
                        />
                      )}

                      {/* Hover Overlay with View Button */}
                      <AnimatePresence>
                        {hoveredProject === project.titulo && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-20"
                          >
                            <motion.button
                              initial={{ scale: 0.8, y: 20 }}
                              animate={{ scale: 1, y: 0 }}
                              exit={{ scale: 0.8, y: 20 }}
                              onClick={() => onProjectClick(project)}
                              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Eye className="w-4 h-4" />
                              Ver detalles
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5 space-y-4">
                    {/* Title and Icon */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Code className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                          {project.titulo}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {project.fechas}
                        </div>
                      </div>
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tecnologias.slice(0, 4).map((tech, techIndex) => (
                        <motion.div
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: techIndex * 0.1 }}
                        >
                          <Badge variant="secondary" className="text-xs px-2 py-1 bg-muted/50 hover:bg-muted transition-colors">
                            {tech}
                          </Badge>
                        </motion.div>
                      ))}
                      {project.tecnologias.length > 4 && (
                        <Badge variant="outline" className="text-xs px-2 py-1">
                          +{project.tecnologias.length - 4}
                        </Badge>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.enlaces.map((link, linkIndex) => (
                        <motion.button
                          key={`${link.tipo}-${linkIndex}`}
                          onClick={() => handleExternalLink(link.href)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-muted/50 hover:bg-primary hover:text-primary-foreground rounded-lg transition-all duration-200 group/btn"
                          whileHover={{ scale: 1.05, y: -1 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + linkIndex * 0.1 }}
                        >
                          {getIconForLinkType(link.tipo)}
                          <span className="group-hover/btn:translate-x-0.5 transition-transform">
                            {link.tipo}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Enhanced Pagination Dots */}
      <div className="flex justify-center items-center mt-8 gap-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => handlePaginationDotClick(index)}
            className={`relative overflow-hidden transition-all duration-300 ${
              index === currentIndex 
                ? 'w-8 h-3 bg-primary' 
                : 'w-3 h-3 bg-muted hover:bg-muted-foreground/30'
            } rounded-full`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {index === currentIndex && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/70 to-secondary/70 rounded-full"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Mobile Swipe Indicator */}
      {windowWidth < 1024 && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mt-4"
        >
          <div className="text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-full backdrop-blur-sm">
            Desliza para ver más proyectos
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectsCarousel;
