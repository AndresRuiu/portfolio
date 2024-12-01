import { BrowserRouter } from 'react-router-dom'
import Portfolio from "@/components/Portfolio"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Portfolio />
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}