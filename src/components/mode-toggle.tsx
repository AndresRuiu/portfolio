import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  
  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light')
    } else if (theme === 'light') {
      setTheme('dark')
    } else {
      // Si está en 'system', cambiar basado en la preferencia actual del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'light' : 'dark')
    }
  }

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-full h-full rounded-xl bg-transparent border-0 outline-none cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ 
            opacity: 0, 
            rotate: isDark ? 180 : -180,
            scale: 0.5 
          }}
          animate={{ 
            opacity: 1, 
            rotate: 0,
            scale: 1 
          }}
          exit={{ 
            opacity: 0, 
            rotate: isDark ? -180 : 180,
            scale: 0.5 
          }}
          transition={{ 
            duration: 0.4, 
            ease: "easeInOut",
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isDark ? (
            <SunIcon className="h-5 w-5 text-foreground/70" />
          ) : (
            <MoonIcon className="h-5 w-5 text-foreground/70" />
          )}
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </motion.button>
  )
}