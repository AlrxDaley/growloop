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
      clients: {
        Row: {
          address: string
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      photos: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          file_path: string
          id: string
          plant_id: string | null
          tags: string[] | null
          taken_at: string
          title: string
          updated_at: string
          user_id: string
          zone_id: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          file_path: string
          id?: string
          plant_id?: string | null
          tags?: string[] | null
          taken_at?: string
          title: string
          updated_at?: string
          user_id: string
          zone_id?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          file_path?: string
          id?: string
          plant_id?: string | null
          tags?: string[] | null
          taken_at?: string
          title?: string
          updated_at?: string
          user_id?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photos_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      plantmaterial: {
        Row: {
          category: string | null
          common_name: string | null
          fertiliser: string | null
          flowering_period: string | null
          id: number
          notes: string | null
          pests_diseases: string | null
          planting_time: string | null
          popularity_rank: number | null
          position: string | null
          propagation: string | null
          pruning: string | null
          scientific_name: string | null
          soil: string | null
          watering: string | null
        }
        Insert: {
          category?: string | null
          common_name?: string | null
          fertiliser?: string | null
          flowering_period?: string | null
          id?: number
          notes?: string | null
          pests_diseases?: string | null
          planting_time?: string | null
          popularity_rank?: number | null
          position?: string | null
          propagation?: string | null
          pruning?: string | null
          scientific_name?: string | null
          soil?: string | null
          watering?: string | null
        }
        Update: {
          category?: string | null
          common_name?: string | null
          fertiliser?: string | null
          flowering_period?: string | null
          id?: number
          notes?: string | null
          pests_diseases?: string | null
          planting_time?: string | null
          popularity_rank?: number | null
          position?: string | null
          propagation?: string | null
          pruning?: string | null
          scientific_name?: string | null
          soil?: string | null
          watering?: string | null
        }
        Relationships: []
      }
      plants: {
        Row: {
          created_at: string
          id: string
          name: string
          notes: string | null
          planted_date: string | null
          updated_at: string
          user_id: string
          variety: string | null
          zone_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          planted_date?: string | null
          updated_at?: string
          user_id: string
          variety?: string | null
          zone_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          planted_date?: string | null
          updated_at?: string
          user_id?: string
          variety?: string | null
          zone_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plants_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          client_id: string
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string
          estimated_time_minutes: number | null
          id: string
          priority: string
          recurring: boolean | null
          status: string
          task_type: string | null
          title: string
          updated_at: string
          user_id: string
          zone_id: string | null
        }
        Insert: {
          client_id: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date: string
          estimated_time_minutes?: number | null
          id?: string
          priority?: string
          recurring?: boolean | null
          status?: string
          task_type?: string | null
          title: string
          updated_at?: string
          user_id: string
          zone_id?: string | null
        }
        Update: {
          client_id?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string
          estimated_time_minutes?: number | null
          id?: string
          priority?: string
          recurring?: boolean | null
          status?: string
          task_type?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      visits: {
        Row: {
          client_id: string
          completed_at: string | null
          created_at: string
          id: string
          notes: string | null
          priority: string
          scheduled_date: string
          scheduled_time: string | null
          status: string
          updated_at: string
          user_id: string
          zones: string[] | null
        }
        Insert: {
          client_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          priority?: string
          scheduled_date: string
          scheduled_time?: string | null
          status?: string
          updated_at?: string
          user_id: string
          zones?: string[] | null
        }
        Update: {
          client_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          priority?: string
          scheduled_date?: string
          scheduled_time?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          zones?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "visits_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      zone_plantmaterial: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          plantmaterial_id: number
          quantity: number | null
          updated_at: string
          user_id: string
          zone_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          plantmaterial_id: number
          quantity?: number | null
          updated_at?: string
          user_id: string
          zone_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          plantmaterial_id?: number
          quantity?: number | null
          updated_at?: string
          user_id?: string
          zone_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "zone_plantmaterial_plantmaterial_id_fkey"
            columns: ["plantmaterial_id"]
            isOneToOne: false
            referencedRelation: "plantmaterial"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "zone_plantmaterial_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      zones: {
        Row: {
          area_size_unit: string | null
          area_size_value: number | null
          client_id: string
          created_at: string
          id: string
          last_watered_at: string | null
          name: string
          notes: string | null
          plant_count: number | null
          size: string | null
          soil_type: string | null
          soil_type_enum: string | null
          soil_type_other: string | null
          sun_hours_estimate: number | null
          sun_modifiers: string[] | null
          sun_notes: string | null
          sun_primary: string | null
          sunlight: string | null
          updated_at: string
          user_id: string
          watering_schedule: string | null
        }
        Insert: {
          area_size_unit?: string | null
          area_size_value?: number | null
          client_id: string
          created_at?: string
          id?: string
          last_watered_at?: string | null
          name: string
          notes?: string | null
          plant_count?: number | null
          size?: string | null
          soil_type?: string | null
          soil_type_enum?: string | null
          soil_type_other?: string | null
          sun_hours_estimate?: number | null
          sun_modifiers?: string[] | null
          sun_notes?: string | null
          sun_primary?: string | null
          sunlight?: string | null
          updated_at?: string
          user_id: string
          watering_schedule?: string | null
        }
        Update: {
          area_size_unit?: string | null
          area_size_value?: number | null
          client_id?: string
          created_at?: string
          id?: string
          last_watered_at?: string | null
          name?: string
          notes?: string | null
          plant_count?: number | null
          size?: string | null
          soil_type?: string | null
          soil_type_enum?: string | null
          soil_type_other?: string | null
          sun_hours_estimate?: number | null
          sun_modifiers?: string[] | null
          sun_notes?: string | null
          sun_primary?: string | null
          sunlight?: string | null
          updated_at?: string
          user_id?: string
          watering_schedule?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "zones_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
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

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
