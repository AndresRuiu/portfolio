import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

// Hook para obtener datos de cualquier tabla
export function useSupabaseQuery<T = Record<string, unknown>>({
  table,
  select = '*',
  filters = {},
  enabled = true,
}: {
  table: string
  select?: string
  filters?: Record<string, unknown>
  enabled?: boolean
}) {
  return useQuery({
    queryKey: [table, select, filters],
    queryFn: async () => {
      let query = supabase.from(table as any).select(select)
      
      // Aplicar filtros
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value)
        }
      })
      
      const { data, error } = await query
      
      if (error) {
        throw new Error(error.message)
      }
      
      return data as T[]
    },
    enabled,
  })
}

// Hook para insertar datos
export function useSupabaseInsert(table: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const { data: result, error } = await supabase
        .from(table as any)
        .insert(data)
        .select()
        .single()
      
      if (error) {
        throw new Error(error.message)
      }
      
      return result
    },
    onSuccess: () => {
      // Invalidar las consultas relacionadas con esta tabla
      queryClient.invalidateQueries({ queryKey: [table] })
    },
  })
}

// Hook para actualizar datos
export function useSupabaseUpdate(table: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: Record<string, unknown> }) => {
      const { data: result, error } = await supabase
        .from(table as any)
        .update(data)
        .eq('id', String(id))
        .select()
        .single()
      
      if (error) {
        throw new Error(error.message)
      }
      
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] })
    },
  })
}

// Hook para eliminar datos
export function useSupabaseDelete(table: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string | number) => {
      const { error } = await supabase
        .from(table as any)
        .delete()
        .eq('id', String(id))
      
      if (error) {
        throw new Error(error.message)
      }
      
      return { id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] })
    },
  })
}

// Hook para autenticación
export function useAuth() {
  const queryClient = useQueryClient()
  
  // Obtener el usuario actual
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    },
  })
  
  // Login con email y contraseña
  const signIn = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        throw new Error(error.message)
      }
      
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
  
  // Registro
  const signUp = useMutation({
    mutationFn: async ({ email, password, metadata }: { 
      email: string; 
      password: string; 
      metadata?: Record<string, unknown> 
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })
      
      if (error) {
        throw new Error(error.message)
      }
      
      return data
    },
  })
  
  // Logout
  const signOut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
  
  return {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  }
}

// Hook para suscribirse a cambios en tiempo real
export function useSupabaseSubscription({
  table,
  filter,
  enabled = true,
}: {
  table: string
  filter?: string
  enabled?: boolean
}) {
  const queryClient = useQueryClient()
  
  useQuery({
    queryKey: ['subscription', table, filter],
    queryFn: () => {
      if (!enabled) return null
      
      const channel = supabase
        .channel(`${table}-changes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table,
            filter,
          },
          () => {
            // Invalidar las consultas cuando hay cambios
            queryClient.invalidateQueries({ queryKey: [table] })
          }
        )
        .subscribe()
      
      return channel
    },
    enabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
