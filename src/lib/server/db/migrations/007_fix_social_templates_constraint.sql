-- Fix unique constraint on social_templates
-- The original UNIQUE(content_type, platform, is_default) doesn't work correctly
-- We need UNIQUE(content_type, platform) WHERE is_default = 1

-- Create new table with correct structure
CREATE TABLE social_templates_new (
    id TEXT PRIMARY KEY,
    content_type TEXT NOT NULL CHECK(content_type IN ('video', 'library', 'recipe', 'announcement', 'collection', 'event')),
    platform TEXT NOT NULL CHECK(platform IN ('bluesky', 'nostr', 'linkedin')),
    template TEXT NOT NULL,
    is_default BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Copy data from old table
INSERT INTO social_templates_new (id, content_type, platform, template, is_default, created_at, updated_at, created_by)
SELECT id, content_type, platform, template, is_default, created_at, updated_at, created_by
FROM social_templates;

-- Drop old table
DROP TABLE social_templates;

-- Rename new table
ALTER TABLE social_templates_new RENAME TO social_templates;

-- Create partial unique index - only one default per content_type/platform
CREATE UNIQUE INDEX idx_social_templates_default
ON social_templates(content_type, platform)
WHERE is_default = 1;

-- Recreate the lookup index
CREATE INDEX idx_social_templates_lookup ON social_templates(content_type, platform, is_default);

-- Recreate the update trigger
CREATE TRIGGER update_social_templates_timestamp
AFTER UPDATE ON social_templates
BEGIN
    UPDATE social_templates SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
