import { useSupabaseQuery } from './useSupabase'
import type { 
  ProjectRow, 
  ServiceRow, 
  EducacionRow, 
  CertificadoRow, 
  TestimonioRow,
  PerfilRow 
} from '@/lib/supabase'
import { adapters } from '@/lib/adapters'

/**
 * Hook para obtener proyectos destacados desde Supabase
 */
export function useProyectosDestacados() {
  return useSupabaseQuery<ProjectRow>({
    table: 'proyectos',
    select: '*',
    filters: { destacado: true},
  })
}

/**
 * Hook para obtener proyectos desde Supabase
 */
export function useProjects(options?: { onlyActive?: boolean }) {
  const filters = options?.onlyActive ? { activo: true } : {}
  
  return useSupabaseQuery<ProjectRow>({
    table: 'proyectos',
    select: '*',
    filters,
  })
}

/**
 * Hook para obtener servicios desde Supabase
 */
export function useServices(options?: { onlyActive?: boolean }) {
  const filters = options?.onlyActive ? { activo: true } : {}
  
  return useSupabaseQuery<ServiceRow>({
    table: 'servicios',
    select: '*',
    filters,
  })
}

/**
 * Hook para obtener educación desde Supabase
 */
export function useEducacion(options?: { onlyActive?: boolean }) {
  const filters = options?.onlyActive ? { activo: true } : {}
  
  return useSupabaseQuery<EducacionRow>({
    table: 'educacion',
    select: '*',
    filters,
  })
}

/**
 * Hook para obtener certificados desde Supabase
 */
export function useCertificados(options?: { onlyActive?: boolean }) {
  const filters = options?.onlyActive ? { activo: true } : {}
  
  return useSupabaseQuery<CertificadoRow>({
    table: 'certificados',
    select: '*',
    filters,
  })
}

/**
 * Hook para obtener testimonios desde Supabase
 */
export function useTestimonios(options?: { onlyActive?: boolean }) {
  const filters = options?.onlyActive ? { activo: true } : {}
  
  return useSupabaseQuery<TestimonioRow>({
    table: 'testimonios',
    select: '*',
    filters,
  })
}

/**
 * Hook combinado para obtener todos los datos del portfolio
 */
export function usePortfolioData() {
  const projects = useProjects({ onlyActive: true })
  const services = useServices({ onlyActive: true })
  const educacion = useEducacion({ onlyActive: true })
  const certificados = useCertificados({ onlyActive: true })
  const testimonios = useTestimonios({ onlyActive: true })

  return {
    projects: {
      data: projects.data?.sort((a, b) => 
        new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      ) || [],
      isLoading: projects.isLoading,
      error: projects.error
    },
    services: {
      data: services.data?.sort((a, b) => (a.orden || 0) - (b.orden || 0)) || [],
      isLoading: services.isLoading,
      error: services.error
    },
    educacion: {
      data: educacion.data?.sort((a, b) => (a.orden || 0) - (b.orden || 0)) || [],
      isLoading: educacion.isLoading,
      error: educacion.error
    },
    certificados: {
      data: certificados.data?.sort((a, b) => (a.orden || 0) - (b.orden || 0)) || [],
      isLoading: certificados.isLoading,
      error: certificados.error
    },
    testimonios: {
      data: testimonios.data?.sort((a, b) => (a.orden || 0) - (b.orden || 0)) || [],
      isLoading: testimonios.isLoading,
      error: testimonios.error
    },
    isLoading: [
      projects.isLoading,
      services.isLoading,
      educacion.isLoading,
      certificados.isLoading,
      testimonios.isLoading
    ].some(Boolean),
    hasError: [
      projects.error,
      services.error,
      educacion.error,
      certificados.error,
      testimonios.error
    ].some(Boolean)
  }
}

/**
 * Hook para obtener datos personales desde Supabase
 */
export function usePersonalData() {
  return useSupabaseQuery<PerfilRow>({
    table: 'perfil',
    select: '*',
    filters: { activo: true },
  })
}

/**
 * Hook para obtener datos personales adaptados al formato frontend
 */
export function usePersonalDataAdapted() {
  const { data, isLoading, error } = usePersonalData()
  
  // Si hay datos, adaptar el primer registro (debería ser único)
  const perfilAdaptado = data && data.length > 0 ? adapters.perfil(data[0]) : null
  
  return {
    data: perfilAdaptado,
    isLoading,
    error
  }
}

/**
 * Hook híbrido que combina datos de Supabase con datos personales estáticos
 * Este es el hook principal que reemplaza el uso directo del archivo resumen.tsx
 */
export function usePortfolioCompleto() {
  const portfolioData = usePortfolioData()
  const { data: personalData, isLoading: personalLoading, error: personalError } = usePersonalDataAdapted()

  return {
    // Datos personales desde Supabase (adaptados)
    ...personalData,
    
    // Datos dinámicos desde Supabase - convertidos a tipos del frontend
    proyectos: portfolioData.projects.data ? adapters.projects(portfolioData.projects.data) : [],
    servicios: portfolioData.services.data ? adapters.services(portfolioData.services.data) : [],
    educacion: portfolioData.educacion.data ? adapters.educacion(portfolioData.educacion.data) : [],
    certificados: portfolioData.certificados.data ? adapters.certificados(portfolioData.certificados.data) : [],
    testimonios: portfolioData.testimonios.data ? adapters.testimonios(portfolioData.testimonios.data) : [],
    
    // Estados de carga (incluye datos personales)
    isLoading: portfolioData.isLoading || personalLoading,
    hasError: portfolioData.hasError || !!personalError,
    
    // Estados individuales por si necesitas granularidad
    loadingStates: {
      personal: personalLoading,
      projects: portfolioData.projects.isLoading,
      services: portfolioData.services.isLoading,
      educacion: portfolioData.educacion.isLoading,
      certificados: portfolioData.certificados.isLoading,
      testimonios: portfolioData.testimonios.isLoading
    },
    
    errors: {
      personal: personalError,
      projects: portfolioData.projects.error,
      services: portfolioData.services.error,
      educacion: portfolioData.educacion.error,
      certificados: portfolioData.certificados.error,
      testimonios: portfolioData.testimonios.error
    }
  }
}