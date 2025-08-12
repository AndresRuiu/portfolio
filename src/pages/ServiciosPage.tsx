import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, MessageCircle, Star, Clock, Users, Award } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DATOS } from "@/data/resumen";
import Layout from '@/components/Layout';
import { SectionReveal, AnimateElements, AnimatedElement } from '@/components/SectionReveal';
import { ModalSkeleton } from '@/components/LoadingFallbacks';
import { Link } from 'react-router-dom';

const ContactModal = React.lazy(() => import('@/components/ContactModal'));

interface Servicio {
  titulo: string;
  descripcion: string;
  icono: string;
  tecnologias: string[];
  incluye: string[];
  entregables: string;
}

const ServiciosPage = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  
  const servicios = DATOS.servicios as unknown as Servicio[];

  const handleContactClick = (serviceTitle?: string) => {
    setSelectedService(serviceTitle || null);
    setIsContactModalOpen(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const testimonials = DATOS.testimonios;

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
                Mis Servicios
              </h1>
              <p className="text-muted-foreground mt-2">
                Soluciones completas para llevar tus ideas al mundo digital
              </p>
            </div>
          </div>
        </SectionReveal>

        {/* Hero Section */}
        <SectionReveal delay={0.2}>
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-3xl p-8 mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">¿Listo para digitalizar tu proyecto?</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Desde ideas hasta aplicaciones funcionando. Te acompaño en todo el proceso de desarrollo, 
              desde el diseño hasta el lanzamiento.
            </p>
            <Button 
              onClick={() => handleContactClick()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 md:px-8 py-3 text-sm md:text-base"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Conversemos sobre tu proyecto</span>
              <span className="sm:hidden">Conversemos</span>
            </Button>
          </div>
        </SectionReveal>

        {/* Servicios Grid */}
        <AnimateElements>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {servicios.map((servicio, index) => (
              <AnimatedElement key={servicio.titulo} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="h-full"
                >
                  <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-4xl">{servicio.icono}</span>
                        <div>
                          <CardTitle className="text-xl">{servicio.titulo}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {servicio.descripcion}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {/* Tecnologías */}
                      <div>
                        <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                          Tecnologías
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
                          ¿Qué incluye?
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
                          Entregables
                        </h4>
                        <p className="text-sm leading-relaxed">{servicio.entregables}</p>
                      </div>

                      {/* CTA Button */}
                      <Button 
                        onClick={() => handleContactClick(servicio.titulo)}
                        className="w-full"
                        variant="outline"
                      >
                        Consultar sobre {servicio.titulo}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatedElement>
            ))}
          </div>
        </AnimateElements>

        {/* Proceso de Trabajo */}
        <SectionReveal delay={0.4}>
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Mi Proceso de Trabajo
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Consulta Inicial",
                  description: "Conversamos sobre tu proyecto, objetivos y necesidades específicas.",
                  icon: MessageCircle
                },
                {
                  step: "02", 
                  title: "Planificación",
                  description: "Defino la estrategia, tecnologías y cronograma del proyecto.",
                  icon: Clock
                },
                {
                  step: "03",
                  title: "Desarrollo",
                  description: "Creo tu solución con actualizaciones constantes y feedback.",
                  icon: Users
                },
                {
                  step: "04",
                  title: "Entrega",
                  description: "Lanzo tu proyecto y te proporciono todo el soporte necesario.",
                  icon: Award
                }
              ].map((process, index) => (
                <motion.div
                  key={process.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <process.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-2">{process.step}</div>
                  <h3 className="font-semibold mb-2">{process.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {process.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* Testimonials */}
        <SectionReveal delay={0.5}>
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Lo que dicen mis clientes
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.nombre}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    "{testimonial.texto}"
                  </p>
                  <div>
                    <div className="font-semibold">{testimonial.nombre}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.cargo} - {testimonial.empresa}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* Call to Action Final */}
        <SectionReveal delay={0.7}>
          <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">¿Listo para empezar?</h2>
            <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
              Cada proyecto es único, y me encanta crear soluciones personalizadas. 
              Conversemos sobre cómo puedo ayudarte a digitalizar tu idea.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => handleContactClick()}
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contactar ahora
              </Button>
              <Button 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary"
                asChild
              >
                <Link to="/proyectos">
                  Ver mis trabajos
                </Link>
              </Button>
            </div>
          </div>
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
