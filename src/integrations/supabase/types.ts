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
      chat_messages: {
        Row: {
          created_at: string | null
          customer_name: string | null
          id: string
          is_customer: boolean
          message: string
          session_id: string
        }
        Insert: {
          created_at?: string | null
          customer_name?: string | null
          id?: string
          is_customer?: boolean
          message: string
          session_id: string
        }
        Update: {
          created_at?: string | null
          customer_name?: string | null
          id?: string
          is_customer?: boolean
          message?: string
          session_id?: string
        }
        Relationships: []
      }
      chat_sessions: {
        Row: {
          created_at: string | null
          customer_name: string | null
          id: string
          is_active: boolean | null
          session_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_name?: string | null
          id?: string
          is_active?: boolean | null
          session_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_name?: string | null
          id?: string
          is_active?: boolean | null
          session_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      delivery_rates: {
        Row: {
          created_at: string | null
          home_price: number
          id: string
          is_active: boolean | null
          office_price: number | null
          updated_at: string | null
          wilaya: string
        }
        Insert: {
          created_at?: string | null
          home_price: number
          id?: string
          is_active?: boolean | null
          office_price?: number | null
          updated_at?: string | null
          wilaya: string
        }
        Update: {
          created_at?: string | null
          home_price?: number
          id?: string
          is_active?: boolean | null
          office_price?: number | null
          updated_at?: string | null
          wilaya?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string | null
          customer_info: Json
          delivery_fee: number
          id: string
          items: Json
          order_number: string
          sent_to_zr_express: boolean | null
          status: string
          total_amount: number
          total_products: number
          zr_express_response: Json | null
        }
        Insert: {
          created_at?: string | null
          customer_info: Json
          delivery_fee: number
          id?: string
          items: Json
          order_number: string
          sent_to_zr_express?: boolean | null
          status?: string
          total_amount: number
          total_products: number
          zr_express_response?: Json | null
        }
        Update: {
          created_at?: string | null
          customer_info?: Json
          delivery_fee?: number
          id?: string
          items?: Json
          order_number?: string
          sent_to_zr_express?: boolean | null
          status?: string
          total_amount?: number
          total_products?: number
          zr_express_response?: Json | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          deleted_at: string | null
          id: string
          image: string | null
          is_out_of_stock: boolean | null
          low_stock_threshold: number | null
          original_price: string | null
          price: string
          stock_quantity: number | null
          title: string
        }
        Insert: {
          category: string
          deleted_at?: string | null
          id?: string
          image?: string | null
          is_out_of_stock?: boolean | null
          low_stock_threshold?: number | null
          original_price?: string | null
          price: string
          stock_quantity?: number | null
          title: string
        }
        Update: {
          category?: string
          deleted_at?: string | null
          id?: string
          image?: string | null
          is_out_of_stock?: boolean | null
          low_stock_threshold?: number | null
          original_price?: string | null
          price?: string
          stock_quantity?: number | null
          title?: string
        }
        Relationships: []
      }
      promotions: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          discount_percentage: number
          end_date: string
          id: string
          is_active: boolean | null
          start_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          discount_percentage: number
          end_date: string
          id?: string
          is_active?: boolean | null
          start_date: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number
          end_date?: string
          id?: string
          is_active?: boolean | null
          start_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_create_product:
        | {
            Args: {
              p_category: string
              p_image?: string
              p_original_price?: string
              p_price: string
              p_stock_quantity?: number
              p_title: string
            }
            Returns: string
          }
        | {
            Args: {
              p_admin_token: string
              p_category: string
              p_image?: string
              p_original_price?: string
              p_price: string
              p_stock_quantity?: number
              p_title: string
            }
            Returns: string
          }
      admin_delete_product:
        | { Args: { p_admin_token: string; p_id: string }; Returns: boolean }
        | { Args: { p_id: string }; Returns: boolean }
      admin_restore_product:
        | { Args: { p_admin_token: string; p_id: string }; Returns: boolean }
        | { Args: { p_id: string }; Returns: boolean }
      admin_update_product:
        | {
            Args: {
              p_admin_token: string
              p_category: string
              p_id: string
              p_image?: string
              p_original_price?: string
              p_price: string
              p_stock_quantity?: number
              p_title: string
            }
            Returns: boolean
          }
        | {
            Args: {
              p_category: string
              p_id: string
              p_image?: string
              p_original_price?: string
              p_price: string
              p_stock_quantity?: number
              p_title: string
            }
            Returns: boolean
          }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
