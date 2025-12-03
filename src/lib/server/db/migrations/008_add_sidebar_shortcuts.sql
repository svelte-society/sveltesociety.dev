CREATE TABLE IF NOT EXISTS sidebar_shortcuts (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    content_id TEXT NOT NULL UNIQUE,
    label TEXT,
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_sidebar_shortcuts_active ON sidebar_shortcuts(is_active, priority DESC);
CREATE INDEX idx_sidebar_shortcuts_content ON sidebar_shortcuts(content_id);

CREATE TRIGGER update_sidebar_shortcuts_timestamp
AFTER UPDATE ON sidebar_shortcuts
BEGIN
    UPDATE sidebar_shortcuts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
