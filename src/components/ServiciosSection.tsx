import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Check, ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AnimateElements, AnimatedElement } from '@/components/SectionReveal';

interface Servicio {
  titulo: string;
  descripcion: string;
  icono: string;
  tecnologias: string[];
  incluye: string[];
  entregables: string;
}

interface ServiciosProps {
  servicios: Servicio[];
  onContactClick: () => void;
}

const ServiciosSection: React.FC<ServiciosProps> = ({ servicios, onContactClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [direction, setDirection] = useState(1);

  // Detectar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const goToNext = () => {
    if (currentIndex < servicios.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold && currentIndex < servicios.length - 1) {
      goToNext();
    } else if (info.offset.x > swipeThreshold && currentIndex > 0) {
      goToPrev();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      scale: 0.95
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

  const mobileSlideVariants = {
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

  const renderServiceCard = (servicio: Servicio) => (
    <motion.div
      key={servicio.titulo}
      variants={cardVariants}
      className="group relative w-full"
      whileHover={!isMobile ? { y: -8 } : {}}
    >
      {/* Featured Badge for Full Stack */}
      {servicio.titulo.includes('Full Stack') && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex items-center gap-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            <Star className="w-3 h-3" />
            Más Popular
          </div>
        </div>
      )}

      {/* Service Card */}
      <div className="relative h-full bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-primary/30 overflow-hidden">
        
        {/* Background Gradient Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <motion.div
              className="text-4xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              {servicio.icono}
            </motion.div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {servicio.titulo}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {servicio.descripcion}
              </p>
            </div>
          </div>


          {/* Technologies */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
              Tecnologías
            </h4>
            <div className="flex flex-wrap gap-2">
              {servicio.tecnologias.map((tech, techIndex) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * techIndex }}
                >
                  <Badge 
                    variant="secondary" 
                    className="bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                  >
                    {tech}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Includes */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
              Incluye
            </h4>
            <ul className="space-y-2">
              {servicio.incluye.map((item, itemIndex) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * itemIndex }}
                  className="flex items-start gap-3 text-sm"
                >
                  <div className="mt-0.5 p-0.5 bg-green-500/20 rounded-full">
                    <Check className="w-3 h-3 text-green-500" />
                  </div>
                  <span className="leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Deliverables */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
              Entregables
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {servicio.entregables}
            </p>
          </div>

          {/* CTA Button */}
          <motion.button
            onClick={onContactClick}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl group/btn font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Solicitar Cotización</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-secondary/10 to-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>
    </motion.div>
  );

  return (
    <AnimateElements>
      <section id="servicios" className="container mx-auto px-4 py-16">
        <AnimatedElement delay={0}>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
              Servicios
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              ¿Tienes una idea genial? Te ayudo a convertirla en realidad con código limpio y diseño moderno.
            </p>
          </div>
        </AnimatedElement>

        {/* Desktop Grid View */}
        {!isMobile && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto"
          >
            {servicios.map((servicio) => renderServiceCard(servicio))}
          </motion.div>
        )}

        {/* Mobile Carousel View */}
        {isMobile && (
          <div className="relative max-w-sm mx-auto">
            {/* Navigation Buttons */}
            <AnimatePresence>
              {currentIndex > 0 && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={goToPrev}
                  className="absolute left-[-50px] top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-primary hover:text-primary-foreground shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>
              )}

              {currentIndex < servicios.length - 1 && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={goToNext}
                  className="absolute right-[-50px] top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-primary hover:text-primary-foreground shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Carousel Container */}
            <motion.div
              className="overflow-hidden relative"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
            >
              <AnimatePresence initial={false} mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={mobileSlideVariants}
                  initial="initial"
                  animate="in"
                  exit="out"
                  className="w-full"
                >
                  {renderServiceCard(servicios[currentIndex])}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Pagination Dots */}
            <div className="flex justify-center items-center mt-6 gap-2">
              {servicios.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
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

            {/* Swipe Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mt-4"
            >
              <div className="text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-full backdrop-blur-sm">
                Desliza para ver más servicios
              </div>
            </motion.div>
          </div>
        )}

        {/* Call to Action Section */}
        <AnimatedElement delay={0.8}>
          <div className="mt-16 text-center">
            <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">
                ¿Tienes un proyecto en mente?
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Me encanta trabajar en proyectos nuevos. Cuéntame tu idea y juntos 
                encontraremos la mejor manera de hacerla realidad.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={onContactClick}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg font-medium"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Hablemos de tu proyecto
                </motion.button>
                <motion.a
                  href="https://wa.me/543865351958?text=Hola! Me gustaría conocer más sobre tus servicios de desarrollo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 border border-border rounded-xl hover:bg-muted/50 transition-all duration-300 shadow-md font-medium"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  WhatsApp directo
                </motion.a>
              </div>
            </div>
          </div>
        </AnimatedElement>
      </section>
    </AnimateElements>
  );
};

export default ServiciosSection;
