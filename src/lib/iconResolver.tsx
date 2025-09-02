import { Icons } from "@/components/ui/icons";
import { 
  Home, 
  Sparkles, 
  NotebookIcon, 
  GraduationCap,
  Mail,
  Phone,
  Github,
  Linkedin,
  MessageCircle,
  Download,
  User,
  Briefcase
} from 'lucide-react';
import React from "react";

// Mapeo de iconos desde nombres de string a componentes de Lucide
const LucideIconMap = {
  HomeIcon: Home,
  Home: Home,
  Sparkles: Sparkles,
  NotebookIcon: NotebookIcon,
  GraduationCap: GraduationCap,
  Mail: Mail,
  Phone: Phone,
  Github: Github,
  Linkedin: Linkedin,
  MessageCircle: MessageCircle,
  Download: Download,
  User: User,
  Briefcase: Briefcase,
  email: Mail,
  phone: Phone,
  github: Github,
  linkedin: Linkedin,
};

type IconName = keyof typeof Icons;
type LucideIconName = keyof typeof LucideIconMap;

export const getIcon = (iconName: string | React.ReactElement, props?: Record<string, unknown>) => {
  // Si ya es un elemento React, lo devolvemos tal como está
  if (React.isValidElement(iconName)) {
    return iconName;
  }
  
  // Si es string, intentamos resolverlo primero en LucideIconMap
  if (typeof iconName === 'string' && iconName in LucideIconMap) {
    const IconComponent = LucideIconMap[iconName as LucideIconName];
    return React.createElement(IconComponent, props);
  }
  
  // Si no está en Lucide, intentamos en Icons personalizados
  if (typeof iconName === 'string' && iconName in Icons) {
    return React.createElement(Icons[iconName as IconName], props);
  }
  
  // Fallback: devolver un icono por defecto
  return React.createElement(Home, props);
};

export const isValidIcon = (iconName: string): iconName is IconName => {
  return iconName in Icons;
};