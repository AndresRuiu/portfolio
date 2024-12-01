import React, { useState, useEffect } from 'react';
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

  // Determine projects per page based on screen size
  const projectsPerPage = windowWidth >= 640 ? 2 : 1;

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  // Handle navigation
  const goToNextPage = () => {
    setCurrentIndex(prev => Math.min(prev + 1, totalPages - 1));
  };

  const goToPrevPage = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  // Handle pagination dot click
  const handlePaginationDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Get projects for current page
  const getCurrentProjects = () => {
    const start = currentIndex * projectsPerPage;
    return projects.slice(start, start + projectsPerPage);
  };

  return (
    <div className="relative w-full">
      {/* Projects Container */}
      <motion.div 
        className="flex items-center justify-center relative w-full"
        key={currentIndex}
      >
        {/* Left Navigation Arrow */}
        {currentIndex > 0 && windowWidth >= 640 && (
          <motion.button
            onClick={goToPrevPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <AnimatePresence mode="wait">
            {getCurrentProjects().map((project, index) => (
              <motion.div 
                key={project.titulo}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="group relative h-full"
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.12)"
                }}
              >
                {/* Project Card */}
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
                      <Code className="mr-2 text-primary" size={16} sm:size={20} />
                      <h3 className="font-semibold text-sm sm:text-base">{project.titulo}</h3>
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                      {project.tecnologias.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-[10px] sm:text-xs">{tech}</Badge>
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
            ))}
          </AnimatePresence>
        </div>

        {/* Right Navigation Arrow */}
        {currentIndex < totalPages - 1 && windowWidth >= 640 && (
          <motion.button
            onClick={goToNextPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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

      {/* Pagination */}
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