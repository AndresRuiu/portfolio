import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/hooks/useAccessibility';

interface AccessibleButtonProps extends Omit<HTMLMotionProps<"button">, 'whileHover' | 'whileTap'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    children, 
    className,
    disabled,
    ...props 
  }, ref) => {
    const { reducedMotion } = useAccessibility();

    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'border border-border bg-transparent hover:bg-muted',
      ghost: 'bg-transparent hover:bg-muted',
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const motionProps = reducedMotion ? {} : {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: { duration: 0.15 }
    };

    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center',
          'rounded-lg font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          
          // Variant styles
          variants[variant],
          
          // Size styles
          sizes[size],
          
          // Loading state
          isLoading && 'cursor-wait',
          
          className
        )}
        aria-busy={isLoading}
        aria-disabled={disabled || isLoading}
        {...motionProps}
        {...props}
      >
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div 
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            />
          </motion.div>
        )}
        
        <motion.span
          className={cn(
            'flex items-center gap-2',
            isLoading && 'opacity-0'
          )}
          animate={{ opacity: isLoading ? 0 : 1 }}
        >
          {children}
        </motion.span>
      </motion.button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

export { AccessibleButton };
export default AccessibleButton;