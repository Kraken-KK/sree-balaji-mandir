export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      files: {
        Row: {
          access_count: number | null
          account_id: string
          ai_score: number | null
          created_at: string
          google_file_id: string
          id: string
          last_modified: string
          last_opened: string | null
          mime_type: string
          name: string
          parent_id: string | null
          size: number
          thumbnail: string | null
          updated_at: string
          web_view_link: string | null
        }
        Insert: {
          access_count?: number | null
          account_id: string
          ai_score?: number | null
          created_at?: string
          google_file_id: string
          id?: string
          last_modified: string
          last_opened?: string | null
          mime_type: string
          name: string
          parent_id?: string | null
          size: number
          thumbnail?: string | null
          updated_at?: string
          web_view_link?: string | null
        }
        Update: {
          access_count?: number | null
          account_id?: string
          ai_score?: number | null
          created_at?: string
          google_file_id?: string
          id?: string
          last_modified?: string
          last_opened?: string | null
          mime_type?: string
          name?: string
          parent_id?: string | null
          size?: number
          thumbnail?: string | null
          updated_at?: string
          web_view_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "google_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      google_accounts: {
        Row: {
          access_token: string
          created_at: string
          email: string
          id: string
          is_primary: boolean
          name: string | null
          refresh_token: string
          token_expiry: string
          total_storage: number
          updated_at: string
          used_storage: number
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          email: string
          id?: string
          is_primary?: boolean
          name?: string | null
          refresh_token: string
          token_expiry: string
          total_storage?: number
          updated_at?: string
          used_storage?: number
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          email?: string
          id?: string
          is_primary?: boolean
          name?: string | null
          refresh_token?: string
          token_expiry?: string
          total_storage?: number
          updated_at?: string
          used_storage?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          ai_chat_time_limit: number | null
          compact_mode: boolean | null
          created_at: string | null
          data_collection: boolean | null
          notifications_enabled: boolean | null
          theme: string | null
          updated_at: string | null
          user_id: string
          voice_interaction: boolean | null
        }
        Insert: {
          ai_chat_time_limit?: number | null
          compact_mode?: boolean | null
          created_at?: string | null
          data_collection?: boolean | null
          notifications_enabled?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
          voice_interaction?: boolean | null
        }
        Update: {
          ai_chat_time_limit?: number | null
          compact_mode?: boolean | null
          created_at?: string | null
          data_collection?: boolean | null
          notifications_enabled?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
          voice_interaction?: boolean | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
