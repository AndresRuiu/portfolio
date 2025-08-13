import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'skeleton';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: (error: Event) => void;
  sizes?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  priority = false,
  placeholder = 'skeleton',
  blurDataURL,
  onLoad,
  onError,
  sizes = '100vw',
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '100px', // Cargar 100px antes de que sea visible
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => observerRef.current?.disconnect();
  }, [priority]);

  // Generar srcSet para responsive images
  const generateSrcSet = (originalSrc: string) => {
    // Si es una imagen externa o no tiene extensión, usar original
    if (originalSrc.startsWith('http') || !originalSrc.includes('.')) {
      return originalSrc;
    }

    // Para imágenes locales, generar diferentes tamaños
    const [base, ext] = originalSrc.split('.');
    return [
      `${base}-400w.${ext} 400w`,
      `${base}-800w.${ext} 800w`,
      `${base}-1200w.${ext} 1200w`,
      `${originalSrc} 1600w`
    ].join(', ');
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = (error: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(error.nativeEvent);
  };

  // Skeleton placeholder
  const SkeletonPlaceholder = () => (
    <div 
      className={cn(
        "animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg",
        "flex items-center justify-center",
        className
      )}
      style={{ aspectRatio: props.width && props.height ? `${props.width}/${props.height}` : '16/9' }}
    >
      <div className="text-muted-foreground text-sm">
        <svg 
          className="w-8 h-8" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path 
            fillRule="evenodd" 
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
    </div>
  );

  // Error placeholder
  const ErrorPlaceholder = () => (
    <div 
      className={cn(
        "bg-muted/30 border-2 border-dashed border-muted-foreground/20 rounded-lg",
        "flex flex-col items-center justify-center text-muted-foreground p-4",
        className
      )}
      style={{ aspectRatio: props.width && props.height ? `${props.width}/${props.height}` : '16/9' }}
    >
      <svg 
        className="w-8 h-8 mb-2" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
        />
      </svg>
      <span className="text-xs">Error al cargar</span>
    </div>
  );

  // Si hay error, mostrar placeholder
  if (hasError) {
    return <ErrorPlaceholder />;
  }

  return (
    <div className="relative overflow-hidden">
      {/* Skeleton mientras carga */}
      {isLoading && <SkeletonPlaceholder />}
      
      {/* Blur placeholder */}
      {placeholder === 'blur' && blurDataURL && isLoading && (
        <img
          src={blurDataURL}
          alt=""
          className={cn(
            "absolute inset-0 w-full h-full object-cover filter blur-sm scale-110",
            className
          )}
          aria-hidden="true"
        />
      )}

      {/* Imagen principal */}
      <img
        ref={imgRef}
        src={isInView ? src : undefined}
        srcSet={isInView ? generateSrcSet(src) : undefined}
        sizes={sizes}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        {...props}
      />
    </div>
  );
};

// Hook para precargar imágenes críticas
export const useImagePreload = (sources: string[]) => {
  useEffect(() => {
    sources.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [sources]);
};

// Utilidad para generar blur placeholder
export const generateBlurDataURL = (width: number = 8, height: number = 8): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  // Gradiente simple para el blur
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
};

export default OptimizedImage;