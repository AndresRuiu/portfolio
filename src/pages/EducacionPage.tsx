import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, ExternalLink, Award, Star, Trophy, CheckCircle, Clock, BookOpen, Sparkles } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DATOS } from "@/data/resumen";
import { 
  UnifiedCard, 
  UnifiedCardHeader, 
  UnifiedCardTitle, 
  UnifiedCardDescription, 
  UnifiedCardContent,
  UnifiedCardFooter,
  UnifiedGrid
} from '@/components/ui/UnifiedCard';
import Layout from '@/components/Layout';
import { SectionReveal, AnimatedElement } from '@/components/SectionReveal';
import { Link } from 'react-router-dom';

const EducacionPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'Completado':
        return 'bg-green-500 text-white';
      case 'En curso':
        return 'bg-blue-500 text-white';
      case 'Incompleto':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'Completado':
        return <CheckCircle className="w-4 h-4" />;
      case 'En curso':
        return <Clock className="w-4 h-4" />;
      case 'Incompleto':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };


  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <SectionReveal delay={0.1}>
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2 back-button-mobile-hidden">
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
            </Link>
            <div className="text-center md:text-left flex-1 md:flex-none">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
                Mi Camino de Aprendizaje
              </h1>
              <p className="text-muted-foreground mt-2">
                La historia de cómo descubrí mi pasión por el desarrollo
              </p>
            </div>
          </div>
        </SectionReveal>

        {/* Historia Personal */}
        <SectionReveal delay={0.2}>
          <UnifiedCard variant="gradient" size="xl" className="mb-12 text-center">
            <UnifiedCardHeader>
              <UnifiedCardTitle size="lg">Una decisión que lo cambió todo</UnifiedCardTitle>
            </UnifiedCardHeader>
            <UnifiedCardContent>
              <UnifiedCardDescription className="text-lg mb-6 max-w-3xl mx-auto leading-relaxed">
                En 2022 tomé una de las decisiones más importantes: dejar atrás tres años de Ingeniería Civil 
                para seguir mi verdadera vocación en la programación. Fue el inicio de una transformación que 
                me llevó a encontrar mi lugar en el desarrollo de software.
              </UnifiedCardDescription>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2 bg-background/80 rounded-lg px-4 py-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">3 años en Ingeniería</span>
                </div>
                <div className="flex items-center gap-2 bg-background/80 rounded-lg px-4 py-2">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Cambio de rumbo</span>
                </div>
                <div className="flex items-center gap-2 bg-background/80 rounded-lg px-4 py-2">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Nuevo comienzo</span>
                </div>
              </div>
            </UnifiedCardContent>
          </UnifiedCard>
        </SectionReveal>

        {/* Timeline de Educación */}
        <SectionReveal delay={0.3}>
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Mi evolución académica
            </h2>
            
            <div className="relative">
              {/* Línea temporal */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-muted-foreground/30 to-transparent transform -translate-x-1/2"></div>
              
              <div className="space-y-12">
                {DATOS.educacion.map((edu, index) => (
                  <AnimatedElement key={edu.titulo} delay={index * 0.2}>
                    <div className={`
                      relative 
                      w-full 
                      flex 
                      flex-col 
                      md:flex-row
                      ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}
                      items-center
                      gap-8
                    `}>
                      {/* Indicador central */}
                      <motion.div 
                        className="
                          hidden
                          md:flex
                          absolute 
                          left-1/2 
                          transform 
                          -translate-x-1/2 
                          w-16 
                          h-16 
                          bg-gradient-to-br from-primary to-secondary
                          rounded-full 
                          z-10
                          items-center
                          justify-center
                          shadow-xl
                          border-4
                          border-background
                        "
                        whileHover={{ 
                          scale: 1.1, 
                          rotate: index % 2 === 0 ? 90 : -90
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getStatusColor(edu.estado)}`}>
                          {getStatusIcon(edu.estado)}
                        </div>
                      </motion.div>

                      {/* Contenido de la tarjeta */}
                      <motion.div 
                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="w-full md:w-1/2"
                      >
                        <UnifiedCard 
                          variant="glass" 
                          size="lg" 
                          hover={true}
                          className="group hover:border-primary/30"
                        >
                          <UnifiedCardHeader>
                            <div className="flex items-start justify-between mb-4">
                              {edu.logoUrl && (
                                <motion.img 
                                  src={edu.logoUrl} 
                                  alt={`${edu.institucion} logo`} 
                                  className="w-16 h-16 object-contain rounded-lg shadow-md"
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                />
                              )}
                              <Badge className={getStatusColor(edu.estado)}>
                                {getStatusIcon(edu.estado)}
                                <span className="ml-1">{edu.estado}</span>
                              </Badge>
                            </div>
                            
                            <UnifiedCardTitle size="md" className="group-hover:text-primary transition-colors">
                              {edu.titulo}
                            </UnifiedCardTitle>
                            <UnifiedCardDescription className="font-medium text-base">
                              {edu.institucion}
                            </UnifiedCardDescription>
                          </UnifiedCardHeader>
                          
                          <UnifiedCardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {edu.inicio} - {edu.fin}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Tucumán, AR
                              </div>
                            </div>
                            
                            {edu.descripcion && (
                              <UnifiedCardDescription className="leading-relaxed">
                                {edu.descripcion}
                              </UnifiedCardDescription>
                            )}
                          </UnifiedCardContent>
                          
                          {edu.href && (
                            <UnifiedCardFooter>
                              <Button variant="outline" size="sm" asChild>
                                <a 
                                  href={edu.href} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Ver institución
                                </a>
                              </Button>
                            </UnifiedCardFooter>
                          )}
                        </UnifiedCard>
                      </motion.div>
                    </div>
                  </AnimatedElement>
                ))}
              </div>
            </div>
          </div>
        </SectionReveal>


        {/* Certificados */}
        <SectionReveal delay={0.4}>
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Certificaciones y especializaciones
            </h2>
            
            <UnifiedGrid columns={3} gap="md">
              {DATOS.certificados.map((cert, index) => (
                <UnifiedCard
                  key={cert.titulo}
                  variant="default"
                  size="md"
                  delay={index * 0.1}
                  hover={true}
                  className="h-full group overflow-hidden"
                >
                  {cert.imagen && (
                    <div className="relative overflow-hidden -m-6 mb-4">
                      <img 
                        src={cert.imagen} 
                        alt={cert.titulo}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  
                  <UnifiedCardHeader>
                    <UnifiedCardTitle size="sm" className="group-hover:text-primary transition-colors">
                      {cert.titulo}
                    </UnifiedCardTitle>
                    <UnifiedCardDescription>
                      {cert.institucion}
                    </UnifiedCardDescription>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {cert.fecha}
                    </div>
                  </UnifiedCardHeader>
                  
                  <UnifiedCardContent className="space-y-4">
                    <UnifiedCardDescription className="text-sm leading-relaxed">
                      {cert.descripcion}
                    </UnifiedCardDescription>
                    
                    <div className="flex flex-wrap gap-2">
                      {cert.tecnologias.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {cert.tecnologias.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{cert.tecnologias.length - 3}
                        </Badge>
                      )}
                    </div>
                  </UnifiedCardContent>
                  
                  {cert.enlace && cert.enlace !== "#" && (
                    <UnifiedCardFooter>
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <a 
                          href={cert.enlace} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Award className="w-4 h-4" />
                          Ver certificado
                        </a>
                      </Button>
                    </UnifiedCardFooter>
                  )}
                </UnifiedCard>
              ))}
            </UnifiedGrid>
          </div>
        </SectionReveal>


        {/* Call to Action */}
        <SectionReveal delay={0.5}>
          <UnifiedCard variant="gradient" size="xl" className="mt-16 text-center bg-gradient-to-r from-primary to-secondary text-white">
            <UnifiedCardHeader>
              <UnifiedCardTitle size="lg" className="text-white mb-4">¿Curioso por ver mis proyectos?</UnifiedCardTitle>
            </UnifiedCardHeader>
            <UnifiedCardContent>
              <UnifiedCardDescription className="text-lg mb-6 opacity-90 max-w-2xl mx-auto text-white">
                Descubre cómo transformo todo este aprendizaje en soluciones web reales y funcionales.
              </UnifiedCardDescription>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" asChild className="bg-white text-primary hover:bg-white/90">
                  <Link to="/proyectos">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Explorar portfolio
                  </Link>
                </Button>
                <Button variant="outline" asChild className="border-white text-white hover:bg-white hover:text-primary">
                  <Link to="/servicios">
                    Ver cómo puedo ayudarte
                  </Link>
                </Button>
              </div>
            </UnifiedCardContent>
          </UnifiedCard>
        </SectionReveal>
      </div>
    </Layout>
  );
};

export default EducacionPage;
