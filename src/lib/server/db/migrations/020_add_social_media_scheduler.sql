-- Migration: Add Social Media Scheduler Infrastructure
-- Creates tables for social posts, platforms, templates, auto-rules, queue settings, and credentials
-- Supports Twitter/X, Bluesky, and LinkedIn platforms

-- ============================================
-- PART 1: Social Posts (Main Posts Table)
-- ============================================

CREATE TABLE IF NOT EXISTS social_posts (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),

    -- Internal reference
    title TEXT NOT NULL,

    -- Post type and linked content
    post_type TEXT NOT NULL CHECK(post_type IN ('content', 'sponsor', 'job', 'custom')),
    content_id TEXT,                              -- FK to content table (for content posts)
    sponsor_id TEXT,                              -- FK to sponsors table (for sponsor posts)
    job_id TEXT,                                  -- FK to content table where type='job' (for job posts)

    -- Status workflow: draft -> scheduled -> published (or failed)
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'scheduled', 'published', 'failed')),

    -- Scheduling
    scheduled_at TIMESTAMP,
    published_at TIMESTAMP,

    -- Link and tracking
    link_url TEXT,                                -- The URL to share (auto-generated or custom)
    utm_source TEXT,                              -- UTM tracking source
    utm_medium TEXT DEFAULT 'social',             -- UTM tracking medium
    utm_campaign TEXT,                            -- UTM tracking campaign

    -- Media
    media_urls TEXT,                              -- JSON array of media URLs

    -- Metadata
    tags TEXT,                                    -- JSON array of tags for organization
    created_by TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE SET NULL,
    FOREIGN KEY (sponsor_id) REFERENCES sponsors(id) ON DELETE SET NULL,
    FOREIGN KEY (job_id) REFERENCES content(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_scheduled_at ON social_posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_social_posts_post_type ON social_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_social_posts_content_id ON social_posts(content_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_created_by ON social_posts(created_by);


-- ============================================
-- PART 2: Social Post Platforms (Per-Platform Text)
-- ============================================

CREATE TABLE IF NOT EXISTS social_post_platforms (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    post_id TEXT NOT NULL,

    -- Platform identifier
    platform TEXT NOT NULL CHECK(platform IN ('twitter', 'bluesky', 'linkedin')),

    -- Platform-specific content
    text TEXT NOT NULL,                           -- The post text for this platform
    media_urls TEXT,                              -- JSON array of media URLs (can override post-level)

    -- Publishing status
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'published', 'failed', 'skipped')),
    external_post_id TEXT,                        -- Platform's post ID after publishing
    error_message TEXT,                           -- Error message if publishing failed
    published_at TIMESTAMP,

    -- Retry tracking
    retry_count INTEGER NOT NULL DEFAULT 0,
    last_retry_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (post_id) REFERENCES social_posts(id) ON DELETE CASCADE,
    UNIQUE(post_id, platform)
);

CREATE INDEX IF NOT EXISTS idx_social_post_platforms_post_id ON social_post_platforms(post_id);
CREATE INDEX IF NOT EXISTS idx_social_post_platforms_platform ON social_post_platforms(platform);
CREATE INDEX IF NOT EXISTS idx_social_post_platforms_status ON social_post_platforms(status);


-- ============================================
-- PART 3: Social Templates
-- ============================================

CREATE TABLE IF NOT EXISTS social_templates (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),

    -- Template identification
    name TEXT NOT NULL UNIQUE,
    description TEXT,

    -- Content type this template is for
    content_type TEXT NOT NULL CHECK(content_type IN ('video', 'library', 'recipe', 'resource', 'job', 'sponsor', 'custom')),

    -- Platform-specific templates (with variables like {{title}}, {{author}}, {{tags}}, {{url}})
    twitter_template TEXT NOT NULL,
    bluesky_template TEXT NOT NULL,
    linkedin_template TEXT NOT NULL,

    -- Default flag
    is_default BOOLEAN NOT NULL DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_social_templates_content_type ON social_templates(content_type);
CREATE INDEX IF NOT EXISTS idx_social_templates_is_default ON social_templates(is_default);

