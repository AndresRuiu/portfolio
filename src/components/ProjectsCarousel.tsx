import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Code } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface Project {
  titulo: string;
  imagen?: string;
  video?: string;
  tecnologias: string[];
  fechas: string;
  enlaces: Array<{
    tipo: string;
    href: string;
    icon: React.ReactElement;
  }>;
}

interface ProjectsCarouselProps {
  projects: Project[];
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
  const carouselRef = useRef<HTMLDivElement>(null);

  const projectsPerPage = windowWidth >= 640 ? 2 : 1;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const goToNextPage = () => {
    setDirection(1);
    setCurrentIndex(prev => Math.min(prev + 1, totalPages - 1));
  };

  const goToPrevPage = () => {
    setDirection(-1);
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const handlePaginationDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const getCurrentProjects = () => {
    const start = currentIndex * projectsPerPage;
    const projectsToShow = projects.slice(start, start + projectsPerPage);
    
    if (windowWidth >= 640 && projectsToShow.length === 1) {
      return [...projectsToShow, null];
    }
    
    return projectsToShow;
  };

  const handleDragEnd = (_: never, info: { offset: { x: number } }) => {
    if (windowWidth >= 640) return;

    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold && currentIndex < totalPages - 1) {
      goToNextPage();
    } else if (info.offset.x > swipeThreshold && currentIndex > 0) {
      goToPrevPage();
    }
  };

  const pageVariants = {
    initial: (direction: number) => ({
      opacity: 0,
      x: windowWidth >= 640 
        ? (direction > 0 ? 600 : -600)
        : (direction > 0 ? 300 : -300),
      scale: windowWidth >= 640 
        ? (direction > 0 ? 0.6 : 0.7)
        : 0.85,
      rotateY: windowWidth >= 640 
        ? (direction > 0 ? 45 : -45)
        : (direction > 0 ? 15 : -15),
      zIndex: 0
    }),
    in: {
      opacity: 1,
      x: 0,
      scale: 1,
      rotateY: 0,
      zIndex: 1,
      transition: {
        duration: windowWidth >= 640 ? 1 : 0.7,
        type: windowWidth >= 640 ? "tween" : "spring",
        ease: windowWidth >= 640 
          ? "anticipate"
          : undefined,
        stiffness: windowWidth >= 640 ? undefined : 70,
        damping: windowWidth >= 640 ? undefined : 15
      }
    },
    out: (direction: number) => ({
      opacity: 0,
      x: windowWidth >= 640 
        ? (direction < 0 ? 600 : -600)
        : (direction < 0 ? 300 : -300),
      scale: windowWidth >= 640 
        ? (direction < 0 ? 0.6 : 0.7)
        : 0.85,
      rotateY: windowWidth >= 640 
        ? (direction < 0 ? 45 : -45)
        : (direction < 0 ? 15 : -15),
      zIndex: 0,
      transition: {
        duration: windowWidth >= 640 ? 1 : 0.7,
        type: windowWidth >= 640 ? "tween" : "spring",
        ease: windowWidth >= 640 ? "anticipate" : undefined
      }
    })
  };

  return (
    <div className="relative w-full" ref={carouselRef}>
      <motion.div 
        className="flex items-center justify-center relative w-full"
        key={currentIndex}
        drag={windowWidth < 640 ? "x" : false}
        dragConstraints={carouselRef}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        {currentIndex > 0 && windowWidth >= 640 && (
          <motion.button
            onClick={goToPrevPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            className="
              absolute 
              left-[-50px] 
              z-10 
              bg-muted/50 
              rounded-full 
              p-2 
              hover:bg-muted/70 
              transition-all
            "
          >
            <ChevronLeft className="text-foreground" />
          </motion.button>
        )}

        <AnimatePresence 
          initial={false} 
          mode="wait" 
          custom={direction}
        >
          <motion.div 
            key={currentIndex}
            custom={direction}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
          >
            {getCurrentProjects().map((project) => (
              project ? (
                <motion.div 
                  key={project.titulo}
                  className="group relative h-full"
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 10px 20px rgba(0,0,0,0.12)"
                  }}
                >
                  <div className="rounded-lg bg-card text-card-foreground flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full">
                    {project.imagen || project.video ? (
                      <div 
                        className="w-full h-40 sm:h-48 md:h-56 object-cover cursor-pointer"
                        onClick={() => onProjectClick(project)}
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
                        <div className="scale-100 md:scale-110">
                          <Code className="mr-2 text-primary" />
                        </div>
                        <h3 className="font-semibold text-sm sm:text-base">{project.titulo}</h3>
                      </div>
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                        {project.tecnologias.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-[10px] sm:text-xs">{tech}</Badge>
                        ))}
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground pb-2 mt-2">{project.fechas}</p>
                      <div className="flex flex-col md:flex-row flex-wrap items-center gap-2 mt-2 justify-center md:justify-start">
                        {project.enlaces.map((link) => (
                          <Badge 
                            key={link.tipo}
                            onClick={() => handleExternalLink(link.href)} 
                            className="
                              flex 
                              w-full
                              gap-1 
                              sm:gap-2 
                              px-3 
                              py-1 
                              text-xs 
                              cursor-pointer 
                              hover:bg-accent 
                              md:w-auto 
                              text-center 
                              justify-center
                              sm:text-sm
                            "
                          >
                            {React.cloneElement(link.icon, { className: "mr-2 size-4" })}
                            {link.tipo}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div 
                  key="empty-project" 
                  className="hidden sm:block"
                />
              )
            ))}
          </motion.div>
        </AnimatePresence>

        {currentIndex < totalPages - 1 && windowWidth >= 640 && (
          <motion.button
            onClick={goToNextPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            className="
              absolute 
              right-[-50px] 
              z-10 
              bg-muted/50 
              rounded-full 
              p-2 
              hover:bg-muted/70 
              transition-all
            "
          >
            <ChevronRight className="text-foreground" />
          </motion.button>
        )}
      </motion.div>

      <div className="flex justify-center items-center mt-6 space-x-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <div
            key={index}
            onClick={() => handlePaginationDotClick(index)}
            className={`
              h-2 
              w-8 
              rounded-full 
              transition-all 
              duration-300
              cursor-pointer
              hover:scale-110
              ${index === currentIndex ? 'bg-primary' : 'bg-muted'}
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectsCarousel;