import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Sistema de design unificado basado en Bento Grid
interface UnifiedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'highlight' | 'subtle' | 'glass' | 'project';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  delay?: number;
  hover?: boolean;
  onClick?: () => void;
}

const gradientVariants = {
  default: "bg-gradient-to-br from-card/80 to-card/40",
  gradient: "bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20",
  highlight: "bg-gradient-to-br from-blue-500/20 to-cyan-500/10",
  subtle: "bg-gradient-to-br from-card/60 to-card/20 border-border/30",
  glass: "bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl",
  project: "bg-gradient-to-br from-card/80 via-card/60 to-card/30 border-border/50 hover:border-primary/30",
};

const sizeVariants = {
  sm: "p-4 rounded-2xl",
  md: "p-6 rounded-2xl", 
  lg: "p-6 rounded-3xl",
  xl: "p-8 rounded-3xl",
};

export const UnifiedCard: React.FC<UnifiedCardProps> = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  delay = 0,
  hover = true,
  onClick,
}) => {
  const isInteractive = !!onClick;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={hover ? { 
        scale: 1.02, 
        y: -2,
        transition: { duration: 0.2, ease: "easeOut" }
      } : undefined}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 10
      }}
      onClick={onClick}
      className={cn(
        // Base styles - siguiendo Bento Grid
        "relative overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300",
        "backdrop-blur-sm",
        
        // Gradient backgrounds
        gradientVariants[variant],
        
        // Size variants
        sizeVariants[size],
        
        // Interactive states
        isInteractive && "cursor-pointer hover:border-primary/30",
        
        className
      )}
    >
      {children}
    </motion.div>
  );
};

// Card Header component
interface UnifiedCardHeaderProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  iconColor?: string;
}

export const UnifiedCardHeader: React.FC<UnifiedCardHeaderProps> = ({
  children,
  className,
  icon: Icon,
  iconColor = "text-primary",
}) => (
  <div className={cn("mb-4", className)}>
    {Icon && (
      <div className={cn("mb-3", iconColor)}>
        <Icon className="w-6 h-6" />
      </div>
    )}
    {children}
  </div>
);

// Card Title component
interface UnifiedCardTitleProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const UnifiedCardTitle: React.FC<UnifiedCardTitleProps> = ({
  children,
  className,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: "text-lg font-semibold",
    md: "text-xl font-bold",
    lg: "text-2xl font-bold",
  };

  return (
    <h3 className={cn(
      sizeClasses[size],
      "mb-2 leading-tight",
      className
    )}>
      {children}
    </h3>
  );
};

// Card Description component
interface UnifiedCardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const UnifiedCardDescription: React.FC<UnifiedCardDescriptionProps> = ({
  children,
  className,
}) => (
  <p className={cn(
    "text-muted-foreground leading-relaxed",
    className
  )}>
    {children}
  </p>
);

// Card Content component
interface UnifiedCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const UnifiedCardContent: React.FC<UnifiedCardContentProps> = ({
  children,
  className,
}) => (
  <div className={cn("flex-1", className)}>
    {children}
  </div>
);

// Card Footer component
interface UnifiedCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const UnifiedCardFooter: React.FC<UnifiedCardFooterProps> = ({
  children,
  className,
}) => (
  <div className={cn("mt-4 pt-4 border-t border-border/20", className)}>
    {children}
  </div>
);

// Grid container siguiendo Bento Grid
interface UnifiedGridProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'masonry' | 'equal' | 'auto';
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

export const UnifiedGrid: React.FC<UnifiedGridProps> = ({
  children,
  className,
  variant = 'equal',
  columns = 3,
  gap = 'md',
}) => {
  const gapClasses = {
    sm: "gap-4",
    md: "gap-6", 
    lg: "gap-8",
  };

  const gridClasses = {
    masonry: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-max",
    equal: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`,
    auto: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-fr",
  };

  return (
    <div className={cn(
      gridClasses[variant],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
};

// Stats component siguiendo el estilo Bento
interface StatsCardProps {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  value: string | number;
  label: string;
  description?: string;
  color?: string;
  delay?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  value,
  label,
  description,
  color = "text-primary",
  delay = 0,
}) => {
  return (
    <UnifiedCard variant="subtle" size="sm" delay={delay} className="text-center">
      <Icon className={cn("w-6 h-6 mx-auto mb-2", color)} />
      <div className={cn("text-2xl font-bold mb-1", color)}>{value}</div>
      <div className="text-sm font-medium mb-1">{label}</div>
      {description && (
        <div className="text-xs text-muted-foreground">{description}</div>
      )}
    </UnifiedCard>
  );
};

export default UnifiedCard;