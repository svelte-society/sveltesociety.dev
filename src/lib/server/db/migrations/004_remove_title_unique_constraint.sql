
BEGIN TRANSACTION;

-- Content table
CREATE TABLE IF NOT EXISTS new_content_table (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('recipe', 'video', 'library', 'announcement', 'link', 'blog', 'collection', 'event')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived', 'pending_review')),
    body TEXT,
    rendered_body TEXT,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    metadata TEXT,
    children TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    likes INTEGER NOT NULL DEFAULT 0,
    saves INTEGER NOT NULL DEFAULT 0
);

-- 3. Copy data from the old table to the new one
INSERT INTO new_content_table SELECT * FROM content;

-- 4. Drop the old table
DROP TABLE content;

-- 5. Rename the new table to the original name
ALTER TABLE new_content_table RENAME TO content;

CREATE INDEX IF NOT EXISTS statusIdx ON content(status);

COMMIT;
