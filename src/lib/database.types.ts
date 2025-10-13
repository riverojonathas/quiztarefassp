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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      leaderboard: {
        Row: {
          created_at: string | null
          id: string
          scope: string
          scope_id: string
          score: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          scope: string
          scope_id: string
          score: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          scope?: string
          scope_id?: string
          score?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          ended_at: string | null
          id: string
          players: Json
          room_id: string
          scores: Json
          started_at: string | null
          status: string
        }
        Insert: {
          ended_at?: string | null
          id?: string
          players: Json
          room_id: string
          scores: Json
          started_at?: string | null
          status: string
        }
        Update: {
          ended_at?: string | null
          id?: string
          players?: Json
          room_id?: string
          scores?: Json
          started_at?: string | null
          status?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          choices: Json
          created_at: string | null
          difficulty: number
          id: string
          image_url: string | null
          skill: string | null
          statement: string
          tags: Json
          time_suggested_sec: number | null
        }
        Insert: {
          choices: Json
          created_at?: string | null
          difficulty: number
          id?: string
          image_url?: string | null
          skill?: string | null
          statement: string
          tags: Json
          time_suggested_sec?: number | null
        }
        Update: {
          choices?: Json
          created_at?: string | null
          difficulty?: number
          id?: string
          image_url?: string | null
          skill?: string | null
          statement?: string
          tags?: Json
          time_suggested_sec?: number | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_seed: string | null
          avatar_url: string | null
          created_at: string | null
          diretoria_ensino: string | null
          escola: string | null
          id: string
          language: string | null
          nickname: string | null
          nivel_escolar: string | null
          notifications: Json | null
          onboarding_completed: boolean | null
          serie: string | null
          theme: string | null
          turma: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_seed?: string | null
          avatar_url?: string | null
          created_at?: string | null
          diretoria_ensino?: string | null
          escola?: string | null
          id?: string
          language?: string | null
          nickname?: string | null
          nivel_escolar?: string | null
          notifications?: Json | null
          onboarding_completed?: boolean | null
          serie?: string | null
          theme?: string | null
          turma?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_seed?: string | null
          avatar_url?: string | null
          created_at?: string | null
          diretoria_ensino?: string | null
          escola?: string | null
          id?: string
          language?: string | null
          nickname?: string | null
          nivel_escolar?: string | null
          notifications?: Json | null
          onboarding_completed?: boolean | null
          serie?: string | null
          theme?: string | null
          turma?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          username: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          username?: string
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
