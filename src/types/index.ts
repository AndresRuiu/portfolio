import { ReactNode } from 'react';

export interface Project {
  titulo: string;
  fechas: string;
  activo?: boolean;
  descripcion?: string;
  tecnologias: readonly string[];
  enlaces: readonly {
    tipo: string;
    href: string;
    icon: string;
  }[];
  imagen?: string;
  video?: string;
}

export interface Navigation {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

export interface ContactSocial {
  name: string;
  url: string;
  icon: string;
  navbar: boolean;
}

export interface Contact {
  email: string;
  tel: string;
  social: Record<string, ContactSocial>;
}

export interface PersonalData {
  nombre: string;
  iniciales: string;
  url: string;
  ubicacion: string;
  description: string;
  resumen: string;
  urlAvatar: string;
  habilidades: string[];
  navegacion: Navigation[];
  contacto: Contact;
  proyectos: Project[];
  experiencia: Record<string, unknown>[]; // To be defined based on actual usage
  educacion: Record<string, unknown>[]; // To be defined based on actual usage
  servicios: Record<string, unknown>[]; // To be defined based on actual usage
}

export interface BentoGridItem {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  title: string;
  value: string | number;
  description: string;
  gradient: string;
}

export interface ComponentProps {
  children?: ReactNode;
  className?: string;
}