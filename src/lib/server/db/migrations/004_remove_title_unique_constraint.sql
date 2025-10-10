-- Drop all triggers that reference content table
DROP TRIGGER IF EXISTS increment_likes;
DROP TRIGGER IF EXISTS decrement_likes;
DROP TRIGGER IF EXISTS increment_saves;
DROP TRIGGER IF EXISTS decrement_saves;
DROP TRIGGER IF EXISTS delete_content_tags;
DROP TRIGGER IF EXISTS delete_content_users;
DROP TRIGGER IF EXISTS delete_content_likes;
DROP TRIGGER IF EXISTS delete_content_saves;
DROP TRIGGER IF EXISTS update_published_at;
DROP TRIGGER IF EXISTS approve_content;

-- Drop all views that reference content table
DROP VIEW IF EXISTS collections_view;
DROP VIEW IF EXISTS published_content;
DROP VIEW IF EXISTS draft_content;
DROP VIEW IF EXISTS archived_content;
DROP VIEW IF EXISTS content_without_collections;
DROP VIEW IF EXISTS content_with_authors;

-- Drop indexes
DROP INDEX IF EXISTS statusIdx;
DROP INDEX IF EXISTS idx_content_status_published_at;
DROP INDEX IF EXISTS idx_content_to_users_content_id;
DROP INDEX IF EXISTS idx_content_to_users_user_id;

-- Now create the new table
CREATE TABLE new_content_table (
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

-- Copy data
INSERT INTO new_content_table SELECT * FROM content;

-- Drop old table
DROP TABLE content;

-- Rename new table
ALTER TABLE new_content_table RENAME TO content;

-- Recreate indexes
CREATE INDEX IF NOT EXISTS statusIdx ON content(status);
CREATE INDEX IF NOT EXISTS idx_content_status_published_at ON content(status, published_at);
CREATE INDEX IF NOT EXISTS idx_content_to_users_content_id ON content_to_users(content_id);
CREATE INDEX IF NOT EXISTS idx_content_to_users_user_id ON content_to_users(user_id);

-- Recreate views
CREATE VIEW collections_view AS SELECT * FROM content WHERE type = 'collection';
CREATE VIEW published_content AS SELECT * FROM content WHERE status = 'published';
CREATE VIEW draft_content AS SELECT * FROM content WHERE status = 'draft';
CREATE VIEW archived_content AS SELECT * FROM content WHERE status = 'archived';
CREATE VIEW content_without_collections AS SELECT * FROM content WHERE type != 'collection';
CREATE VIEW content_with_authors AS
SELECT c.*, u.id as author_id, u.username as author_username, u.name as author_name
FROM content c
LEFT JOIN content_to_users cu ON c.id = cu.content_id
LEFT JOIN users u ON cu.user_id = u.id;

-- Recreate triggers
CREATE TRIGGER increment_likes AFTER INSERT ON likes
BEGIN UPDATE content SET likes = likes + 1 WHERE id = NEW.target_id; END;

CREATE TRIGGER decrement_likes AFTER DELETE ON likes
BEGIN UPDATE content SET likes = likes - 1 WHERE id = OLD.target_id; END;

CREATE TRIGGER increment_saves AFTER INSERT ON saves
BEGIN UPDATE content SET saves = saves + 1 WHERE id = NEW.target_id; END;

CREATE TRIGGER decrement_saves AFTER DELETE ON saves
BEGIN UPDATE content SET saves = saves - 1 WHERE id = OLD.target_id; END;

CREATE TRIGGER delete_content_tags BEFORE DELETE ON content FOR EACH ROW
BEGIN DELETE FROM content_to_tags WHERE content_id = OLD.id; END;

CREATE TRIGGER delete_content_users BEFORE DELETE ON content FOR EACH ROW
BEGIN DELETE FROM content_to_users WHERE content_id = OLD.id; END;

CREATE TRIGGER delete_content_likes BEFORE DELETE ON content FOR EACH ROW
BEGIN DELETE FROM likes WHERE target_id = OLD.id; END;

CREATE TRIGGER delete_content_saves BEFORE DELETE ON content FOR EACH ROW
BEGIN DELETE FROM saves WHERE target_id = OLD.id; END;

CREATE TRIGGER update_published_at AFTER UPDATE OF status ON content
WHEN NEW.status = 'published' AND OLD.status != 'published'
BEGIN UPDATE content SET published_at = CURRENT_TIMESTAMP WHERE id = NEW.id; END;

CREATE TRIGGER approve_content AFTER UPDATE ON moderation_queue
WHEN NEW.status = 'approved' AND NEW.type = 'content'
BEGIN
  INSERT INTO content (title, type, body, slug, description, status, created_at, updated_at)
  SELECT json_extract(NEW.data, '$.title'), json_extract(NEW.data, '$.type'),
         json_extract(NEW.data, '$.body'), lower(replace(json_extract(NEW.data, '$.title'), ' ', '-')),
         json_extract(NEW.data, '$.description'), 'draft', NEW.submitted_at, NEW.moderated_at;
  INSERT INTO content_to_users (content_id, user_id)
  SELECT last_insert_rowid(), NEW.submitted_by;
  INSERT OR IGNORE INTO content_to_tags (content_id, tag_id)
  SELECT last_insert_rowid(), tags.id
  FROM json_each(json_extract(NEW.data, '$.tags')) as t
  JOIN tags ON tags.slug = t.value;
END;
