import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Activity, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from '@/components/Layout';
import { SectionReveal, AnimateElements } from '@/components/SectionReveal';
import { ModalSkeleton } from '@/components/LoadingFallbacks';
import { Link } from 'react-router-dom';
import type { Project } from '@/types';
import { ProjectGallery } from '@/components/ProjectGallery';
import { useProjects } from '@/hooks/usePortfolioSupabase';
import { adapters } from '@/lib/adapters';
import { ProjectCardSkeleton, FilterSkeleton, StatsCardSkeleton } from '@/components/skeletons/SkeletonComponents';
import { 
  UnifiedCard, 
  UnifiedCardHeader, 
  UnifiedCardTitle, 
  UnifiedCardContent
} from '@/components/ui/UnifiedCard';

const ProjectModal = React.lazy(() => import('@/components/ProjectModal'));


const ProyectosPage = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  
  // Usar hook de Supabase para obtener los proyectos
  const { data: proyectosSupabase, isLoading } = useProjects({ onlyActive: false });
  
  // Convertir datos de Supabase a tipos del frontend
  const proyectosData = proyectosSupabase ? adapters.projects(proyectosSupabase) : [];

  // Obtener todas las tecnologías únicas
  const allTechnologies = Array.from(
    new Set(proyectosData.flatMap(proyecto => [...proyecto.tecnologias]))
  ).sort();

  // Filtrar proyectos
  const filteredProjects = proyectosData.filter(proyecto => {
    const matchesSearch = proyecto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proyecto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTech = !selectedTech || [...proyecto.tecnologias].includes(selectedTech);
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
                Portfolio de Desarrollo
              </h1>
              <p className="text-muted-foreground mt-2">
                Explorá mis desarrollos web, aplicaciones y soluciones tecnológicas
              </p>
            </div>
          </div>
        </SectionReveal>

        {/* Filtros */}
        <SectionReveal delay={0.2}>
          {isLoading ? (
            <FilterSkeleton />
          ) : (
            <UnifiedCard variant="glass" size="lg" className="mb-8">
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
                <span>Total: {proyectosData.length} proyectos</span>
                <span>Activos: {proyectosData.filter(p => p.activo).length}</span>
                <span>Mostrando: {filteredProjects.length}</span>
              </div>
            </div>
          </UnifiedCard>
          )}
        </SectionReveal>

        {/* Project Gallery */}
        <AnimateElements>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
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
            <ProjectGallery 
              projects={filteredProjects} 
              onProjectClick={handleProjectClick}
            />
          )}
        </AnimateElements>

        {/* Estadísticas finales */}
        <SectionReveal delay={0.4}>
          {isLoading ? (
            <StatsCardSkeleton />
          ) : (
            <UnifiedCard variant="subtle" size="xl" className="mt-16 text-center">
              <UnifiedCardHeader>
                <UnifiedCardTitle size="lg">Mi impacto en números</UnifiedCardTitle>
              </UnifiedCardHeader>
              <UnifiedCardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-primary">{proyectosData.length}</div>
                    <div className="text-sm text-muted-foreground">Total Proyectos</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-500">
                      {proyectosData.filter(p => p.activo).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Activos</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-500">{allTechnologies.length}</div>
                    <div className="text-sm text-muted-foreground">Tecnologías</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-500">
                      {proyectosData.reduce((acc, p) => acc + p.enlaces.length, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Enlaces</div>
                  </div>
                </div>
              </UnifiedCardContent>
            </UnifiedCard>
          )}
        </SectionReveal>
      </div>

      {/* Modal de proyecto */}
      <AnimatePresence>
        {selectedProject && (
          <Suspense fallback={<ModalSkeleton />}>
            <ProjectModal 
              project={selectedProject} 
              isOpen={!!selectedProject}
              onClose={() => setSelectedProject(null)} 
            />
          </Suspense>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default ProyectosPage;
