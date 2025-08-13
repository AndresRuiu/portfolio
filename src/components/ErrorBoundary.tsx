import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnifiedCard, UnifiedCardHeader, UnifiedCardTitle, UnifiedCardContent } from '@/components/ui/UnifiedCard';

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  isolate?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log del error personalizado
    this.logError(error, errorInfo);
    
    // Callback opcional para el parent
    this.props.onError?.(error, errorInfo);
  }

  private logError = (error: Error, errorInfo: ErrorInfo) => {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // En desarrollo, log a consola
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Full Report:', errorReport);
      console.groupEnd();
    }

    // En producción, enviar a servicio de monitoring
    if (process.env.NODE_ENV === 'production') {
      // Aquí integrarías con Sentry, LogRocket, etc.
      // Sentry.captureException(error, { extra: errorReport });
    }
  };

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
          errorInfo={this.state.errorInfo}
        />
      );
    }

    return this.props.children;
  }
}

// Fallback por defecto
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => (
  <UnifiedCard variant="subtle" size="lg" className="max-w-2xl mx-auto my-8">
    <UnifiedCardHeader>
      <div className="flex items-center gap-3 text-destructive">
        <AlertTriangle className="w-8 h-8" />
        <UnifiedCardTitle size="lg">¡Oops! Algo salió mal</UnifiedCardTitle>
      </div>
    </UnifiedCardHeader>
    <UnifiedCardContent className="space-y-6">
      <p className="text-muted-foreground">
        Se ha producido un error inesperado. No te preocupes, es temporal y ya hemos sido notificados.
      </p>
      
      {process.env.NODE_ENV === 'development' && error && (
        <details className="bg-muted/30 rounded-lg p-4">
          <summary className="cursor-pointer font-medium mb-2">Detalles técnicos (desarrollo)</summary>
          <code className="text-sm text-destructive whitespace-pre-wrap">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </code>
        </details>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={resetError} className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Intentar de nuevo
        </Button>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Ir al inicio
        </Button>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Recargar página
        </Button>
      </div>
    </UnifiedCardContent>
  </UnifiedCard>
);

// Fallback específico para galería de proyectos
export const ProjectErrorFallback: React.FC<ErrorFallbackProps> = ({ resetError }) => (
  <UnifiedCard variant="subtle" size="md" className="text-center">
    <UnifiedCardContent className="space-y-4">
      <Bug className="w-12 h-12 mx-auto text-muted-foreground" />
      <UnifiedCardTitle size="md">Error al cargar proyectos</UnifiedCardTitle>
      <p className="text-sm text-muted-foreground">
        No pudimos cargar la galería de proyectos en este momento.
      </p>
      <Button onClick={resetError} size="sm">
        Reintentar
      </Button>
    </UnifiedCardContent>
  </UnifiedCard>
);

// Fallback específico para servicios
export const ServiceErrorFallback: React.FC<ErrorFallbackProps> = ({ resetError }) => (
  <UnifiedCard variant="subtle" size="md" className="text-center">
    <UnifiedCardContent className="space-y-4">
      <AlertTriangle className="w-12 h-12 mx-auto text-yellow-500" />
      <UnifiedCardTitle size="md">Error en servicios</UnifiedCardTitle>
      <p className="text-sm text-muted-foreground">
        Hubo un problema al cargar la información de servicios.
      </p>
      <Button onClick={resetError} size="sm" variant="outline">
        Intentar de nuevo
      </Button>
    </UnifiedCardContent>
  </UnifiedCard>
);

// Fallback para modales
export const ModalErrorFallback: React.FC<ErrorFallbackProps> = ({ resetError }) => (
  <div className="flex flex-col items-center space-y-4 p-6">
    <AlertTriangle className="w-8 h-8 text-destructive" />
    <h3 className="text-lg font-semibold">Error en el modal</h3>
    <p className="text-sm text-muted-foreground text-center">
      No pudimos cargar el contenido del modal.
    </p>
    <Button onClick={resetError} size="sm">
      Reintentar
    </Button>
  </div>
);

// Hook para usar Error Boundary programáticamente
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);
  
  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};

// HOC para wrappear componentes con Error Boundary
export const withErrorBoundary = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: React.ComponentType<ErrorFallbackProps>
) => {
  const WithErrorBoundaryComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName = 
    `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithErrorBoundaryComponent;
};

export default ErrorBoundary;