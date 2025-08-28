import { Code2, Rocket, Zap } from 'lucide-react';

// Constants for AppLoader
export const loadingStages = [
  { 
    id: 'init', 
    message: 'Inicializando aplicación...', 
    duration: 800 
  },
  { 
    id: 'assets', 
    message: 'Cargando recursos...', 
    duration: 600 
  },
  { 
    id: 'data', 
    message: 'Conectando con base de datos...', 
    duration: 900 
  },
  { 
    id: 'ui', 
    message: 'Preparando interfaz...', 
    duration: 500 
  }
];

export const loadingSteps = [
  { icon: Code2, text: "Cargando componentes...", color: "text-blue-500" },
  { icon: Zap, text: "Optimizando rendimiento...", color: "text-yellow-500" },
  { icon: Rocket, text: "Preparando experiencia...", color: "text-green-500" },
];

// Constants for CommandPalette
export const commandGroups = {
  navigation: {
    id: 'navigation',
    title: 'Navegación'
  },
  projects: {
    id: 'projects',
    title: 'Proyectos'
  },
  services: {
    id: 'services', 
    title: 'Servicios'
  },
  contact: {
    id: 'contact',
    title: 'Contacto'
  }
};

// Constants for ErrorBoundary
export const errorTypes = {
  CHUNK_LOAD_ERROR: 'ChunkLoadError',
  NETWORK_ERROR: 'NetworkError',
  PERMISSION_ERROR: 'PermissionError',
  UNKNOWN_ERROR: 'UnknownError'
} as const;

export const errorMessages = {
  [errorTypes.CHUNK_LOAD_ERROR]: 'Error cargando recursos de la aplicación',
  [errorTypes.NETWORK_ERROR]: 'Error de conexión de red',
  [errorTypes.PERMISSION_ERROR]: 'Error de permisos',
  [errorTypes.UNKNOWN_ERROR]: 'Ha ocurrido un error inesperado'
};