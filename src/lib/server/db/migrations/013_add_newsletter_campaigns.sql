-- Newsletter campaigns table for storing campaign drafts
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    intro_text TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'scheduled', 'sent')),
    plunk_campaign_id TEXT,
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Newsletter campaign items table for storing content selections
CREATE TABLE IF NOT EXISTS newsletter_campaign_items (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    campaign_id TEXT NOT NULL,
    content_id TEXT NOT NULL,
    custom_description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES newsletter_campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status ON newsletter_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_created_by ON newsletter_campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaign_items_campaign_id ON newsletter_campaign_items(campaign_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaign_items_content_id ON newsletter_campaign_items(content_id);

-- Trigger to update updated_at on newsletter_campaigns
CREATE TRIGGER IF NOT EXISTS update_newsletter_campaign_timestamp
AFTER UPDATE ON newsletter_campaigns
BEGIN
    UPDATE newsletter_campaigns
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;
