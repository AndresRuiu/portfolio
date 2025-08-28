import { useSupabaseQuery } from './useSupabase'
import type { 
  ProjectRow, 
  ServiceRow, 
  EducacionRow, 
  CertificadoRow, 
  TestimonioRow 
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
 * Hook para obtener solo datos personales (que permanecen estáticos)
 * Este hook mantiene la información personal del archivo original
 */
export function usePersonalData() {
  // Datos que NO se migran a Supabase - permanecen estáticos
  return {
    nombre: "Andrés Ruiu",
    iniciales: "AR",
    url: "https://andresruiu.com",
    ubicacion: "San Miguel de Tucumán, Tucumán, Argentina",
    description: "Desarrollador Full Stack especializado en crear soluciones digitales que impulsan el crecimiento empresarial. Combino expertise técnico con visión estratégica para desarrollar aplicaciones web modernas y escalables. Actualmente liderando el desarrollo de múltiples proyectos empresariales en producción.",
    resumen: "Desarrollador Full Stack con sólida formación académica y experiencia práctica comprobada en proyectos reales. Mi background en ingeniería me aporta una perspectiva analítica única para resolver problemas complejos y diseñar arquitecturas eficientes. Especializado en el stack moderno de JavaScript/TypeScript, he desarrollado aplicaciones completas para diversos sectores empresariales, desde plataformas de gestión hasta portales médicos. Próximo a graduarme como Técnico Universitario en Programación (UTN-FRT), busco oportunidades que me permitan aplicar mi experiencia en desarrollo full stack y contribuir al crecimiento tecnológico de organizaciones innovadoras.",
    urlAvatar: "/yo.webp",
    habilidades: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "NestJS",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Prisma ORM",
      "Tailwind CSS",
      "shadcn/ui",
      "Zustand",
      "NextAuth.js",
      "Strapi CMS",
      "Docker",
      "Vercel",
      "Git & GitHub",
      "REST APIs",
      "Responsive Design"
    ],
    navegacion: [
      { href: "/", icon: "HomeIcon", label: "Inicio" },
      { href: "/proyectos", icon: "Sparkles", label: "Proyectos" },
      { href: "/servicios", icon: "NotebookIcon", label: "Servicios" },
      { href: "/educacion", icon: "GraduationCap", label: "Educación" },
    ],
    contacto: {
      email: "andresruiu@gmail.com",
      tel: "3865351958",
      social: {
        GitHub: {
          name: "GitHub",
          url: "https://github.com/AndresRuiu",
          icon: "github",
          navbar: true,
        },
        LinkedIn: {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/andrés-ruiu-b941a1103",
          icon: "linkedin",
          navbar: true,
        },
        email: {
          name: "Enviar Correo",
          url: "#",
          icon: "email",
          navbar: false,
        },
      },
    }
  }
}

/**
 * Hook híbrido que combina datos de Supabase con datos personales estáticos
 * Este es el hook principal que reemplaza el uso directo del archivo resumen.tsx
 */
export function usePortfolioCompleto() {
  const portfolioData = usePortfolioData()
  const personalData = usePersonalData()

  return {
    // Datos personales (estáticos)
    ...personalData,
    
    // Datos dinámicos desde Supabase - convertidos a tipos del frontend
    proyectos: portfolioData.projects.data ? adapters.projects(portfolioData.projects.data) : [],
    servicios: portfolioData.services.data ? adapters.services(portfolioData.services.data) : [],
    educacion: portfolioData.educacion.data ? adapters.educacion(portfolioData.educacion.data) : [],
    certificados: portfolioData.certificados.data ? adapters.certificados(portfolioData.certificados.data) : [],
    testimonios: portfolioData.testimonios.data ? adapters.testimonios(portfolioData.testimonios.data) : [],
    
    // Estados de carga
    isLoading: portfolioData.isLoading,
    hasError: portfolioData.hasError,
    
    // Estados individuales por si necesitas granularidad
    loadingStates: {
      projects: portfolioData.projects.isLoading,
      services: portfolioData.services.isLoading,
      educacion: portfolioData.educacion.isLoading,
      certificados: portfolioData.certificados.isLoading,
      testimonios: portfolioData.testimonios.isLoading
    },
    
    errors: {
      projects: portfolioData.projects.error,
      services: portfolioData.services.error,
      educacion: portfolioData.educacion.error,
      certificados: portfolioData.certificados.error,
      testimonios: portfolioData.testimonios.error
    }
  }
}