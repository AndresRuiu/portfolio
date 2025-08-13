import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getIcon } from '@/lib/iconResolver';
import { 
  UnifiedCard, 
  UnifiedCardHeader, 
  UnifiedCardTitle, 
  UnifiedCardDescription, 
  UnifiedCardContent,
  UnifiedCardFooter,
  UnifiedGrid
} from '@/components/ui/UnifiedCard';
import { VideoPlayer } from '@/components/VideoPlayer';

interface ProjectData {
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

interface ProjectGalleryProps {
  projects: ProjectData[];
  onProjectClick?: (project: ProjectData) => void;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ 
  projects, 
  onProjectClick 
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Preparar slides para el lightbox
  const slides = projects
    .filter(project => project.imagen)
    .map(project => ({
      src: project.imagen!,
      title: project.titulo,
      description: `${project.descripcion || ''}\n\nTecnologías: ${project.tecnologias.join(', ')}\n\nFecha: ${project.fechas}`,
      width: 1200,
      height: 800,
    }));

  const openLightbox = (project: ProjectData) => {
    const slideIndex = projects.findIndex(p => p.titulo === project.titulo);
    setLightboxIndex(slideIndex);
    setLightboxOpen(true);
  };

  return (
    <>
      <UnifiedGrid columns={3} gap="md">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.titulo}
            project={project}
            index={index}
            isHovered={hoveredIndex === index}
            onHover={() => setHoveredIndex(index)}
            onLeave={() => setHoveredIndex(null)}
            onImageClick={() => openLightbox(project)}
            onProjectClick={onProjectClick}
          />
        ))}
      </UnifiedGrid>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Zoom, Captions, Counter, Thumbnails]}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
        }}
        captions={{
          showToggle: true,
          descriptionTextAlign: 'start',
          descriptionMaxLines: 5,
        }}
        counter={{
          container: { style: { top: 'unset', bottom: 0 } },
        }}
        thumbnails={{
          position: 'bottom',
          width: 120,
          height: 80,
          border: 2,
          borderRadius: 8,
          padding: 4,
          gap: 16,
        }}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.9)' },
          slide: { padding: '20px' },
        }}
        render={{
          buttonPrev: () => (
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          ),
          buttonNext: () => (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-white/20"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          ),
          buttonClose: () => (
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-black/50 border-white/20 text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>
          ),
        }}
      />
    </>
  );
};

// Componente individual de proyecto
interface ProjectCardProps {
  project: ProjectData;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onImageClick: () => void;
  onProjectClick?: (project: ProjectData) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  isHovered,
  onHover,
  onLeave,
  onImageClick,
  onProjectClick,
}) => {

  return (
    <UnifiedCard
      variant="project"
      size="md"
      delay={index * 0.1}
      hover={true}
      onClick={() => onProjectClick?.(project)}
      className="overflow-hidden group cursor-pointer"
    >
      <motion.div
        onHoverStart={onHover}
        onHoverEnd={onLeave}
        className="w-full h-full"
      >
        {/* Media Section */}
        <div className="relative overflow-hidden h-48 -m-6 mb-4">
          {project.video ? (
            <VideoPlayer
              src={project.video}
              title={project.titulo}
              className="w-full h-full"
              muted={true}
              loop={true}
              onExpand={() => {
                onImageClick();
              }}
            />
          ) : project.imagen ? (
            <div className="relative w-full h-full">
              <img
                src={project.imagen}
                alt={project.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              
              {/* Image Overlay */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onImageClick();
                    }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-black/50 border-white/20 text-white hover:bg-white/20"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted/60 to-muted/30 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-muted-foreground/20 flex items-center justify-center mb-2">
                <span className="text-2xl">📄</span>
              </div>
              <span className="text-muted-foreground text-sm">Sin multimedia</span>
              <span className="text-muted-foreground/60 text-xs">Proyecto basado en código</span>
            </div>
          )}

          {/* Status Badge y Media Type Indicator */}
          <div className="absolute top-3 right-3 flex gap-2">
            {/* Media type indicator */}
            {project.video && (
              <Badge className="bg-red-500/90 text-white text-xs">
                📹 Video
              </Badge>
            )}
            {!project.video && project.imagen && (
              <Badge className="bg-blue-500/90 text-white text-xs">
                🖼️ Imagen
              </Badge>
            )}
            {!project.video && !project.imagen && (
              <Badge className="bg-purple-500/90 text-white text-xs">
                💻 Código
              </Badge>
            )}
            
            {/* Status badge */}
            <Badge
              className={cn(
                project.activo
                  ? "bg-green-500 text-white"
                  : "bg-gray-500 text-white"
              )}
            >
              {project.activo ? "Activo" : "Completado"}
            </Badge>
          </div>
        </div>

        <UnifiedCardHeader>
          <UnifiedCardTitle size="sm" className="group-hover:text-primary transition-colors line-clamp-2">
            {project.titulo}
          </UnifiedCardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {project.fechas}
          </div>
        </UnifiedCardHeader>
        
        <UnifiedCardContent>
          {/* Description */}
          {project.descripcion && (
            <UnifiedCardDescription className="mb-4 line-clamp-3">
              {project.descripcion}
            </UnifiedCardDescription>
          )}

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tecnologias.slice(0, 4).map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
              >
                {tech}
              </Badge>
            ))}
            {project.tecnologias.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{project.tecnologias.length - 4}
              </Badge>
            )}
          </div>
        </UnifiedCardContent>

        <UnifiedCardFooter>
          <div className="flex gap-2">
            {project.enlaces.map((enlace, linkIndex) => (
              <Button
                key={linkIndex}
                variant="outline"
                size="sm"
                asChild
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs"
              >
                <a
                  href={enlace.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {getIcon(enlace.icon, { className: "size-3" })}
                  {enlace.tipo}
                </a>
              </Button>
            ))}
          </div>
        </UnifiedCardFooter>
      </motion.div>
    </UnifiedCard>
  );
};

export default ProjectGallery;