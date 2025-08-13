import React, { forwardRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useAccessibility } from '@/hooks/useAccessibility';
import { cn } from '@/lib/utils';

interface AccessibleButtonProps extends ButtonProps {
  announcement?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ children, announcement, className, onClick, ...props }, ref) => {
    const { reducedMotion } = useAccessibility();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (announcement) {
        const announcement_div = document.createElement('div');
        announcement_div.setAttribute('aria-live', 'polite');
        announcement_div.setAttribute('aria-atomic', 'true');
        announcement_div.className = 'sr-only';
        announcement_div.textContent = announcement;
        
        document.body.appendChild(announcement_div);
        
        setTimeout(() => {
          document.body.removeChild(announcement_div);
        }, 1000);
      }
      
      onClick?.(e);
    };

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        className={cn(
          'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          reducedMotion && 'transition-none',
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;