import React, { useState, useEffect, Suspense } from 'react';
import { ArrowLeft, CheckCircle, MessageCircle, Star, Clock, Users, Award } from 'lucide-react';
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
import { SectionReveal, AnimateElements, AnimatedElement } from '@/components/SectionReveal';
import { ModalSkeleton } from '@/components/LoadingFallbacks';
import { Link } from 'react-router-dom';
import { useServices, useTestimonios } from '@/hooks/usePortfolioSupabase';
import { adapters } from '@/lib/adapters';

const ContactModal = React.lazy(() => import('@/components/ContactModal'));

const ServiciosPage = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  
  // Obtener datos desde Supabase
  const { data: serviciosSupabase } = useServices({ onlyActive: true });
  const { data: testimoniosSupabase } = useTestimonios({ onlyActive: true });
  
  // Convertir datos de Supabase a tipos del frontend
  const servicios = serviciosSupabase ? adapters.services(serviciosSupabase) : [];
  const testimonials = testimoniosSupabase ? adapters.testimonios(testimoniosSupabase) : [];
  
  // Removed unused variables isLoading and hasError

  const handleContactClick = (serviceTitle?: string) => {
    setSelectedService(serviceTitle || null);
    setIsContactModalOpen(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
                Servicios de Desarrollo
              </h1>
              <p className="text-muted-foreground mt-2">
                De la idea al lanzamiento: desarrollo web completo y personalizado
              </p>
            </div>
          </div>
        </SectionReveal>

        {/* Hero Section */}
        <SectionReveal delay={0.2}>
          <UnifiedCard variant="gradient" size="xl" className="mb-12 text-center">
            <UnifiedCardHeader>
              <UnifiedCardTitle size="lg">¿Tienes una idea brillante?</UnifiedCardTitle>
            </UnifiedCardHeader>
            <UnifiedCardContent>
              <UnifiedCardDescription className="text-lg mb-6 max-w-2xl mx-auto">
                Te ayudo a convertirla en realidad. Desde el concepto inicial hasta una aplicación web completamente funcional.
              </UnifiedCardDescription>
              <Button 
                onClick={() => handleContactClick()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 md:px-8 py-3 text-sm md:text-base"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Cuéntame tu proyecto</span>
                <span className="sm:hidden">Conversemos</span>
              </Button>
            </UnifiedCardContent>
          </UnifiedCard>
        </SectionReveal>

        {/* Servicios Grid */}
        <AnimateElements>
          <UnifiedGrid columns={2} gap="lg" className="mb-16">
            {servicios.map((servicio, index) => (
              <AnimatedElement key={servicio.titulo} delay={index * 0.1}>
                <UnifiedCard
                  variant="highlight"
                  size="lg"
                  hover={true}
                  className="h-full"
                >
                  <UnifiedCardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">{servicio.icono}</span>
                      <div>
                        <UnifiedCardTitle size="md">{servicio.titulo}</UnifiedCardTitle>
                        <UnifiedCardDescription className="text-sm mt-1">
                          {servicio.descripcion}
                        </UnifiedCardDescription>
                      </div>
                    </div>
                  </UnifiedCardHeader>
                  
                  <UnifiedCardContent className="space-y-6">
                    {/* Tecnologías */}
                    <div>
                      <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                        Stack tecnológico
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {servicio.tecnologias.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Lo que incluye */}
                    <div>
                      <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                        Lo que obtienes
                      </h4>
                      <ul className="space-y-2">
                        {servicio.incluye.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Entregables */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
                        Resultado final
                      </h4>
                      <p className="text-sm leading-relaxed">{servicio.entregables}</p>
                    </div>
                  </UnifiedCardContent>

                  <UnifiedCardFooter>
                    <Button 
                      onClick={() => handleContactClick(servicio.titulo)}
                      className="w-full"
                      variant="outline"
                    >
                      Consultar {servicio.titulo}
                    </Button>
                  </UnifiedCardFooter>
                </UnifiedCard>
              </AnimatedElement>
            ))}
          </UnifiedGrid>
        </AnimateElements>

        {/* Proceso de Trabajo */}
        <SectionReveal delay={0.4}>
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Cómo trabajamos juntos
            </h2>
            
            <UnifiedGrid columns={4} gap="md">
              {[
                {
                  step: "01",
                  title: "Descubrimiento",
                  description: "Entiendo tu visión, objetivos y audiencia objetivo.",
                  icon: MessageCircle
                },
                {
                  step: "02", 
                  title: "Estrategia",
                  description: "Diseño la arquitectura, tecnologías y roadmap.",
                  icon: Clock
                },
                {
                  step: "03",
                  title: "Construcción",
                  description: "Desarrollo iterativo con feedback continuo.",
                  icon: Users
                },
                {
                  step: "04",
                  title: "Lanzamiento",
                  description: "Deploy, testing y soporte post-lanzamiento.",
                  icon: Award
                }
              ].map((process, index) => (
                <UnifiedCard
                  key={process.step}
                  variant="subtle"
                  size="md"
                  delay={index * 0.1}
                  className="text-center"
                >
                  <UnifiedCardContent>
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <process.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-primary mb-2">{process.step}</div>
                    <UnifiedCardTitle size="sm" className="mb-2">{process.title}</UnifiedCardTitle>
                    <UnifiedCardDescription className="text-sm leading-relaxed">
                      {process.description}
                    </UnifiedCardDescription>
                  </UnifiedCardContent>
                </UnifiedCard>
              ))}
            </UnifiedGrid>
          </div>
        </SectionReveal>

        {/* Testimonials */}
        <SectionReveal delay={0.5}>
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Experiencias reales
            </h2>
            
            <UnifiedGrid columns={2} gap="md">
              {testimonials.map((testimonial, index) => (
                <UnifiedCard
                  key={testimonial.nombre}
                  variant="glass"
                  size="md"
                  delay={index * 0.1}
                >
                  <UnifiedCardHeader>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </UnifiedCardHeader>
                  <UnifiedCardContent>
                    <UnifiedCardDescription className="mb-4 leading-relaxed text-base">
                      "{testimonial.texto}"
                    </UnifiedCardDescription>
                  </UnifiedCardContent>
                  <UnifiedCardFooter>
                    <div>
                      <div className="font-semibold">{testimonial.nombre}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.cargo} - {testimonial.empresa}</div>
                    </div>
                  </UnifiedCardFooter>
                </UnifiedCard>
              ))}
            </UnifiedGrid>
          </div>
        </SectionReveal>

        {/* Call to Action Final */}
        <SectionReveal delay={0.7}>
          <UnifiedCard variant="gradient" size="xl" className="text-center bg-gradient-to-r from-primary to-secondary text-white">
            <UnifiedCardHeader>
              <UnifiedCardTitle size="lg" className="text-white mb-4">¿Empezamos hoy?</UnifiedCardTitle>
            </UnifiedCardHeader>
            <UnifiedCardContent>
              <UnifiedCardDescription className="text-lg mb-6 opacity-90 max-w-2xl mx-auto text-white">
                Tu proyecto merece una solución única. Hablemos sobre cómo convertir tu idea en una realidad digital exitosa.
              </UnifiedCardDescription>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => handleContactClick()}
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Conversemos ahora
                </Button>
                <Button 
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary"
                  asChild
                >
                  <Link to="/proyectos">
                    Ver portfolio
                  </Link>
                </Button>
              </div>
            </UnifiedCardContent>
          </UnifiedCard>
        </SectionReveal>
      </div>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <Suspense fallback={<ModalSkeleton />}>
          <ContactModal
            isOpen={isContactModalOpen}
            onClose={() => setIsContactModalOpen(false)}
            prefilledSubject={selectedService ? `Consulta sobre ${selectedService}` : undefined}
          />
        </Suspense>
      )}
    </Layout>
  );
};

export default ServiciosPage;
