import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, Calendar, MapPin, ExternalLink, Award, Star, Trophy, CheckCircle, Clock, BookOpen, Sparkles } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useEducacion, useCertificados } from '@/hooks/usePortfolioSupabase';
import { adapters } from '@/lib/adapters';

const EducacionPage = () => {
  // Obtener datos desde Supabase
  const { data: educacionSupabase } = useEducacion({ onlyActive: true });
  const { data: certificadosSupabase } = useCertificados({ onlyActive: true });
  
  // Convertir datos de Supabase a tipos del frontend
  const educacion = educacionSupabase ? adapters.educacion(educacionSupabase) : [];
  const certificados = certificadosSupabase ? adapters.certificados(certificadosSupabase) : [];
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const certificadosRef = useRef<HTMLDivElement>(null);
  
  // Removed unused variables isLoading and hasError

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // GSAP Animations
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    // Animar elementos de timeline
    if (timelineRef.current) {
      const timelineItems = timelineRef.current.querySelectorAll('.timeline-item');
      const timelineIndicators = timelineRef.current.querySelectorAll('.timeline-indicator');
      
      gsap.fromTo(timelineItems, 
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(timelineIndicators, 
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
          stagger: 0.1,
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Animar certificados
    if (certificadosRef.current) {
      const certificadoCards = certificadosRef.current.querySelectorAll('.certificado-card');
      
      gsap.fromTo(certificadoCards, 
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: certificadosRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  });


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

  // Solo mostrar contenido, sin loaders adicionales

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
          <div ref={timelineRef} className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Mi evolución académica
            </h2>
            
            <div className="relative">
              {/* Línea temporal */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-muted-foreground/30 to-transparent transform -translate-x-1/2"></div>
              
              <div className="space-y-12">
                {educacion.map((edu, index) => (
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
                      <div 
                        className="
                          timeline-indicator
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
                          hover:scale-110
                          transition-transform
                          duration-300
                        "
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getStatusColor('Completado')}`}>
                          {getStatusIcon('Completado')}
                        </div>
                      </div>

                      {/* Contenido de la tarjeta */}
                      <div 
                        className="timeline-item w-full md:w-1/2"
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
                                <img 
                                  src={edu.logoUrl} 
                                  alt={`${edu.institucion} logo`} 
                                  className="w-16 h-16 object-contain rounded-lg shadow-md hover:scale-110 hover:rotate-3 transition-transform duration-300"
                                />
                              )}
                              <Badge className={getStatusColor('Completado')}>
                                {getStatusIcon('Completado')}
                                <span className="ml-1">Completado</span>
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
                      </div>
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
            
            <div ref={certificadosRef}>
              <UnifiedGrid columns={3} gap="md">
                {certificados.map((cert) => (
                <UnifiedCard
                  key={cert.titulo}
                  variant="default"
                  size="md"
                  hover={true}
                  className="certificado-card h-full group overflow-hidden"
                >
                  {cert.imagen_url && (
                    <div className="relative overflow-hidden -m-6 mb-4">
                      <img 
                        src={cert.imagen_url} 
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
                    
                    {cert.tecnologias && cert.tecnologias.length > 0 && (
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
                    )}
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
