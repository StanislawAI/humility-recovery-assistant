export interface Database {
  public: {
    Tables: {
      entries: {
        Row: {
          id: string
          user_id: string
          content: string
          entry_type: 'text' | 'voice' | 'quick-check'
          created_at: string
          sentiment_score: number | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          entry_type: 'text' | 'voice' | 'quick-check'
          created_at?: string
          sentiment_score?: number | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          entry_type?: 'text' | 'voice' | 'quick-check'
          created_at?: string
          sentiment_score?: number | null
          updated_at?: string
        }
      }
      daily_summaries: {
        Row: {
          id: string
          user_id: string
          date: string
          summary: string
          key_insights: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          summary: string
          key_insights?: Record<string, unknown> | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          summary?: string
          key_insights?: Record<string, unknown> | null
          created_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          user_id: string
          week_start: string
          trends: Record<string, unknown> | null
          growth_score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          week_start: string
          trends?: Record<string, unknown> | null
          growth_score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          week_start?: string
          trends?: Record<string, unknown> | null
          growth_score?: number | null
          created_at?: string
        }
      }
    }
  }
}

export type Entry = Database['public']['Tables']['entries']['Row']
export type DailySummary = Database['public']['Tables']['daily_summaries']['Row']
export type Analytics = Database['public']['Tables']['analytics']['Row']

