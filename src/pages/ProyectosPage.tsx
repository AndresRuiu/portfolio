import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { Search, Activity, ArrowLeft, Hash, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import SearchCommand from '@/components/SearchCommand';
import Layout from '@/components/Layout';
import { SectionReveal, AnimateElements } from '@/components/SectionReveal';
import { ModalSkeleton } from '@/components/LoadingFallbacks';
import { Link } from 'react-router-dom';
import type { Project } from '@/types';
import { ProjectGallery } from '@/components/ProjectGallery';
import { useProjects } from '@/hooks/usePortfolioSupabase';
import { adapters } from '@/lib/adapters';
import { ProjectCardSkeleton, StatsCardSkeleton } from '@/components/skeletons/SkeletonComponents';
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
  
  const noResultsRef = useRef<HTMLDivElement>(null);
  
  // Usar hook de Supabase para obtener los proyectos
  const { data: proyectosSupabase, isLoading } = useProjects({ onlyActive: false });
  
  // Convertir datos de Supabase a tipos del frontend
  const proyectosData = proyectosSupabase ? adapters.projects(proyectosSupabase) : [];

  // Obtener todas las tecnologías únicas
  const allTechnologies = Array.from(
    new Set(proyectosData.flatMap(proyecto => [...proyecto.tecnologias]))
  ).sort();

  // Filtrar proyectos con búsqueda mejorada en tecnologías
  const filteredProjects = proyectosData.filter(proyecto => {
    let matchesSearch = true;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      
      // Buscar en título
      const titleMatch = proyecto.titulo.toLowerCase().includes(term);
      
      // Buscar en descripción
      const descriptionMatch = proyecto.descripcion 
        ? proyecto.descripcion.toLowerCase().includes(term)
        : false;
      
      // Buscar en tecnologías con variantes
      const techMatch = proyecto.tecnologias.some(tech => {
        const techLower = tech.toLowerCase();
        // Coincidencia exacta o parcial
        if (techLower.includes(term) || term.includes(techLower)) {
          return true;
        }
        // Búsquedas comunes (Next.js, NextJS, nextjs, etc.)
        if (term === 'nextjs' || term === 'next.js' || term === 'next') {
          return techLower.includes('next');
        }
        if (term === 'reactjs' || term === 'react.js') {
          return techLower.includes('react');
        }
        if (term === 'nodejs' || term === 'node.js') {
          return techLower.includes('node');
        }
        return false;
      });
      
      matchesSearch = titleMatch || descriptionMatch || techMatch;
    }
    
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

  // GSAP Animation for no results
  useGSAP(() => {
    if (noResultsRef.current && filteredProjects.length === 0 && !isLoading) {
      gsap.fromTo(noResultsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [filteredProjects.length, isLoading]);

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

        {/* Búsqueda compacta */}
        <SectionReveal delay={0.2}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4 flex-1">
              <SearchCommand
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedTech={selectedTech}
                setSelectedTech={setSelectedTech}
                showActiveOnly={showActiveOnly}
                setShowActiveOnly={setShowActiveOnly}
                clearFilters={clearFilters}
                allTechnologies={allTechnologies}
                filteredProjects={filteredProjects}
                allProjects={proyectosData}
                totalProjects={proyectosData.length}
                activeProjects={proyectosData.filter(p => p.activo).length}
                onProjectClick={handleProjectClick}
              />
              
              {/* Indicadores de búsqueda activa */}
              {(searchTerm || selectedTech || showActiveOnly) && (
                <div className="flex items-center gap-2">
                  {searchTerm && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      <Search className="w-3 h-3" />
                      <span>"{searchTerm}"</span>
                    </div>
                  )}
                  {selectedTech && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded-full">
                      <Hash className="w-3 h-3" />
                      <span>{selectedTech}</span>
                    </div>
                  )}
                  {showActiveOnly && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">
                      <Activity className="w-3 h-3" />
                      <span>Activos</span>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-6 w-6 p-0 hover:bg-destructive/10"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            
            {/* Estadísticas compactas */}
            <div className="text-xs text-muted-foreground">
              {filteredProjects.length} de {proyectosData.length}
            </div>
          </div>
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
            <div 
              ref={noResultsRef}
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
            </div>
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
      {selectedProject && (
        <Suspense fallback={<ModalSkeleton />}>
          <ProjectModal 
            project={selectedProject} 
            isOpen={!!selectedProject}
            onClose={() => setSelectedProject(null)} 
          />
        </Suspense>
      )}
    </Layout>
  );
};

export default ProyectosPage;
