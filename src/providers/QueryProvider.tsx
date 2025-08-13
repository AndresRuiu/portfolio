import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configuración optimizada del QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache por 5 minutos
      staleTime: 1000 * 60 * 5,
      // Mantener en cache por 10 minutos
      gcTime: 1000 * 60 * 10,
      // Reintentar automáticamente en caso de error
      retry: (failureCount, error: any) => {
        // No reintentar para errores 4xx
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Reintentar máximo 3 veces
        return failureCount < 3;
      },
      // Refetch en background cuando el usuario regresa a la ventana
      refetchOnWindowFocus: true,
      // Refetch cuando se reconecta la red
      refetchOnReconnect: true,
    },
    mutations: {
      // Reintentar mutaciones una vez
      retry: 1,
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;