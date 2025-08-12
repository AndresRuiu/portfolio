import React from 'react';
import { motion } from 'framer-motion';

// Skeleton para tarjetas de proyectos
export const ProjectSkeleton = () => (
  <div className="rounded-lg bg-card border overflow-hidden h-full">
    <motion.div 
      className="w-full h-40 sm:h-48 md:h-56 bg-muted"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <div className="p-3 sm:p-4 space-y-3">
      <motion.div 
        className="h-4 bg-muted rounded w-3/4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
      />
      <div className="space-y-2">
        <motion.div 
          className="h-3 bg-muted rounded w-1/2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
        />
        <motion.div 
          className="h-3 bg-muted rounded w-2/3"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
        />
      </div>
      <div className="flex gap-2">
        <motion.div 
          className="h-6 bg-muted rounded-full w-16"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
        />
        <motion.div 
          className="h-6 bg-muted rounded-full w-20"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 1.0 }}
        />
      </div>
    </div>
  </div>
);

// Loading spinner
export const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 border-primary border-t-transparent rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

// Button con estado de loading
export const LoadingButton = ({ 
  isLoading, 
  children, 
  onClick,
  className = "",
  ...props 
}: {
  isLoading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'>) => (
  <motion.button
    onClick={onClick}
    disabled={isLoading}
    className={`
      relative overflow-hidden
      px-4 py-2 rounded-md
      bg-primary text-primary-foreground
      hover:bg-primary/90
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-all duration-200
      ${className}
    `}
    whileHover={!isLoading ? { scale: 1.02 } : {}}
    whileTap={!isLoading ? { scale: 0.98 } : {}}
    {...props}
  >
    {isLoading && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 flex items-center justify-center bg-primary"
      >
        <LoadingSpinner size="sm" />
      </motion.div>
    )}
    <motion.span
      animate={{ opacity: isLoading ? 0 : 1 }}
      className="flex items-center gap-2"
    >
      {children}
    </motion.span>
  </motion.button>
);
