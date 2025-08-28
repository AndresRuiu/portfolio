import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Las variables de entorno de Supabase no están configuradas correctamente')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Tipos útiles para trabajar con las tablas
export type ProjectRow = Database['public']['Tables']['proyectos']['Row']
export type ProjectInsert = Database['public']['Tables']['proyectos']['Insert']
export type ProjectUpdate = Database['public']['Tables']['proyectos']['Update']

export type ServiceRow = Database['public']['Tables']['servicios']['Row']
export type ServiceInsert = Database['public']['Tables']['servicios']['Insert']
export type ServiceUpdate = Database['public']['Tables']['servicios']['Update']

export type EducacionRow = Database['public']['Tables']['educacion']['Row']
export type EducacionInsert = Database['public']['Tables']['educacion']['Insert']
export type EducacionUpdate = Database['public']['Tables']['educacion']['Update']

export type CertificadoRow = Database['public']['Tables']['certificados']['Row']
export type CertificadoInsert = Database['public']['Tables']['certificados']['Insert']
export type CertificadoUpdate = Database['public']['Tables']['certificados']['Update']

export type TestimonioRow = Database['public']['Tables']['testimonios']['Row']
export type TestimonioInsert = Database['public']['Tables']['testimonios']['Insert']
export type TestimonioUpdate = Database['public']['Tables']['testimonios']['Update']
