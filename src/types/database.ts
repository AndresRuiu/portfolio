export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      certificados: {
        Row: {
          activo: boolean | null
          created_at: string | null
          descripcion: string | null
          enlace: string | null
          fecha: string | null
          id: string
          imagen_url: string | null
          institucion: string | null
          orden: number | null
          tecnologias: string[] | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          enlace?: string | null
          fecha?: string | null
          id?: string
          imagen_url?: string | null
          institucion?: string | null
          orden?: number | null
          tecnologias?: string[] | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          enlace?: string | null
          fecha?: string | null
          id?: string
          imagen_url?: string | null
          institucion?: string | null
          orden?: number | null
          tecnologias?: string[] | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      educacion: {
        Row: {
          activo: boolean | null
          created_at: string | null
          descripcion: string | null
          estado: string | null
          fin: string | null
          href: string | null
          id: string
          inicio: string | null
          institucion: string
          logo_url: string | null
          orden: number | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          estado?: string | null
          fin?: string | null
          href?: string | null
          id?: string
          inicio?: string | null
          institucion: string
          logo_url?: string | null
          orden?: number | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          estado?: string | null
          fin?: string | null
          href?: string | null
          id?: string
          inicio?: string | null
          institucion?: string
          logo_url?: string | null
          orden?: number | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      proyectos: {
        Row: {
          activo: boolean | null
          created_at: string | null
          descripcion: string | null
          destacado: boolean | null
          enlaces: Json | null
          fechas: string | null
          id: string
          imagen_url: string | null
          tecnologias: string[] | null
          titulo: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          destacado?: boolean | null
          enlaces?: Json | null
          fechas?: string | null
          id?: string
          imagen_url?: string | null
          tecnologias?: string[] | null
          titulo: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          destacado?: boolean | null
          enlaces?: Json | null
          fechas?: string | null
          id?: string
          imagen_url?: string | null
          tecnologias?: string[] | null
          titulo?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      servicios: {
        Row: {
          activo: boolean | null
          created_at: string | null
          descripcion: string | null
          entregables: string | null
          icono: string | null
          id: string
          incluye: string[] | null
          orden: number | null
          tecnologias: string[] | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          entregables?: string | null
          icono?: string | null
          id?: string
          incluye?: string[] | null
          orden?: number | null
          tecnologias?: string[] | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          entregables?: string | null
          icono?: string | null
          id?: string
          incluye?: string[] | null
          orden?: number | null
          tecnologias?: string[] | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      perfil: {
        Row: {
          activo: boolean | null
          created_at: string | null
          description: string | null
          email: string | null
          habilidades: string[] | null
          id: string
          iniciales: string
          navegacion: Json | null
          nombre: string
          redes_sociales: Json | null
          resumen: string | null
          telefono: string | null
          ubicacion: string | null
          updated_at: string | null
          url: string | null
          url_avatar: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          habilidades?: string[] | null
          id?: string
          iniciales: string
          navegacion?: Json | null
          nombre: string
          redes_sociales?: Json | null
          resumen?: string | null
          telefono?: string | null
          ubicacion?: string | null
          updated_at?: string | null
          url?: string | null
          url_avatar?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          habilidades?: string[] | null
          id?: string
          iniciales?: string
          navegacion?: Json | null
          nombre?: string
          redes_sociales?: Json | null
          resumen?: string | null
          telefono?: string | null
          ubicacion?: string | null
          updated_at?: string | null
          url?: string | null
          url_avatar?: string | null
        }
        Relationships: []
      }
      testimonios: {
        Row: {
          activo: boolean | null
          cargo: string | null
          created_at: string | null
          empresa: string | null
          fecha: string | null
          id: string
          imagen_url: string | null
          nombre: string
          orden: number | null
          proyecto: string | null
          rating: number | null
          texto: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          cargo?: string | null
          created_at?: string | null
          empresa?: string | null
          fecha?: string | null
          id?: string
          imagen_url?: string | null
          nombre: string
          orden?: number | null
          proyecto?: string | null
          rating?: number | null
          texto: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          cargo?: string | null
          created_at?: string | null
          empresa?: string | null
          fecha?: string | null
          id?: string
          imagen_url?: string | null
          nombre?: string
          orden?: number | null
          proyecto?: string | null
          rating?: number | null
          texto?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
