import React, { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, ExternalLink, Github, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFLIPAnimations } from '@/hooks/useFLIPAnimations';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';
import { useAppActions } from '@/contexts/AppContext';

import type { Project } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  sourceElement?: Element | null;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ 
  project, 
  isOpen, 
  onClose, 
  sourceElement 
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isImagePlaying, setIsImagePlaying] = useState(false);
  const { registerModal, unregisterModal } = useAppActions();
  
  const { expandToModal, collapseToCard, isMobile, prefersReducedMotion } = useFLIPAnimations();
  const { createTextReveal, createSectionReveal, createGridReveal } = useScrollAnimations();
  
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

  // Auto-play para carousel de imágenes
  useEffect(() => {
    if (!isImagePlaying || mediaArray.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentMediaIndex(prev => 
        prev === (mediaArray.length - 1) ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isImagePlaying, mediaArray.length]);

  // Animación de entrada del modal
  useGSAP(() => {
    if (!isOpen || !modalRef.current || !project) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Backdrop fade in
      tl.fromTo(modalRef.current, 
        { 
          opacity: 0,
          backdropFilter: "blur(0px)"
        },
        { 
          opacity: 1,
          backdropFilter: "blur(12px)",
          duration: 0.4,
          ease: "power2.out"
        }
      );

      // Content entrance
      if (sourceElement && contentRef.current) {
        // FLIP animation from source card to modal
        const flipAnimation = expandToModal(sourceElement, contentRef.current, {
          duration: isMobile ? 0.8 : 1.2,
          ease: "power3.out",
          onComplete: () => {
            // Trigger internal animations after FLIP completes
            animateModalContent();
          }
        });
        
        tl.add(flipAnimation, 0.1);
      } else {
        // Fallback animation if no source element
        tl.fromTo(contentRef.current,
          {
            opacity: 0,
            scale: 0.8,
            y: 100,
            rotationX: -15
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotationX: 0,
            duration: 1,
            ease: "elastic.out(1, 0.6)",
            onComplete: () => {
              animateModalContent();
            }
          },
          0.2
        );
      }
    }, modalRef);

    return () => ctx.revert();
  }, { dependencies: [isOpen, project, sourceElement], scope: modalRef });

  // Animaciones internas del modal
  const animateModalContent = () => {
    if (!project || prefersReducedMotion) return;

    const tl = gsap.timeline({ delay: 0.3 });

    // Hero image with parallax effect
    if (imageRef.current) {
      tl.fromTo(imageRef.current,
        {
          opacity: 0,
          scale: 1.2,
          filter: "blur(20px) brightness(0.7)",
          y: 50
        },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px) brightness(1)",
          y: 0,
          duration: 1.2,
          ease: "power3.out"
        },
        0
      );
      
      // Parallax scroll effect for hero image
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        animation: gsap.to(imageRef.current, {
          y: -100,
          scale: 1.1,
          ease: "none"
        })
      });
    }

    // Title with text reveal
    if (titleRef.current) {
      createTextReveal(titleRef.current, { start: "top 90%" });
    }

    // Description reveal
    if (descriptionRef.current) {
      createTextReveal(descriptionRef.current, { start: "top 85%" });
    }

    // Details section
    if (detailsRef.current) {
      createSectionReveal(detailsRef.current, { start: "top 80%" });
      
      // Animate badges and links
      const badges = detailsRef.current.querySelectorAll('.badge');
      const links = detailsRef.current.querySelectorAll('a');
      
      if (badges.length > 0) {
        createGridReveal(badges);
      }
      if (links.length > 0) {
        createGridReveal(links);
      }
    }
  };

  // Animación de salida del modal
  const handleClose = () => {
    if (!modalRef.current || !contentRef.current) {
      onClose();
      return;
    }

    const tl = gsap.timeline({
      onComplete: onClose
    });

    if (sourceElement) {
      // FLIP animation back to source card
      const flipAnimation = collapseToCard(contentRef.current, sourceElement, {
        duration: isMobile ? 0.6 : 1,
        ease: "power3.inOut"
      });
      
      tl.add(flipAnimation, 0);
    } else {
      // Fallback exit animation
      tl.to(contentRef.current, {
        opacity: 0,
        scale: 0.8,
        y: -50,
        rotationX: 15,
        duration: 0.6,
        ease: "power3.in"
      });
    }

    // Backdrop fade out
    tl.to(modalRef.current, {
      opacity: 0,
      backdropFilter: "blur(0px)",
      duration: 0.4,
      ease: "power2.in"
    }, 0);
  };

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

  const toggleImagePlayback = () => {
    setIsImagePlaying(prev => !prev);
  };

  if (!isOpen || !project) return null;

  const currentMedia = mediaArray[currentMediaIndex];

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        ref={contentRef}
        className="relative w-full max-w-5xl max-h-[95vh] bg-background rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white border-0"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[95vh] custom-scrollbar scroll-smooth">
          {/* Hero Section */}
          <div ref={heroRef} className="relative h-80 md:h-96 overflow-hidden">
            {currentMedia && (
              <>
                {currentMedia.type === 'video' ? (
                  <video 
                    ref={imageRef as unknown as React.RefObject<HTMLVideoElement>}
                    src={currentMedia.src} 
                    controls 
                    className="w-full h-full object-cover"
                    autoPlay
                  />
                ) : (
                  <img
                    ref={imageRef}
                    src={currentMedia.src}
                    alt={project.titulo}
                    className="w-full h-full object-cover"
                  />
                )}
              </>
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Media Controls */}
            {mediaArray.length > 1 && (
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrev}
                  className="bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white border-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleImagePlayback}
                  className="bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white border-0"
                >
                  {isImagePlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNext}
                  className="bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white border-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Project Status */}
            {project.activo && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-green-500 text-white">
                  En Producción
                </Badge>
              </div>
            )}

            {/* Media Indicators */}
            {mediaArray.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {mediaArray.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMediaIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentMediaIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12 space-y-8">
            {/* Title and Description */}
            <div className="space-y-6">
              <h1
                ref={titleRef}
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent"
              >
                {project.titulo}
              </h1>
              
              {project.descripcion && (
                <p
                  ref={descriptionRef}
                  className="text-lg text-muted-foreground leading-relaxed"
                >
                  {project.descripcion}
                </p>
              )}

              {/* Date */}
              {project.fechas && (
                <p className="text-sm text-muted-foreground font-medium">
                  {project.fechas}
                </p>
              )}

              {/* Technologies */}
              <div className="flex flex-wrap gap-2">
                {project.tecnologias.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="px-3 py-1 text-sm font-medium hover:scale-105 transition-transform"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Links Section */}
            <div ref={detailsRef} className="space-y-6">
              <div className="flex flex-wrap gap-4">
                {project.enlaces.map((enlace, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    asChild
                    className="group hover:scale-105 transition-transform"
                  >
                    <a
                      href={enlace.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      {enlace.tipo === 'Repositorio' ? (
                        <Github className="w-4 h-4" />
                      ) : (
                        <ExternalLink className="w-4 h-4" />
                      )}
                      {enlace.tipo}
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;