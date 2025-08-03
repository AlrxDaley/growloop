import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      sproutly_conversations: {
        Row: {
          id: string
          user_id: string
          message: string
          response: string
          context: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          response: string
          context?: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          response?: string
          context?: any
          created_at?: string
        }
      }
      user_garden_context: {
        Row: {
          id: string
          user_id: string
          plant_types: string[]
          gardening_style: string
          region: string
          preferences: any
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plant_types?: string[]
          gardening_style?: string
          region?: string
          preferences?: any
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plant_types?: string[]
          gardening_style?: string
          region?: string
          preferences?: any
          updated_at?: string
        }
      }
    }
  }
}