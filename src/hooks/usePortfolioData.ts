// DEPRECADO: Este hook ahora está migrado a Supabase
// Usar usePortfolioCompleto() desde @/hooks/usePortfolioSupabase
// Este archivo se mantiene temporalmente para compatibilidad hacia atrás

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DATOS } from '@/data/resumen';
import type { Project } from '../types';

// Keys para las queries
export const portfolioKeys = {
  all: ['portfolio'] as const,
  projects: () => [...portfolioKeys.all, 'projects'] as const,
  services: () => [...portfolioKeys.all, 'services'] as const,
  education: () => [...portfolioKeys.all, 'education'] as const,
  testimonials: () => [...portfolioKeys.all, 'testimonials'] as const,
  contact: () => [...portfolioKeys.all, 'contact'] as const,
};

// Hook para obtener proyectos con cache
export const useProjects = () => {
  return useQuery({
    queryKey: portfolioKeys.projects(),
    queryFn: async () => {
      // Simular una carga de datos con delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return DATOS.proyectos;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });
};

// Hook para obtener servicios
export const useServices = () => {
  return useQuery({
    queryKey: portfolioKeys.services(),
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return DATOS.servicios;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

// Hook para obtener educación
export const useEducation = () => {
  return useQuery({
    queryKey: portfolioKeys.education(),
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return DATOS.educacion;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

// Hook para obtener testimonios
export const useTestimonials = () => {
  return useQuery({
    queryKey: portfolioKeys.testimonials(),
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return DATOS.testimonios;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

// Hook para estadísticas calculadas
export const usePortfolioStats = () => {
  return useQuery({
    queryKey: [...portfolioKeys.all, 'stats'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const projects = DATOS.proyectos;
      const technologies = Array.from(
        new Set(projects.flatMap((p: Project) => p.tecnologias))
      );
      
      return {
        totalProjects: projects.length,
        activeProjects: projects.filter((p: Project) => p.activo).length,
        totalTechnologies: technologies.length,
        totalLinks: projects.reduce((acc: number, p: Project) => acc + p.enlaces.length, 0),
        projectsByYear: projects.reduce((acc: Record<string, number>, p: Project) => {
          const year = p.fechas.split(' - ')[0] || '2023';
          acc[year] = (acc[year] || 0) + 1;
          return acc;
        }, {}),
        topTechnologies: technologies.slice(0, 8),
      };
    },
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
  });
};

// Hook para buscar en todos los datos
export const useSearch = (query: string) => {
  return useQuery({
    queryKey: [...portfolioKeys.all, 'search', query],
    queryFn: async () => {
      if (!query.trim()) return [];
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const results: Array<{
        type: string;
        title: string;
        description?: string;
        data: Project | Record<string, unknown>;
      }> = [];
      const searchTerm = query.toLowerCase();
      
      // Buscar en proyectos
      DATOS.proyectos.forEach((project: Project) => {
        if (
          project.titulo.toLowerCase().includes(searchTerm) ||
          project.descripcion?.toLowerCase().includes(searchTerm) ||
          project.tecnologias.some((tech: string) => tech.toLowerCase().includes(searchTerm))
        ) {
          results.push({
            type: 'project',
            title: project.titulo,
            description: project.descripcion,
            data: project,
          });
        }
      });
      
      // Buscar en servicios
      DATOS.servicios.forEach((service: { titulo: string; descripcion: string; tecnologias: readonly string[] }) => {
        if (
          service.titulo.toLowerCase().includes(searchTerm) ||
          service.descripcion.toLowerCase().includes(searchTerm) ||
          service.tecnologias.some((tech: string) => tech.toLowerCase().includes(searchTerm))
        ) {
          results.push({
            type: 'service',
            title: service.titulo,
            description: service.descripcion,
            data: service,
          });
        }
      });
      
      return results;
    },
    enabled: !!query.trim(),
    staleTime: 1000 * 60 * 2, // 2 minutos para búsquedas
    gcTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Hook para prefetch de datos relacionados
export const usePrefetchRelated = () => {
  const queryClient = useQueryClient();
  
  const prefetchProjects = () => {
    queryClient.prefetchQuery({
      queryKey: portfolioKeys.projects(),
      queryFn: async () => DATOS.proyectos,
      staleTime: 1000 * 60 * 5,
    });
  };
  
  const prefetchServices = () => {
    queryClient.prefetchQuery({
      queryKey: portfolioKeys.services(),
      queryFn: async () => DATOS.servicios,
      staleTime: 1000 * 60 * 5,
    });
  };
  
  const prefetchStats = () => {
    queryClient.prefetchQuery({
      queryKey: [...portfolioKeys.all, 'stats'],
      queryFn: async () => {
        const projects = DATOS.proyectos;
        const technologies = Array.from(
          new Set(projects.flatMap((p: Project) => p.tecnologias))
        );
        
        return {
          totalProjects: projects.length,
          activeProjects: projects.filter((p: Project) => p.activo).length,
          totalTechnologies: technologies.length,
        };
      },
      staleTime: 1000 * 60 * 10,
    });
  };
  
  return {
    prefetchProjects,
    prefetchServices,
    prefetchStats,
  };
};