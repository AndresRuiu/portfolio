/**
 * Adaptadores para convertir datos de Supabase a tipos del frontend
 */

import type { ProjectRow, ServiceRow, EducacionRow, CertificadoRow, TestimonioRow, PerfilRow } from './supabase'
import { supabase } from './supabase'
import type { Project } from '@/types'

/**
 * Obtiene la URL completa de un archivo desde Supabase Storage
 */
function getSupabaseImageUrl(bucket: string, path: string | null): string | undefined {
  if (!path) return undefined
  
  // Si ya es una URL completa, devolverla tal como está
  if (path.startsWith('http')) return path
  
  // Eliminar la barra inicial si existe
  const cleanPath = path.startsWith('/') ? path.substring(1) : path
  
  // Generar URL pública desde Supabase Storage
  const { data } = supabase.storage.from(bucket).getPublicUrl(cleanPath)
  return data.publicUrl
}

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

export interface PerfilPersonal {
  nombre: string;
  iniciales: string;
  url?: string;
  ubicacion?: string;
  description?: string;
  resumen?: string;
  urlAvatar?: string;
  habilidades: string[];
  email?: string;
  telefono?: string;
  navegacion: Array<{
    href: string;
    icon: string;
    label: string;
  }>;
  contacto: {
    email: string;
    tel: string;
    social: {
      [key: string]: {
        name: string;
        url: string;
        icon: string;
        navbar: boolean;
      };
    };
  };
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
 * Convierte PerfilRow de Supabase a PerfilPersonal del frontend
 */
export function adaptPerfilFromSupabase(perfil: PerfilRow): PerfilPersonal {
  // Parse JSON fields safely
  const navegacion = Array.isArray(perfil.navegacion) 
    ? perfil.navegacion as Array<{ href: string; icon: string; label: string }>
    : [];
  
  const redesSociales = perfil.redes_sociales && typeof perfil.redes_sociales === 'object'
    ? perfil.redes_sociales as Record<string, unknown>
    : {};

  return {
    nombre: perfil.nombre,
    iniciales: perfil.iniciales,
    url: perfil.url || undefined,
    ubicacion: perfil.ubicacion || undefined,
    description: perfil.description || undefined,
    resumen: perfil.resumen || undefined,
    urlAvatar: getSupabaseImageUrl('perfil', perfil.url_avatar),
    habilidades: perfil.habilidades || [],
    email: perfil.email || undefined,
    telefono: perfil.telefono || undefined,
    navegacion,
    contacto: {
      email: perfil.email || '',
      tel: perfil.telefono || '',
      social: redesSociales as Record<string, {
        name: string;
        url: string;
        icon: string;
        navbar: boolean;
      }>,
    },
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
  
  perfil: (perfil: PerfilRow): PerfilPersonal => 
    adaptPerfilFromSupabase(perfil),
}