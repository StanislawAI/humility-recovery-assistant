-- Create via_classifications table
CREATE TABLE IF NOT EXISTS via_classifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  -- Purgative Way (Goodness acting with Faith)
  purgative_connection NUMERIC(3,1) CHECK (purgative_connection >= 0 AND purgative_connection <= 10),
  purgative_service NUMERIC(3,1) CHECK (purgative_service >= 0 AND purgative_service <= 10),
  purgative_prayer NUMERIC(3,1) CHECK (purgative_prayer >= 0 AND purgative_prayer <= 10),
  purgative_body NUMERIC(3,1) CHECK (purgative_body >= 0 AND purgative_body <= 10),
  purgative_mind NUMERIC(3,1) CHECK (purgative_mind >= 0 AND purgative_mind <= 10),
  
  -- Illuminative Way (Truth thinking with Hope)
  illuminative_self_knowledge NUMERIC(3,1) CHECK (illuminative_self_knowledge >= 0 AND illuminative_self_knowledge <= 10),
  illuminative_vigilance NUMERIC(3,1) CHECK (illuminative_vigilance >= 0 AND illuminative_vigilance <= 10),
  illuminative_discipline NUMERIC(3,1) CHECK (illuminative_discipline >= 0 AND illuminative_discipline <= 10),
  illuminative_reframe NUMERIC(3,1) CHECK (illuminative_reframe >= 0 AND illuminative_reframe <= 10),
  
  -- Unitive Way (Beauty seeing with Love)
  unitive_litmus_love NUMERIC(3,1) CHECK (unitive_litmus_love >= 0 AND unitive_litmus_love <= 10),
  unitive_obsession_alchemy NUMERIC(3,1) CHECK (unitive_obsession_alchemy >= 0 AND unitive_obsession_alchemy <= 10),
  unitive_courage NUMERIC(3,1) CHECK (unitive_courage >= 0 AND unitive_courage <= 10),
  
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE via_classifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own VIA classifications"
  ON via_classifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own VIA classifications"
  ON via_classifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own VIA classifications"
  ON via_classifications
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own VIA classifications"
  ON via_classifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_via_classifications_user_date ON via_classifications(user_id, date DESC);
