import { useState, useEffect } from 'react'

/**
 * 🚀 Hook de debounce optimizado para búsqueda instantánea
 * 
 * Previene múltiples queries innecesarias mientras el usuario está escribiendo,
 * aprovechando al máximo los índices GIN y full-text search implementados.
 * 
 * @param value - Valor a hacer debounce
 * @param delay - Delay en milisegundos (300ms óptimo para UX de búsqueda)
 * @returns Valor con debounce aplicado
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: cancelar timeout si value cambia antes del delay
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * 🎯 Hook de debounce especializado para búsqueda de portfolio
 * 
 * Configuración optimizada para:
 * - Búsqueda instantánea con mínima latencia percibida
 * - Reducción de queries innecesarias a Supabase
 * - Balance perfecto entre UX y rendimiento de BD
 */
export function useSearchDebounce(searchTerm: string) {
  // 300ms es el sweet spot para búsqueda instantánea:
  // - < 300ms: Demasiadas queries, desperdicia optimizaciones DB
  // - > 300ms: Se siente lento para el usuario
  return useDebounce(searchTerm, 300)
}

export default useDebounce
