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
      availability: {
        Row: {
          created_at: string | null
          date: string | null
          employee_id: string | null
          id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          employee_id?: string | null
          id?: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          employee_id?: string | null
          id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "availability_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          client_id: string | null
          date: string | null
          duration_minutes: number | null
          employee_id: string | null
          id: string
          price: number | null
        }
        Insert: {
          client_id?: string | null
          date?: string | null
          duration_minutes?: number | null
          employee_id?: string | null
          id?: string
          price?: number | null
        }
        Update: {
          client_id?: string | null
          date?: string | null
          duration_minutes?: number | null
          employee_id?: string | null
          id?: string
          price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_entries: {
        Row: {
          date: string | null
          employee_id: string | null
          id: string
          note: string | null
          status: string | null
        }
        Insert: {
          date?: string | null
          employee_id?: string | null
          id?: string
          note?: string | null
          status?: string | null
        }
        Update: {
          date?: string | null
          employee_id?: string | null
          id?: string
          note?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          assigned_to: string | null
          created_by: string | null
          email: string | null
          id: string
          name: string
        }
        Insert: {
          assigned_to?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name: string
        }
        Update: {
          assigned_to?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          assigned_employee_id: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          assigned_employee_id?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          assigned_employee_id?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_assigned_employee_id_fkey"
            columns: ["assigned_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          auth_id: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          role: string
        }
        Insert: {
          auth_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          role?: string
        }
        Update: {
          auth_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
        }
        Relationships: []
      }
      journals: {
        Row: {
          author_id: string | null
          client_id: string | null
          content: string | null
          created_at: string | null
          created_by: string | null
          id: string
        }
        Insert: {
          author_id?: string | null
          client_id?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
        }
        Update: {
          author_id?: string | null
          client_id?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journals_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          email: string
          full_name: string | null
          hourly_rate: number | null
          id: string
          name: string | null
          role: string | null
        }
        Insert: {
          email: string
          full_name?: string | null
          hourly_rate?: number | null
          id: string
          name?: string | null
          role?: string | null
        }
        Update: {
          email?: string
          full_name?: string | null
          hourly_rate?: number | null
          id?: string
          name?: string | null
          role?: string | null
        }
        Relationships: []
      }
      salaries: {
        Row: {
          calculated_at: string | null
          calculated_salary: number | null
          employee_id: string | null
          from_date: string | null
          hourly_rate: number | null
          id: string
          to_date: string | null
        }
        Insert: {
          calculated_at?: string | null
          calculated_salary?: number | null
          employee_id?: string | null
          from_date?: string | null
          hourly_rate?: number | null
          id?: string
          to_date?: string | null
        }
        Update: {
          calculated_at?: string | null
          calculated_salary?: number | null
          employee_id?: string | null
          from_date?: string | null
          hourly_rate?: number | null
          id?: string
          to_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "salaries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wages: {
        Row: {
          employee_id: string | null
          generated_at: string | null
          hourly_rate: number | null
          hours_worked: number | null
          id: string
          month: string | null
          total_salary: number | null
        }
        Insert: {
          employee_id?: string | null
          generated_at?: string | null
          hourly_rate?: number | null
          hours_worked?: number | null
          id?: string
          month?: string | null
          total_salary?: number | null
        }
        Update: {
          employee_id?: string | null
          generated_at?: string | null
          hourly_rate?: number | null
          hours_worked?: number | null
          id?: string
          month?: string | null
          total_salary?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wages_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      earnings_view: {
        Row: {
          booking_id: string | null
          calculated_earning: number | null
          date: string | null
          duration_minutes: number | null
          employee_email: string | null
          employee_id: string | null
          hourly_rate: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
