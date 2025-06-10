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
      event_registrations: {
        Row: {
          created_at: string
          event_id: string
          id: string
          member_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          member_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          member_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          id: string
          image: string | null
          location: string
          name: string
          time: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          image?: string | null
          location: string
          name: string
          time: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          image?: string | null
          location?: string
          name?: string
          time?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      gallery: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string
          is_featured: boolean | null
          title: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          is_featured?: boolean | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          is_featured?: boolean | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          customer_email: string | null
          customer_name: string | null
          description: string | null
          id: string
          status: string
          stripe_session_id: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          description?: string | null
          id?: string
          status?: string
          stripe_session_id?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          description?: string | null
          id?: string
          status?: string
          stripe_session_id?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          duration: string | null
          id: string
          name: string
          price: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          name: string
          price?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          name?: string
          price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tickets: {
        Row: {
          booking_date: string
          created_at: string
          customer_email: string
          customer_name: string
          id: string
          payment_id: string | null
          qr_code: string
          service_date: string | null
          service_id: string
          status: string
          ticket_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_date?: string
          created_at?: string
          customer_email: string
          customer_name: string
          id?: string
          payment_id?: string | null
          qr_code: string
          service_date?: string | null
          service_id: string
          status?: string
          ticket_number: string
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_date?: string
          created_at?: string
          customer_email?: string
          customer_name?: string
          id?: string
          payment_id?: string | null
          qr_code?: string
          service_date?: string | null
          service_id?: string
          status?: string
          ticket_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      user_api_keys: {
        Row: {
          api_key: string
          user_id: string
        }
        Insert: {
          api_key: string
          user_id: string
        }
        Update: {
          api_key?: string
          user_id?: string
        }
        Relationships: []
      }
      user_onboarding: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string
          current_step: number | null
          id: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          current_step?: number | null
          id?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          current_step?: number | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          compact_mode: boolean | null
          created_at: string | null
          data_collection: boolean | null
          id: string
          notifications_enabled: boolean | null
          updated_at: string | null
          user_id: string
          voice_interaction: boolean | null
        }
        Insert: {
          compact_mode?: boolean | null
          created_at?: string | null
          data_collection?: boolean | null
          id?: string
          notifications_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
          voice_interaction?: boolean | null
        }
        Update: {
          compact_mode?: boolean | null
          created_at?: string | null
          data_collection?: boolean | null
          id?: string
          notifications_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
          voice_interaction?: boolean | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          location: string | null
          phone: string | null
          updated_at: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_ticket_number: {
        Args: Record<PropertyKey, never>
        Returns: string
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
