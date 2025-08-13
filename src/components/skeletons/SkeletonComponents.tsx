import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from '@/components/theme-provider';
import { motion } from 'framer-motion';

// Provider wrapper que adapta los colores al tema
export const SkeletonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  // Detectar el tema del sistema manualmente
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const currentTheme = theme === 'system' ? systemTheme : theme;
  
  const skeletonColors = {
    light: {
      baseColor: '#f3f4f6', // gray-100
      highlightColor: '#e5e7eb' // gray-200
    },
    dark: {
      baseColor: '#374151', // gray-700
      highlightColor: '#4b5563' // gray-600
    }
  };
  
  const colors = skeletonColors[currentTheme === 'dark' ? 'dark' : 'light'];
  
  return (
    <SkeletonTheme baseColor={colors.baseColor} highlightColor={colors.highlightColor}>
      {children}
    </SkeletonTheme>
  );
};

// Skeleton para cards de proyectos
export const ProjectCardSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden shadow-lg"
  >
    {/* Imagen skeleton */}
    <div className="w-full h-48">
      <Skeleton height="100%" />
    </div>
    
    <div className="p-6 space-y-4">
      {/* Título */}
      <Skeleton height={24} width="80%" />
      
      {/* Fecha */}
      <div className="flex items-center gap-2">
        <Skeleton width={16} height={16} />
        <Skeleton width="40%" height={14} />
      </div>
      
      {/* Descripción */}
      <div className="space-y-2">
        <Skeleton height={14} />
        <Skeleton height={14} />
        <Skeleton height={14} width="60%" />
      </div>
      
      {/* Tecnologías */}
      <div className="flex flex-wrap gap-2">
        <Skeleton width={60} height={24} borderRadius={12} />
        <Skeleton width={45} height={24} borderRadius={12} />
        <Skeleton width={70} height={24} borderRadius={12} />
        <Skeleton width={55} height={24} borderRadius={12} />
      </div>
      
      {/* Botones */}
      <div className="flex gap-2">
        <Skeleton width={80} height={32} borderRadius={6} />
        <Skeleton width={70} height={32} borderRadius={6} />
      </div>
    </div>
  </motion.div>
);

// Skeleton para cards de servicios
export const ServiceCardSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg p-6"
  >
    {/* Header con icono y título */}
    <div className="flex items-center gap-3 mb-4">
      <Skeleton width={48} height={48} borderRadius={8} />
      <div className="flex-1 space-y-2">
        <Skeleton height={20} width="70%" />
        <Skeleton height={14} width="90%" />
      </div>
    </div>
    
    {/* Tecnologías */}
    <div className="mb-6">
      <Skeleton height={12} width="30%" className="mb-3" />
      <div className="flex flex-wrap gap-2">
        <Skeleton width={50} height={20} borderRadius={10} />
        <Skeleton width={65} height={20} borderRadius={10} />
        <Skeleton width={40} height={20} borderRadius={10} />
        <Skeleton width={55} height={20} borderRadius={10} />
      </div>
    </div>
    
    {/* Lista de características */}
    <div className="mb-6">
      <Skeleton height={12} width="40%" className="mb-3" />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-start gap-2">
            <Skeleton width={16} height={16} borderRadius="50%" />
            <Skeleton height={14} width="85%" />
          </div>
        ))}
      </div>
    </div>
    
    {/* Sección entregables */}
    <div className="bg-muted/30 rounded-lg p-4 mb-4">
      <Skeleton height={12} width="35%" className="mb-2" />
      <div className="space-y-1">
        <Skeleton height={14} />
        <Skeleton height={14} width="80%" />
      </div>
    </div>
    
    {/* Botón */}
    <Skeleton height={40} borderRadius={6} />
  </motion.div>
);

// Skeleton para educación timeline
export const EducationCardSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-xl p-6"
  >
    {/* Header con logo y estado */}
    <div className="flex items-start justify-between mb-4">
      <Skeleton width={64} height={64} borderRadius={8} />
      <Skeleton width={80} height={24} borderRadius={12} />
    </div>
    
    {/* Título y subtítulo */}
    <div className="space-y-2 mb-4">
      <Skeleton height={24} width="80%" />
      <Skeleton height={18} width="90%" />
    </div>
    
    {/* Fecha y ubicación */}
    <div className="flex items-center justify-between text-sm mb-4">
      <div className="flex items-center gap-2">
        <Skeleton width={16} height={16} />
        <Skeleton width={120} height={14} />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton width={16} height={16} />
        <Skeleton width={80} height={14} />
      </div>
    </div>
    
    {/* Descripción */}
    <div className="space-y-2 mb-4">
      <Skeleton height={14} />
      <Skeleton height={14} />
      <Skeleton height={14} width="70%" />
    </div>
    
    {/* Botón opcional */}
    <Skeleton height={32} width={150} borderRadius={6} />
  </motion.div>
);

// Skeleton para certificados
export const CertificateCardSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg overflow-hidden"
  >
    {/* Imagen del certificado */}
    <div className="w-full h-32">
      <Skeleton height="100%" />
    </div>
    
    <div className="p-6 space-y-4">
      {/* Título */}
      <Skeleton height={20} width="85%" />
      
      {/* Institución */}
      <Skeleton height={16} width="70%" />
      
      {/* Fecha */}
      <div className="flex items-center gap-2">
        <Skeleton width={12} height={12} />
        <Skeleton width="30%" height={14} />
      </div>
      
      {/* Descripción */}
      <div className="space-y-2">
        <Skeleton height={14} />
        <Skeleton height={14} width="80%" />
      </div>
      
      {/* Tecnologías */}
      <div className="flex flex-wrap gap-2">
        <Skeleton width={45} height={20} borderRadius={10} />
        <Skeleton width={60} height={20} borderRadius={10} />
        <Skeleton width={35} height={20} borderRadius={10} />
      </div>
      
      {/* Botón */}
      <Skeleton height={32} borderRadius={6} />
    </div>
  </motion.div>
);

// Skeleton para estadísticas
export const StatsCardSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center"
  >
    <Skeleton height={28} width="60%" className="mb-4 mx-auto" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="text-center">
          <Skeleton height={36} width={60} className="mb-2 mx-auto" />
          <Skeleton height={14} width={80} className="mx-auto" />
        </div>
      ))}
    </div>
  </motion.div>
);

// Skeleton para filtros
export const FilterSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 mb-8 shadow-lg"
  >
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
      {/* Búsqueda */}
      <div className="flex-1 min-w-0">
        <Skeleton height={40} borderRadius={6} />
      </div>
      
      {/* Filtros de tecnología */}
      <div className="flex flex-wrap gap-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} width={60 + i * 10} height={32} borderRadius={16} />
        ))}
      </div>
      
      {/* Botones adicionales */}
      <div className="flex items-center gap-2">
        <Skeleton width={100} height={32} borderRadius={16} />
        <Skeleton width={60} height={32} borderRadius={16} />
      </div>
    </div>
    
    {/* Estadísticas */}
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
      <div className="flex items-center gap-6">
        <Skeleton width={120} height={14} />
        <Skeleton width={80} height={14} />
        <Skeleton width={100} height={14} />
      </div>
    </div>
  </motion.div>
);

// Skeleton genérico para listas
export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-4">
    {[...Array(count)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        className="p-4 bg-card/30 rounded-lg border border-border/30"
      >
        <div className="flex items-center gap-3">
          <Skeleton width={40} height={40} borderRadius="50%" />
          <div className="flex-1 space-y-2">
            <Skeleton height={16} width="60%" />
            <Skeleton height={14} width="80%" />
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);