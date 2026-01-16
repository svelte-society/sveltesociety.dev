-- Add campaign types to newsletter system
-- Types: content_highlights (default), announcement, jobs_roundup
-- Moves items and intro_text into type_data JSON column

-- Drop existing trigger
DROP TRIGGER IF EXISTS update_newsletter_campaign_timestamp;

-- Create new table with updated schema
CREATE TABLE new_newsletter_campaigns (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    campaign_type TEXT NOT NULL DEFAULT 'content_highlights'
        CHECK(campaign_type IN ('content_highlights', 'announcement', 'jobs_roundup')),
    type_data TEXT DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'scheduled', 'sent')),
    plunk_campaign_id TEXT,
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Migrate existing data, moving items and intro_text into type_data
INSERT INTO new_newsletter_campaigns (
    id, title, subject, campaign_type, type_data, status,
    plunk_campaign_id, scheduled_at, sent_at, created_by, created_at, updated_at
)
SELECT
    id, title, subject, 'content_highlights',
    json_object('items', json(COALESCE(items, '[]')), 'intro_text', intro_text),
    status, plunk_campaign_id, scheduled_at, sent_at, created_by, created_at, updated_at
FROM newsletter_campaigns;

-- Drop old table
DROP TABLE newsletter_campaigns;

-- Rename new table
ALTER TABLE new_newsletter_campaigns RENAME TO newsletter_campaigns;

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status ON newsletter_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_created_by ON newsletter_campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_type ON newsletter_campaigns(campaign_type);

-- Recreate trigger
CREATE TRIGGER IF NOT EXISTS update_newsletter_campaign_timestamp
AFTER UPDATE ON newsletter_campaigns
BEGIN
    UPDATE newsletter_campaigns SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
