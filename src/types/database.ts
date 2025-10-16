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
            user_settings: {
                Row: {
                    user_id: string
                    emergency_contacts: Array<{ name: string; phone: string }>
                    preferences: Record<string, unknown>
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    user_id: string
                    emergency_contacts?: Array<{ name: string; phone: string }>
                    preferences?: Record<string, unknown>
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    user_id?: string
                    emergency_contacts?: Array<{ name: string; phone: string }>
                    preferences?: Record<string, unknown>
                    created_at?: string
                    updated_at?: string
                }
            }
            daily_checklists: {
                Row: {
                    id: string
                    user_id: string
                    date: string
                    status: Record<string, boolean>
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    date: string
                    status?: Record<string, boolean>
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    date?: string
                    status?: Record<string, boolean>
                    created_at?: string
                    updated_at?: string
                }
            }
            urge_logs: {
                Row: {
                    id: string
                    user_id: string
                    created_at: string
                    trigger: string | null
                    intensity: number | null
                    tools_used: string[] | null
                    result: string | null
                    lesson: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    created_at?: string
                    trigger?: string | null
                    intensity?: number | null
                    tools_used?: string[] | null
                    result?: string | null
                    lesson?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    created_at?: string
                    trigger?: string | null
                    intensity?: number | null
                    tools_used?: string[] | null
                    result?: string | null
                    lesson?: string | null
                }
            }
            if_then_plans: {
                Row: {
                    id: string
                    user_id: string
                    trigger: string
                    action: string
                    active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    trigger: string
                    action: string
                    active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    trigger?: string
                    action?: string
                    active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            daily_metrics: {
                Row: {
                    id: string
                    user_id: string
                    date: string
                    conn: number | null
                    pray: number | null
                    move: number | null
                    mind: number | null
                    service: number | null
                    sleep: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    date: string
                    conn?: number | null
                    pray?: number | null
                    move?: number | null
                    mind?: number | null
                    service?: number | null
                    sleep?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    date?: string
                    conn?: number | null
                    pray?: number | null
                    move?: number | null
                    mind?: number | null
                    service?: number | null
                    sleep?: number | null
                    created_at?: string
                    updated_at?: string
                }
            }
            exercises_sessions: {
                Row: {
                    id: string
                    user_id: string
                    type: string
                    notes: string | null
                    duration_sec: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    type: string
                    notes?: string | null
                    duration_sec?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    type?: string
                    notes?: string | null
                    duration_sec?: number | null
                    created_at?: string
                }
            }
            replacement_activities: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    duration_category: '5min' | '15-30min' | '60+min'
                    description: string | null
                    times_used: number
                    last_used: string | null
                    active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    duration_category: '5min' | '15-30min' | '60+min'
                    description?: string | null
                    times_used?: number
                    last_used?: string | null
                    active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    duration_category?: '5min' | '15-30min' | '60+min'
                    description?: string | null
                    times_used?: number
                    last_used?: string | null
                    active?: boolean
                    created_at?: string
                }
            }
            relapse_risk_assessments: {
                Row: {
                    id: string
                    user_id: string
                    date: string
                    sleep_risk: 'low' | 'medium' | 'high' | null
                    stress_risk: 'low' | 'medium' | 'high' | null
                    isolation_risk: 'low' | 'medium' | 'high' | null
                    halt_risk: 'low' | 'medium' | 'high' | null
                    spirituality_risk: 'low' | 'medium' | 'high' | null
                    service_risk: 'low' | 'medium' | 'high' | null
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    date: string
                    sleep_risk?: 'low' | 'medium' | 'high' | null
                    stress_risk?: 'low' | 'medium' | 'high' | null
                    isolation_risk?: 'low' | 'medium' | 'high' | null
                    halt_risk?: 'low' | 'medium' | 'high' | null
                    spirituality_risk?: 'low' | 'medium' | 'high' | null
                    service_risk?: 'low' | 'medium' | 'high' | null
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    date?: string
                    sleep_risk?: 'low' | 'medium' | 'high' | null
                    stress_risk?: 'low' | 'medium' | 'high' | null
                    isolation_risk?: 'low' | 'medium' | 'high' | null
                    halt_risk?: 'low' | 'medium' | 'high' | null
                    spirituality_risk?: 'low' | 'medium' | 'high' | null
                    service_risk?: 'low' | 'medium' | 'high' | null
                    notes?: string | null
                    created_at?: string
                }
            }
            via_classifications: {
                Row: {
                    id: string
                    user_id: string
                    date: string
                    purgative_connection: number | null
                    purgative_service: number | null
                    purgative_prayer: number | null
                    purgative_body: number | null
                    purgative_mind: number | null
                    illuminative_self_knowledge: number | null
                    illuminative_vigilance: number | null
                    illuminative_discipline: number | null
                    illuminative_reframe: number | null
                    unitive_litmus_love: number | null
                    unitive_obsession_alchemy: number | null
                    unitive_courage: number | null
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    date: string
                    purgative_connection?: number | null
                    purgative_service?: number | null
                    purgative_prayer?: number | null
                    purgative_body?: number | null
                    purgative_mind?: number | null
                    illuminative_self_knowledge?: number | null
                    illuminative_vigilance?: number | null
                    illuminative_discipline?: number | null
                    illuminative_reframe?: number | null
                    unitive_litmus_love?: number | null
                    unitive_obsession_alchemy?: number | null
                    unitive_courage?: number | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    date?: string
                    purgative_connection?: number | null
                    purgative_service?: number | null
                    purgative_prayer?: number | null
                    purgative_body?: number | null
                    purgative_mind?: number | null
                    illuminative_self_knowledge?: number | null
                    illuminative_vigilance?: number | null
                    illuminative_discipline?: number | null
                    illuminative_reframe?: number | null
                    unitive_litmus_love?: number | null
                    unitive_obsession_alchemy?: number | null
                    unitive_courage?: number | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            weekly_reviews: {
                Row: {
                    id: string
                    user_id: string
                    week_start: string
                    triggers_learned: string | null
                    grace_moments: string | null
                    commitments_slipped: string | null
                    outreach_needed: string | null
                    single_focus: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    week_start: string
                    triggers_learned?: string | null
                    grace_moments?: string | null
                    commitments_slipped?: string | null
                    outreach_needed?: string | null
                    single_focus?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    week_start?: string
                    triggers_learned?: string | null
                    grace_moments?: string | null
                    commitments_slipped?: string | null
                    outreach_needed?: string | null
                    single_focus?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            gratitude_entries: {
                Row: {
                    id: string
                    user_id: string
                    content: string
                    category: 'person' | 'situation' | 'challenge' | 'general'
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    content: string
                    category: 'person' | 'situation' | 'challenge' | 'general'
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    content?: string
                    category?: 'person' | 'situation' | 'challenge' | 'general'
                    created_at?: string
                }
            }
        }
    }
}

export type Entry = Database['public']['Tables']['entries']['Row']
export type DailySummary = Database['public']['Tables']['daily_summaries']['Row']
export type Analytics = Database['public']['Tables']['analytics']['Row']
export type UserSettings = Database['public']['Tables']['user_settings']['Row']
export type DailyChecklist = Database['public']['Tables']['daily_checklists']['Row']
export type UrgeLog = Database['public']['Tables']['urge_logs']['Row']
export type IfThenPlan = Database['public']['Tables']['if_then_plans']['Row']
export type DailyMetrics = Database['public']['Tables']['daily_metrics']['Row']
export type ExerciseSession = Database['public']['Tables']['exercises_sessions']['Row']
export type ReplacementActivity = Database['public']['Tables']['replacement_activities']['Row']
export type RelapseRiskAssessment = Database['public']['Tables']['relapse_risk_assessments']['Row']
export type ViaClassification = Database['public']['Tables']['via_classifications']['Row']
export type WeeklyReview = Database['public']['Tables']['weekly_reviews']['Row']
export type MonthlyReview = Database["public"]["Tables"]["monthly_reviews"]["Row"]
export type GratitudeEntry = Database['public']['Tables']['gratitude_entries']['Row']

