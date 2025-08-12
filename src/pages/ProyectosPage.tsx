import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Activity, ArrowLeft } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DATOS } from "@/data/resumen";
import Layout from '@/components/Layout';
import { SectionReveal, AnimateElements, AnimatedElement } from '@/components/SectionReveal';
import { ModalSkeleton } from '@/components/LoadingFallbacks';
import { Link } from 'react-router-dom';

const ProjectModal = React.lazy(() => import('@/components/ProjectModal'));

interface Project {
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

const ProyectosPage = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  
  const proyectos = DATOS.proyectos as unknown as Project[];

  // Obtener todas las tecnologías únicas
  const allTechnologies = Array.from(
    new Set(proyectos.flatMap(proyecto => proyecto.tecnologias))
  ).sort();

  // Filtrar proyectos
  const filteredProjects = proyectos.filter(proyecto => {
    const matchesSearch = proyecto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proyecto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTech = !selectedTech || proyecto.tecnologias.includes(selectedTech);
    const matchesActive = !showActiveOnly || proyecto.activo;
    
    return matchesSearch && matchesTech && matchesActive;
  });

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTech(null);
    setShowActiveOnly(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
                Mis Proyectos
              </h1>
              <p className="text-muted-foreground mt-2">
                Una colección completa de mis trabajos y desarrollos
              </p>
            </div>
          </div>
        </SectionReveal>

        {/* Filtros */}
        <SectionReveal delay={0.2}>
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Búsqueda */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar proyectos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtro por tecnología */}
              <div className="flex flex-wrap gap-2">
                {allTechnologies.slice(0, 6).map((tech) => (
                  <Button
                    key={tech}
                    variant={selectedTech === tech ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTech(selectedTech === tech ? null : tech)}
                    className="text-xs"
                  >
                    {tech}
                  </Button>
                ))}
              </div>

              {/* Filtros adicionales */}
              <div className="flex items-center gap-2">
                <Button
                  variant={showActiveOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowActiveOnly(!showActiveOnly)}
                  className="flex items-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  Solo activos
                </Button>

                {(searchTerm || selectedTech || showActiveOnly) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground"
                  >
                    Limpiar
                  </Button>
                )}
              </div>
            </div>
            
            {/* Estadísticas */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span>Total: {proyectos.length} proyectos</span>
                <span>Activos: {proyectos.filter(p => p.activo).length}</span>
                <span>Mostrando: {filteredProjects.length}</span>
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* Grid de Proyectos */}
        <AnimateElements>
          {filteredProjects.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No se encontraron proyectos</h3>
              <p className="text-muted-foreground mb-4">
                Intenta ajustar los filtros o términos de búsqueda
              </p>
              <Button onClick={clearFilters} variant="outline">
                Limpiar filtros
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((proyecto, index) => (
                <AnimatedElement key={proyecto.titulo} delay={index * 0.1}>
                  <motion.div
                    className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                    whileHover={{ y: -5, scale: 1.02 }}
                    onClick={() => handleProjectClick(proyecto)}
                  >
                    {/* Imagen del proyecto */}
                    {proyecto.imagen && (
                      <div className="relative overflow-hidden">
                        <img 
                          src={proyecto.imagen} 
                          alt={proyecto.titulo}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Status badge */}
                        <div className="absolute top-3 right-3">
                          <Badge 
                            className={proyecto.activo 
                              ? "bg-green-500 text-white" 
                              : "bg-gray-500 text-white"
                            }
                          >
                            {proyecto.activo ? "Activo" : "Completado"}
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      {/* Título y fecha */}
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
                          {proyecto.titulo}
                        </h3>
                      </div>

                      {/* Fecha */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <Calendar className="w-3 h-3" />
                        {proyecto.fechas}
                      </div>
                      
                      {/* Descripción */}
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                        {proyecto.descripcion}
                      </p>
                      
                      {/* Tecnologías */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {proyecto.tecnologias.slice(0, 4).map((tech) => (
                          <Badge 
                            key={tech} 
                            variant="secondary" 
                            className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTech(tech);
                            }}
                          >
                            {tech}
                          </Badge>
                        ))}
                        {proyecto.tecnologias.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{proyecto.tecnologias.length - 4}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Enlaces */}
                      <div className="flex gap-2">
                        {proyecto.enlaces.map((enlace, linkIndex) => (
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
                              {enlace.icon}
                              {enlace.tipo}
                            </a>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatedElement>
              ))}
            </div>
          )}
        </AnimateElements>

        {/* Estadísticas finales */}
        <SectionReveal delay={0.4}>
          <div className="mt-16 bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Estadísticas de Proyectos</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold text-primary">{proyectos.length}</div>
                <div className="text-sm text-muted-foreground">Total Proyectos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-500">
                  {proyectos.filter(p => p.activo).length}
                </div>
                <div className="text-sm text-muted-foreground">Activos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-500">{allTechnologies.length}</div>
                <div className="text-sm text-muted-foreground">Tecnologías</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-500">
                  {proyectos.reduce((acc, p) => acc + p.enlaces.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Enlaces</div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>

      {/* Modal de proyecto */}
      <AnimatePresence>
        {selectedProject && (
          <Suspense fallback={<ModalSkeleton />}>
            <ProjectModal 
              project={selectedProject} 
              onClose={() => setSelectedProject(null)} 
            />
          </Suspense>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default ProyectosPage;
