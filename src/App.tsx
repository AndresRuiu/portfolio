import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Suspense, useState, useEffect } from 'react'
import { AppLoader } from '@/components/AppLoader'
import { Toaster } from 'sonner'
import { SkeletonProvider } from '@/components/skeletons/SkeletonComponents'
import { AppProvider } from '@/contexts/AppContext'

// Lazy loading para las páginas
import HomePage from '@/pages/HomePage'
import ProyectosPage from '@/pages/ProyectosPage'
import ServiciosPage from '@/pages/ServiciosPage'
import EducacionPage from '@/pages/EducacionPage'

export default function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Simular carga inicial de la app
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1800); // 1.8 segundos de loading inicial

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <AppProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <SkeletonProvider>
            <TooltipProvider>
              {isInitialLoading ? (
                <AppLoader isLoading={true} minLoadTime={1500} />
              ) : (
                <Suspense fallback={<AppLoader isLoading={true} minLoadTime={800} />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/proyectos" element={<ProyectosPage />} />
                    <Route path="/servicios" element={<ServiciosPage />} />
                    <Route path="/educacion" element={<EducacionPage />} />
                  </Routes>
                </Suspense>
              )}
              <Toaster 
                position="top-right"
                richColors
                closeButton
                expand
                visibleToasts={4}
                duration={4000}
                className="toaster"
              />
            </TooltipProvider>
          </SkeletonProvider>
        </ThemeProvider>
      </AppProvider>
    </BrowserRouter>
  )
}
