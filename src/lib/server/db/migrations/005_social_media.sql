-- Social Media Publishing System
-- Adds tables for managing social media accounts, posts, and templates

-- Social media accounts table
CREATE TABLE IF NOT EXISTS social_accounts (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    platform TEXT NOT NULL CHECK(platform IN ('bluesky', 'nostr', 'linkedin')),
    account_name TEXT NOT NULL,
    account_handle TEXT NOT NULL,
    credentials TEXT NOT NULL, -- Encrypted JSON (OAuth tokens or Nostr nsec)
    relay_urls TEXT, -- Nostr-specific: JSON array of relay URLs
    is_active BOOLEAN DEFAULT 1,
    is_default BOOLEAN DEFAULT 0, -- Default account for this platform
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Social media posts table
CREATE TABLE IF NOT EXISTS social_posts (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    content_id TEXT NOT NULL,
    account_id TEXT NOT NULL,
    platform TEXT NOT NULL CHECK(platform IN ('bluesky', 'nostr', 'linkedin')),
    post_text TEXT NOT NULL,
    post_data TEXT, -- JSON: images, links, metadata
    external_post_id TEXT, -- Platform's post ID (or Nostr event ID)
    external_url TEXT, -- Link to post on platform
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'scheduled', 'posted', 'failed', 'skipped')),
    scheduled_at TIMESTAMP, -- When to post (NULL = not scheduled)
    posted_at TIMESTAMP, -- When actually posted
    error_message TEXT, -- Error details if failed
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES social_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Post templates table
CREATE TABLE IF NOT EXISTS social_templates (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    content_type TEXT NOT NULL CHECK(content_type IN ('video', 'library', 'recipe', 'announcement', 'collection', 'event')),
    platform TEXT NOT NULL CHECK(platform IN ('bluesky', 'nostr', 'linkedin')),
    template TEXT NOT NULL,
    is_default BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(content_type, platform, is_default) -- Only one default template per content type + platform
);

-- Indexes for efficient queries
CREATE INDEX idx_social_accounts_platform ON social_accounts(platform, is_active);
CREATE INDEX idx_social_accounts_default ON social_accounts(platform, is_default) WHERE is_default = 1;

CREATE INDEX idx_social_posts_scheduled ON social_posts(scheduled_at, status) WHERE status = 'scheduled';
CREATE INDEX idx_social_posts_status ON social_posts(status);
CREATE INDEX idx_social_posts_content ON social_posts(content_id);
CREATE INDEX idx_social_posts_account ON social_posts(account_id);
CREATE INDEX idx_social_posts_platform ON social_posts(platform, status);

CREATE INDEX idx_social_templates_lookup ON social_templates(content_type, platform, is_default);

-- Triggers to update updated_at timestamp
CREATE TRIGGER update_social_accounts_timestamp
AFTER UPDATE ON social_accounts
BEGIN
    UPDATE social_accounts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_social_posts_timestamp
AFTER UPDATE ON social_posts
BEGIN
    UPDATE social_posts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_social_templates_timestamp
AFTER UPDATE ON social_templates
BEGIN
    UPDATE social_templates SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
