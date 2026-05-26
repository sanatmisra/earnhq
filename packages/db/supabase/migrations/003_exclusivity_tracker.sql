-- Migration: Exclusivity Window Tracker
-- Adds exclusivity clause tracking fields to the deals table.

ALTER TABLE deals
  ADD COLUMN IF NOT EXISTS exclusivity_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS exclusivity_category TEXT,
  ADD COLUMN IF NOT EXISTS exclusivity_ends_at DATE;

-- Index for efficient querying of active exclusivity windows
CREATE INDEX IF NOT EXISTS idx_deals_exclusivity_ends_at
  ON deals(user_id, exclusivity_ends_at)
  WHERE exclusivity_enabled = TRUE AND exclusivity_ends_at IS NOT NULL;

COMMENT ON COLUMN deals.exclusivity_enabled IS
  'Whether this deal includes an exclusivity clause';
COMMENT ON COLUMN deals.exclusivity_category IS
  'Category covered by the exclusivity clause, e.g. "fitness brands", "productivity apps"';
COMMENT ON COLUMN deals.exclusivity_ends_at IS
  'Date the exclusivity window expires';
