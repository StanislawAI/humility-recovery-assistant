-- Add guide_section_hashes column to track per-section hashes of the recovery guide
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS guide_section_hashes JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Index for jsonb ops if needed later
CREATE INDEX IF NOT EXISTS idx_conversations_guide_section_hashes ON conversations USING GIN (guide_section_hashes);
