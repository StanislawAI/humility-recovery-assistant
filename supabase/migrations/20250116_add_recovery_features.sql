-- Add missing tables for Recovery.md features

-- Service & Accountability Roster
CREATE TABLE IF NOT EXISTS service_roster (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_type TEXT NOT NULL CHECK (role_type IN ('sponsor', 'sponsee', 'accountability_partner', 'meeting_role', 'service_commitment')),
    name TEXT NOT NULL,
    contact TEXT,
    notes TEXT,
    schedule TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly Reviews
CREATE TABLE IF NOT EXISTS weekly_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    triggers_learned TEXT,
    grace_moments TEXT,
    commitments_slipped TEXT,
    outreach_needed TEXT,
    single_focus TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, week_start)
);

-- Monthly Reviews
CREATE TABLE IF NOT EXISTS monthly_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    month_start DATE NOT NULL,
    spiritual_growth TEXT,
    recovery_progress TEXT,
    body_trends TEXT,
    relationships TEXT,
    projects_shipped TEXT,
    to_subtract TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, month_start)
);

-- Triggers & Countermeasures
CREATE TABLE IF NOT EXISTS triggers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    trigger_name TEXT NOT NULL,
    trigger_type TEXT,
    countermeasure TEXT NOT NULL,
    effectiveness_score INTEGER CHECK (effectiveness_score BETWEEN 1 AND 10),
    times_used INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gratitude Entries
CREATE TABLE IF NOT EXISTS gratitude_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    category TEXT CHECK (category IN ('person', 'situation', 'challenge', 'general')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Replacement Activities
CREATE TABLE IF NOT EXISTS replacement_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    duration_category TEXT NOT NULL CHECK (duration_category IN ('5min', '15-30min', '60+min')),
    description TEXT,
    times_used INTEGER DEFAULT 0,
    last_used TIMESTAMP WITH TIME ZONE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scripture & Prayer References
CREATE TABLE IF NOT EXISTS scripture_prayers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    reference TEXT,
    content TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('scripture', 'prayer', 'meditation')),
    favorite BOOLEAN DEFAULT false,
    times_accessed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step Work Tracker
CREATE TABLE IF NOT EXISTS step_work (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    current_step INTEGER NOT NULL CHECK (current_step BETWEEN 1 AND 12),
    readings_completed JSONB DEFAULT '[]'::jsonb,
    actions_completed JSONB DEFAULT '[]'::jsonb,
    sponsor_feedback TEXT,
    notes TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- VIA Classification Tracking
CREATE TABLE IF NOT EXISTS via_classifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    purgative_score INTEGER CHECK (purgative_score BETWEEN 0 AND 10),
    illuminative_score INTEGER CHECK (illuminative_score BETWEEN 0 AND 10),
    unitive_score INTEGER CHECK (unitive_score BETWEEN 0 AND 10),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Relapse Risk Tracking
CREATE TABLE IF NOT EXISTS relapse_risk_assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    sleep_risk TEXT CHECK (sleep_risk IN ('low', 'medium', 'high')),
    stress_risk TEXT CHECK (stress_risk IN ('low', 'medium', 'high')),
    isolation_risk TEXT CHECK (isolation_risk IN ('low', 'medium', 'high')),
    halt_risk TEXT CHECK (halt_risk IN ('low', 'medium', 'high')),
    spirituality_risk TEXT CHECK (spirituality_risk IN ('low', 'medium', 'high')),
    service_risk TEXT CHECK (service_risk IN ('low', 'medium', 'high')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_service_roster_user_id ON service_roster(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_reviews_user_id ON weekly_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_reviews_week_start ON weekly_reviews(week_start DESC);
CREATE INDEX IF NOT EXISTS idx_monthly_reviews_user_id ON monthly_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_reviews_month_start ON monthly_reviews(month_start DESC);
CREATE INDEX IF NOT EXISTS idx_triggers_user_id ON triggers(user_id);
CREATE INDEX IF NOT EXISTS idx_gratitude_entries_user_id ON gratitude_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_gratitude_entries_created_at ON gratitude_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_replacement_activities_user_id ON replacement_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_scripture_prayers_user_id ON scripture_prayers(user_id);
CREATE INDEX IF NOT EXISTS idx_step_work_user_id ON step_work(user_id);
CREATE INDEX IF NOT EXISTS idx_via_classifications_user_id ON via_classifications(user_id);
CREATE INDEX IF NOT EXISTS idx_relapse_risk_assessments_user_id ON relapse_risk_assessments(user_id);

-- Enable Row Level Security
ALTER TABLE service_roster ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gratitude_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE replacement_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripture_prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE step_work ENABLE ROW LEVEL SECURITY;
ALTER TABLE via_classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE relapse_risk_assessments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for service_roster
CREATE POLICY "Users can view their own service roster" ON service_roster FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own service roster" ON service_roster FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own service roster" ON service_roster FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own service roster" ON service_roster FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for weekly_reviews
CREATE POLICY "Users can view their own weekly reviews" ON weekly_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own weekly reviews" ON weekly_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own weekly reviews" ON weekly_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own weekly reviews" ON weekly_reviews FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for monthly_reviews
CREATE POLICY "Users can view their own monthly reviews" ON monthly_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own monthly reviews" ON monthly_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own monthly reviews" ON monthly_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own monthly reviews" ON monthly_reviews FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for triggers
CREATE POLICY "Users can view their own triggers" ON triggers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own triggers" ON triggers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own triggers" ON triggers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own triggers" ON triggers FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for gratitude_entries
CREATE POLICY "Users can view their own gratitude entries" ON gratitude_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own gratitude entries" ON gratitude_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own gratitude entries" ON gratitude_entries FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for replacement_activities
CREATE POLICY "Users can view their own replacement activities" ON replacement_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own replacement activities" ON replacement_activities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own replacement activities" ON replacement_activities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own replacement activities" ON replacement_activities FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for scripture_prayers
CREATE POLICY "Users can view their own scripture prayers" ON scripture_prayers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own scripture prayers" ON scripture_prayers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own scripture prayers" ON scripture_prayers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own scripture prayers" ON scripture_prayers FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for step_work
CREATE POLICY "Users can view their own step work" ON step_work FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own step work" ON step_work FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own step work" ON step_work FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own step work" ON step_work FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for via_classifications
CREATE POLICY "Users can view their own via classifications" ON via_classifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own via classifications" ON via_classifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own via classifications" ON via_classifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own via classifications" ON via_classifications FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for relapse_risk_assessments
CREATE POLICY "Users can view their own relapse risk assessments" ON relapse_risk_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own relapse risk assessments" ON relapse_risk_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own relapse risk assessments" ON relapse_risk_assessments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own relapse risk assessments" ON relapse_risk_assessments FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp (reuse existing function)
CREATE TRIGGER update_service_roster_updated_at 
    BEFORE UPDATE ON service_roster 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_reviews_updated_at 
    BEFORE UPDATE ON weekly_reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monthly_reviews_updated_at 
    BEFORE UPDATE ON monthly_reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_triggers_updated_at 
    BEFORE UPDATE ON triggers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_replacement_activities_updated_at 
    BEFORE UPDATE ON replacement_activities 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_step_work_updated_at 
    BEFORE UPDATE ON step_work 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