-- Insert default templates
INSERT INTO social_templates (name, description, content_type, twitter_template, bluesky_template, linkedin_template, is_default) VALUES
    ('Default Video', 'Default template for video content', 'video',
     '🎬 {{title}}\n\nby {{author}}\n\n{{url}}\n\n#svelte #sveltekit',
     '🎬 {{title}}\n\nby {{author}}\n\n{{url}}',
     '🎬 New Video: {{title}}\n\nby {{author}}\n\n{{description}}\n\n{{url}}\n\n#Svelte #SvelteKit #WebDevelopment',
     1),
    ('Default Library', 'Default template for library content', 'library',
     '📦 {{title}}\n\n{{description}}\n\n{{url}}\n\n#svelte #opensource',
     '📦 {{title}}\n\n{{description}}\n\n{{url}}',
     '📦 New Library: {{title}}\n\n{{description}}\n\nCheck it out: {{url}}\n\n#Svelte #OpenSource #WebDev',
     1),
    ('Default Recipe', 'Default template for recipe content', 'recipe',
     '📝 {{title}}\n\n{{description}}\n\n{{url}}\n\n#svelte #tutorial',
     '📝 {{title}}\n\n{{description}}\n\n{{url}}',
     '📝 New Recipe: {{title}}\n\n{{description}}\n\nLearn more: {{url}}\n\n#Svelte #Tutorial',
     1),
    ('Default Job', 'Default template for job listings', 'job',
     '💼 {{title}} at {{company}}\n\n{{location}}\n\n{{url}}\n\n#svelte #jobs #hiring',
     '💼 {{title}} at {{company}}\n\n{{location}}\n\n{{url}}',
     '💼 We''re hiring: {{title}} at {{company}}\n\n{{location}}\n\n{{description}}\n\nApply now: {{url}}\n\n#Hiring #SvelteJobs',
     1),
    ('Default Sponsor', 'Default template for sponsor promotions', 'sponsor',
     '✨ Thanks to our sponsor {{company}}!\n\n{{tagline}}\n\n{{url}}',
     '✨ Thanks to our sponsor {{company}}!\n\n{{tagline}}\n\n{{url}}',
     '✨ Proud to partner with {{company}}!\n\n{{tagline}}\n\nLearn more: {{url}}',
     1);


-- ============================================
-- PART 4: Social Auto-Posting Rules
-- ============================================

CREATE TABLE IF NOT EXISTS social_auto_rules (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),

    -- Rule identification
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT 1,

    -- Trigger configuration
    trigger_type TEXT NOT NULL CHECK(trigger_type IN ('content_published', 'sponsor_activated', 'job_published')),
    content_type_filter TEXT,                     -- For content triggers: 'video', 'library', etc. (NULL = all)
    tag_filter TEXT,                              -- JSON array of required tags (NULL = no filter)

    -- Action configuration
    platforms TEXT NOT NULL,                      -- JSON array: ['twitter', 'bluesky', 'linkedin']
    template_id TEXT,                             -- FK to social_templates (NULL = use default)
    use_ai_generation BOOLEAN NOT NULL DEFAULT 0, -- Use AI to generate post text

    -- Timing
    delay_minutes INTEGER NOT NULL DEFAULT 0,     -- Delay after trigger event
    add_to_queue BOOLEAN NOT NULL DEFAULT 1,      -- Add to queue vs. specific time

    -- Post settings
    create_as_draft BOOLEAN NOT NULL DEFAULT 1,   -- Create as draft (requires approval) vs. auto-schedule

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (template_id) REFERENCES social_templates(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_social_auto_rules_is_active ON social_auto_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_social_auto_rules_trigger_type ON social_auto_rules(trigger_type);


-- ============================================
-- PART 5: Social Queue Settings (Per-Platform)
-- ============================================

CREATE TABLE IF NOT EXISTS social_queue_settings (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),

    -- Platform or 'global' for default settings
    platform TEXT NOT NULL UNIQUE CHECK(platform IN ('twitter', 'bluesky', 'linkedin', 'global')),

    -- Optimal posting times (JSON array of times in HH:MM format)
    posting_times TEXT NOT NULL DEFAULT '["09:00", "12:00", "15:00", "18:00"]',

    -- Posting days (JSON array of day numbers, 0=Sunday, 6=Saturday)
    posting_days TEXT NOT NULL DEFAULT '[1, 2, 3, 4, 5]',

    -- Minimum gap between posts (in minutes)
    min_gap_minutes INTEGER NOT NULL DEFAULT 60,

    -- Queue status
    is_paused BOOLEAN NOT NULL DEFAULT 0,

    -- Timezone for scheduling
    timezone TEXT NOT NULL DEFAULT 'America/New_York',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default global queue settings
INSERT INTO social_queue_settings (platform, posting_times, posting_days, min_gap_minutes, timezone) VALUES
    ('global', '["09:00", "12:00", "15:00", "18:00"]', '[1, 2, 3, 4, 5]', 60, 'America/New_York');


-- ============================================
-- PART 6: Social Credentials (Encrypted)
-- ============================================

CREATE TABLE IF NOT EXISTS social_credentials (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),

    -- Platform and account identification
    platform TEXT NOT NULL CHECK(platform IN ('twitter', 'bluesky', 'linkedin')),
    account_name TEXT NOT NULL,                   -- Display name for this account
    account_id TEXT,                              -- Platform-specific account ID

    -- Encrypted credentials (AES-256-GCM)
    -- The actual encryption key is in SOCIAL_CREDENTIALS_KEY env var
    credentials_encrypted TEXT NOT NULL,          -- Encrypted JSON blob
    iv TEXT NOT NULL,                             -- Initialization vector for decryption

    -- Token expiration tracking
    expires_at TIMESTAMP,
    refresh_token_encrypted TEXT,                 -- Encrypted refresh token (for OAuth)
    refresh_iv TEXT,                              -- IV for refresh token

    -- Status
    is_active BOOLEAN NOT NULL DEFAULT 1,
    last_used_at TIMESTAMP,
    last_error TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(platform, account_name)
);

