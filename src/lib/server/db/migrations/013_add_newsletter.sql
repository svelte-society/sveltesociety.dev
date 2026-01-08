-- Newsletter campaigns table
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    intro_text TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'scheduled', 'sent')),
    items TEXT DEFAULT '[]',
    plunk_campaign_id TEXT,
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Pending subscriptions for double opt-in
CREATE TABLE IF NOT EXISTS newsletter_pending_subscriptions (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    email TEXT NOT NULL UNIQUE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status ON newsletter_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_created_by ON newsletter_campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_newsletter_pending_token ON newsletter_pending_subscriptions(token);
CREATE INDEX IF NOT EXISTS idx_newsletter_pending_email ON newsletter_pending_subscriptions(email);

-- Trigger to update updated_at
CREATE TRIGGER IF NOT EXISTS update_newsletter_campaign_timestamp
AFTER UPDATE ON newsletter_campaigns
BEGIN
    UPDATE newsletter_campaigns SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
