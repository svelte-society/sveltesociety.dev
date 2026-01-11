-- Create feed_items table for managing promotional content in the homepage feed
CREATE TABLE IF NOT EXISTS feed_items (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    content_id TEXT,
    item_type TEXT NOT NULL CHECK (item_type IN ('cta', 'ad', 'featured')),
    title TEXT,
    description TEXT,
    button_text TEXT,
    button_href TEXT,
    position_type TEXT NOT NULL CHECK (position_type IN ('fixed', 'random')) DEFAULT 'random',
    position_fixed INTEGER,
    position_range_min INTEGER DEFAULT 3,
    position_range_max INTEGER DEFAULT 7,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for efficient queries
CREATE INDEX idx_feed_items_active ON feed_items(is_active, start_date, end_date);
CREATE INDEX idx_feed_items_content ON feed_items(content_id);
CREATE INDEX idx_feed_items_type ON feed_items(item_type);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_feed_items_timestamp
AFTER UPDATE ON feed_items
BEGIN
    UPDATE feed_items SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