CREATE INDEX IF NOT EXISTS idx_social_credentials_platform ON social_credentials(platform);
CREATE INDEX IF NOT EXISTS idx_social_credentials_is_active ON social_credentials(is_active);


-- ============================================
-- PART 7: Social Post Execution Log
-- ============================================

CREATE TABLE IF NOT EXISTS social_post_log (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),

    post_id TEXT NOT NULL,
    platform TEXT NOT NULL,

    -- Execution details
    action TEXT NOT NULL CHECK(action IN ('schedule', 'publish', 'retry', 'fail', 'cancel')),
    success BOOLEAN NOT NULL,
    error_message TEXT,

    -- External references
    external_post_id TEXT,
    response_data TEXT,                           -- JSON of API response

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (post_id) REFERENCES social_posts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_social_post_log_post_id ON social_post_log(post_id);
CREATE INDEX IF NOT EXISTS idx_social_post_log_action ON social_post_log(action);
CREATE INDEX IF NOT EXISTS idx_social_post_log_created_at ON social_post_log(created_at);


-- ============================================
-- PART 8: Views for Common Queries
-- ============================================

-- View for scheduled posts that need publishing
CREATE VIEW IF NOT EXISTS social_posts_due AS
SELECT
    sp.id,
    sp.title,
    sp.post_type,
    sp.content_id,
    sp.sponsor_id,
    sp.job_id,
    sp.status,
    sp.scheduled_at,
    sp.link_url,
    sp.utm_source,
    sp.utm_medium,
    sp.utm_campaign,
    sp.media_urls,
    sp.created_by
FROM social_posts sp
WHERE sp.status = 'scheduled'
  AND sp.scheduled_at <= CURRENT_TIMESTAMP;

-- View for posts with platform details
CREATE VIEW IF NOT EXISTS social_posts_with_platforms AS
SELECT
    sp.*,
    GROUP_CONCAT(spp.platform) as platforms,
    SUM(CASE WHEN spp.status = 'published' THEN 1 ELSE 0 END) as published_count,
    SUM(CASE WHEN spp.status = 'failed' THEN 1 ELSE 0 END) as failed_count,
    SUM(CASE WHEN spp.status = 'pending' THEN 1 ELSE 0 END) as pending_count
FROM social_posts sp
LEFT JOIN social_post_platforms spp ON sp.id = spp.post_id
GROUP BY sp.id;


-- ============================================
-- PART 9: Triggers
-- ============================================

-- Update social_posts.updated_at on any change
CREATE TRIGGER IF NOT EXISTS social_posts_updated_at
AFTER UPDATE ON social_posts
BEGIN
    UPDATE social_posts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Update social_post_platforms.updated_at on any change
CREATE TRIGGER IF NOT EXISTS social_post_platforms_updated_at
AFTER UPDATE ON social_post_platforms
BEGIN
    UPDATE social_post_platforms SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Update social_templates.updated_at on any change
CREATE TRIGGER IF NOT EXISTS social_templates_updated_at
AFTER UPDATE ON social_templates
BEGIN
    UPDATE social_templates SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Update social_auto_rules.updated_at on any change
CREATE TRIGGER IF NOT EXISTS social_auto_rules_updated_at
AFTER UPDATE ON social_auto_rules
BEGIN
    UPDATE social_auto_rules SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Update social_queue_settings.updated_at on any change
CREATE TRIGGER IF NOT EXISTS social_queue_settings_updated_at
AFTER UPDATE ON social_queue_settings
BEGIN
    UPDATE social_queue_settings SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Update social_credentials.updated_at on any change
CREATE TRIGGER IF NOT EXISTS social_credentials_updated_at
AFTER UPDATE ON social_credentials
BEGIN
    UPDATE social_credentials SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
