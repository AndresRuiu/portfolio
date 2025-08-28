/**
 * Adaptadores para convertir datos de Supabase a tipos del frontend
 */

import type { ProjectRow, ServiceRow, EducacionRow, CertificadoRow, TestimonioRow } from './supabase'
import type { Project } from '@/types'

// Interfaces para tipos frontend
export interface Servicio {
  titulo: string;
  descripcion: string;
  icono: string;
  tecnologias: string[];
  incluye: string[];
  entregables: string;
}

export interface Educacion {
  titulo: string;
  institucion: string;
  inicio: string;
  fin: string;
  descripcion?: string;
  href?: string;
  logoUrl?: string;
}

export interface Certificado {
  titulo: string;
  institucion?: string;
  fecha: string;
  descripcion?: string;
  enlace?: string;
  imagen_url?: string;
  tecnologias?: string[];
}

export interface Testimonio {
  nombre: string;
  cargo?: string;
  empresa?: string;
  texto: string;
  rating: number;
  fecha?: string;
  proyecto?: string;
  imagen_url?: string;
}

/**
 * Convierte ProjectRow de Supabase a Project del frontend
 */
export function adaptProjectFromSupabase(project: ProjectRow): Project {
  return {
    titulo: project.titulo,
    fechas: project.fechas || '',
    activo: project.activo || false,
    descripcion: project.descripcion || '',
    tecnologias: project.tecnologias || [],
    enlaces: Array.isArray(project.enlaces) ? project.enlaces as {
      tipo: string;
      href: string;
      icon: string;
    }[] : [],
    imagen: project.imagen_url || undefined,
    video: project.video_url || undefined,
  }
}

/**
 * Convierte ServiceRow de Supabase a Servicio del frontend
 */
export function adaptServiceFromSupabase(service: ServiceRow): Servicio {
  return {
    titulo: service.titulo,
    descripcion: service.descripcion || '',
    icono: service.icono || '🔧',
    tecnologias: service.tecnologias || [],
    incluye: service.incluye || [],
    entregables: service.entregables || '',
  }
}

/**
 * Convierte EducacionRow de Supabase a Educacion del frontend
 */
export function adaptEducacionFromSupabase(educacion: EducacionRow): Educacion {
  return {
    titulo: educacion.titulo,
    institucion: educacion.institucion,
    inicio: educacion.inicio || '',
    fin: educacion.fin || '',
    descripcion: educacion.descripcion || undefined,
    href: educacion.href || undefined,
    logoUrl: educacion.logo_url || undefined,
  }
}

/**
 * Convierte CertificadoRow de Supabase a Certificado del frontend
 */
export function adaptCertificadoFromSupabase(certificado: CertificadoRow): Certificado {
  return {
    titulo: certificado.titulo,
    institucion: certificado.institucion || undefined,
    fecha: certificado.fecha || '',
    descripcion: certificado.descripcion || undefined,
    enlace: certificado.enlace || undefined,
    imagen_url: certificado.imagen_url || undefined,
    tecnologias: certificado.tecnologias || undefined,
  }
}

/**
 * Convierte TestimonioRow de Supabase a Testimonio del frontend
 */
export function adaptTestimonioFromSupabase(testimonio: TestimonioRow): Testimonio {
  return {
    nombre: testimonio.nombre,
    cargo: testimonio.cargo || undefined,
    empresa: testimonio.empresa || undefined,
    texto: testimonio.texto,
    rating: testimonio.rating || 5,
    fecha: testimonio.fecha || undefined,
    proyecto: testimonio.proyecto || undefined,
    imagen_url: testimonio.imagen_url || undefined,
  }
}

/**
 * Convierte arrays de datos de Supabase a tipos del frontend
 */
export const adapters = {
  projects: (projects: ProjectRow[]): Project[] => 
    projects.map(adaptProjectFromSupabase),
  
  services: (services: ServiceRow[]): Servicio[] => 
    services.map(adaptServiceFromSupabase),
  
  educacion: (educacion: EducacionRow[]): Educacion[] => 
    educacion.map(adaptEducacionFromSupabase),
  
  certificados: (certificados: CertificadoRow[]): Certificado[] => 
    certificados.map(adaptCertificadoFromSupabase),
  
  testimonios: (testimonios: TestimonioRow[]): Testimonio[] => 
    testimonios.map(adaptTestimonioFromSupabase),
}