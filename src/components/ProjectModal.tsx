import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useAppActions } from '@/contexts/AppContext';

import type { Project } from '@/types';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const { registerModal, unregisterModal } = useAppActions();
  
  // Generate unique modal ID
  const modalId = `project-modal-${project.titulo.replace(/\s+/g, '-').toLowerCase()}`;
  
  const mediaArray = [
    ...(project.video ? [{ type: 'video', src: project.video }] : []),
    ...(project.imagen ? [{ type: 'image', src: project.imagen }] : [])
  ];

  // Register modal on mount, unregister on unmount
  useEffect(() => {
    registerModal(modalId);
    
    return () => {
      unregisterModal(modalId);
    };
  }, [modalId, registerModal, unregisterModal]);

  const handleNext = () => {
    setCurrentMediaIndex((prevIndex) => 
      (prevIndex + 1) % mediaArray.length
    );
  };

  const handlePrev = () => {
    setCurrentMediaIndex((prevIndex) => 
      prevIndex === 0 ? mediaArray.length - 1 : prevIndex - 1
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 15, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-background rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-foreground hover:text-destructive"
        >
          <X size={24} />
        </button>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center">
            {project.titulo}
          </h2>
          
          {project.descripcion && (
            <p className="text-muted-foreground mb-4">{project.descripcion}</p>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tecnologias.map((tech) => (
              <Badge key={tech} variant="secondary">{tech}</Badge>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">{project.fechas}</p>

          {mediaArray.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full aspect-video rounded-lg overflow-hidden mb-4"
            >
              {mediaArray[currentMediaIndex].type === 'video' ? (
                <video 
                  src={mediaArray[currentMediaIndex].src} 
                  controls 
                  className="w-full h-full object-cover"
                  autoPlay
                />
              ) : (
                <img 
                  src={mediaArray[currentMediaIndex].src} 
                  alt={`${project.titulo} Preview`} 
                  className="w-full h-full object-cover"
                />
              )}

              {mediaArray.length > 1 && (
                <>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white"
                  >
                    <ChevronLeft size={24} />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white"
                  >
                    <ChevronRight size={24} />
                  </motion.button>
                </>
              )}
            </motion.div>
          )}

          <div className="flex space-x-4">
            {project.enlaces.map((link) => (
              <a 
                key={link.href}
                href={link.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Badge 
                  variant={link.tipo === 'Repositorio' ? 'outline' : 'default'} 
                  className="flex items-center gap-2"
                >
                  {link.tipo === 'Repositorio' ? <Github size={16} /> : <ExternalLink size={16} />}
                  {link.tipo}
                </Badge>
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectModal;