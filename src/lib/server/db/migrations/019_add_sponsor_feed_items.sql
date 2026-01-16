-- Migration: Add sponsor support to feed_items
-- Allows feed_items to be linked to sponsors for auto-managed sponsor cards

-- Step 1: Add sponsor_id column to feed_items
ALTER TABLE feed_items ADD COLUMN sponsor_id TEXT REFERENCES sponsors(id) ON DELETE CASCADE;

-- Step 2: Create index on sponsor_id for efficient lookups
CREATE INDEX IF NOT EXISTS idx_feed_items_sponsor ON feed_items(sponsor_id);

-- Step 3: Recreate the table with updated CHECK constraint to include 'sponsor' type
-- SQLite doesn't support ALTER CHECK constraints, so we need to recreate the table

-- Create new table with updated constraint
CREATE TABLE feed_items_new (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    content_id TEXT,
    sponsor_id TEXT,
    item_type TEXT NOT NULL CHECK (item_type IN ('cta', 'ad', 'featured', 'sponsor')),
    title TEXT,
    description TEXT,
    button_text TEXT,
    button_href TEXT,
    position_type TEXT NOT NULL CHECK (position_type IN ('fixed', 'random')),
    position_fixed INTEGER,
    position_range_min INTEGER,
    position_range_max INTEGER,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN NOT NULL,
    priority INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
    FOREIGN KEY (sponsor_id) REFERENCES sponsors(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Copy existing data to new table
INSERT INTO feed_items_new (
    id, content_id, item_type, title, description, button_text, button_href,
    position_type, position_fixed, position_range_min, position_range_max,
    start_date, end_date, is_active, priority, created_at, updated_at, created_by
)
SELECT
    id, content_id, item_type, title, description, button_text, button_href,
    position_type, position_fixed, position_range_min, position_range_max,
    start_date, end_date, is_active, priority, created_at, updated_at, created_by
FROM feed_items;

-- Drop old table
DROP TABLE feed_items;

-- Rename new table
ALTER TABLE feed_items_new RENAME TO feed_items;

-- Recreate indexes
CREATE INDEX idx_feed_items_active ON feed_items(is_active, start_date, end_date);
CREATE INDEX idx_feed_items_content ON feed_items(content_id);
CREATE INDEX idx_feed_items_type ON feed_items(item_type);
CREATE INDEX idx_feed_items_sponsor ON feed_items(sponsor_id);

-- Recreate trigger
CREATE TRIGGER update_feed_items_timestamp
AFTER UPDATE ON feed_items
BEGIN
    UPDATE feed_items SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
