import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/LoadingStates'

// Lazy loading para las páginas
import HomePage from '@/pages/HomePage'
import ProyectosPage from '@/pages/ProyectosPage'
import ServiciosPage from '@/pages/ServiciosPage'
import EducacionPage from '@/pages/EducacionPage'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/proyectos" element={<ProyectosPage />} />
              <Route path="/servicios" element={<ServiciosPage />} />
              <Route path="/educacion" element={<EducacionPage />} />
            </Routes>
          </Suspense>
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
