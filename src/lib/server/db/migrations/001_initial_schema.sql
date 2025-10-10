-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    email TEXT UNIQUE,
    username TEXT UNIQUE,
    name TEXT,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    twitter TEXT,
    role INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role) REFERENCES roles(id)
);

-- OAuth Providers table
CREATE TABLE IF NOT EXISTS oauth_providers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User OAuth table - links users to their OAuth accounts
CREATE TABLE IF NOT EXISTS user_oauth (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    user_id TEXT NOT NULL,
    provider_id INTEGER NOT NULL,
    provider_user_id TEXT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    profile_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES oauth_providers(id),
    UNIQUE(provider_id, provider_user_id)
);

-- Create index for faster OAuth lookups
CREATE INDEX IF NOT EXISTS idx_user_oauth_user_id ON user_oauth(user_id);
CREATE INDEX IF NOT EXISTS idx_user_oauth_provider ON user_oauth(provider_id, provider_user_id);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY,
    user_id TEXT NOT NULL,
    session_token TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS user_id_idx ON sessions(user_id);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content table
CREATE TABLE IF NOT EXISTS content (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    title TEXT NOT NULL UNIQUE,
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
CREATE INDEX IF NOT EXISTS statusIdx ON content(status);

-- Content to Users junction table
CREATE TABLE IF NOT EXISTS content_to_users (
    content_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    PRIMARY KEY (content_id, user_id),
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    color TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content to Tags junction table
CREATE TABLE IF NOT EXISTS content_to_tags (
    content_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    PRIMARY KEY (content_id, tag_id),
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS tag_id_idx ON content_to_tags(tag_id);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    user_id TEXT NOT NULL,
    target_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (target_id) REFERENCES content(id) ON DELETE CASCADE
);

-- Saves table
CREATE TABLE IF NOT EXISTS saves (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    user_id TEXT NOT NULL,
    target_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (target_id) REFERENCES content(id) ON DELETE CASCADE
);

-- Moderation queue table
CREATE TABLE IF NOT EXISTS moderation_queue (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    title TEXT GENERATED ALWAYS AS (
        COALESCE(JSON_EXTRACT(data, '$.title'), '<No Title>')
    ) VIRTUAL,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
    data JSON NOT NULL,
    submitted_by TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    moderated_by TEXT,
    moderated_at TIMESTAMP,
    FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (moderated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Cache table for API responses
CREATE TABLE IF NOT EXISTS cache (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    metadata TEXT,
    created_at INTEGER NOT NULL,
    ttl INTEGER
);
CREATE INDEX IF NOT EXISTS idx_cache_created_at ON cache(created_at);

-- Migrations table to track applied database migrations
CREATE TABLE IF NOT EXISTS migrations (
    version INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default OAuth providers
INSERT OR IGNORE INTO oauth_providers (name, description, active)
VALUES ('github', 'GitHub OAuth Provider', 1);

CREATE VIEW IF NOT EXISTS collections_view AS
SELECT *
FROM content
WHERE type = 'collection';

-- View for published content
CREATE VIEW IF NOT EXISTS published_content AS
SELECT *
FROM content
WHERE status = 'published';

-- View for draft content
CREATE VIEW IF NOT EXISTS draft_content AS
SELECT *
FROM content
WHERE status = 'draft';

-- View for archived content
CREATE VIEW IF NOT EXISTS archived_content AS
SELECT *
FROM content
WHERE status = 'archived';

-- View for all content that isn't a collection
CREATE VIEW IF NOT EXISTS content_without_collections AS
SELECT *
FROM content
WHERE type != 'collection';

CREATE INDEX IF NOT EXISTS idx_content_status_published_at ON content(status, published_at);

-- View for content with author information
CREATE VIEW IF NOT EXISTS content_with_authors AS
SELECT
    c.*,
    u.id as author_id,
    u.username as author_username,
    u.name as author_name
FROM content c
LEFT JOIN content_to_users cu ON c.id = cu.content_id
LEFT JOIN users u ON cu.user_id = u.id;

-- Index for better performance
CREATE INDEX IF NOT EXISTS idx_content_to_users_content_id ON content_to_users(content_id);
CREATE INDEX IF NOT EXISTS idx_content_to_users_user_id ON content_to_users(user_id);

CREATE TRIGGER IF NOT EXISTS increment_likes
AFTER INSERT ON likes
BEGIN
  UPDATE content SET likes = likes + 1 WHERE id = NEW.target_id;
END;

CREATE TRIGGER IF NOT EXISTS decrement_likes
AFTER DELETE ON likes
BEGIN
  UPDATE content SET likes = likes - 1 WHERE id = OLD.target_id;
END;

CREATE TRIGGER IF NOT EXISTS increment_saves
AFTER INSERT ON saves
BEGIN
  UPDATE content SET saves = saves + 1 WHERE id = NEW.target_id;
END;

CREATE TRIGGER IF NOT EXISTS decrement_saves
AFTER DELETE ON saves
BEGIN
  UPDATE content SET saves = saves - 1 WHERE id = OLD.target_id;
END;

-- Trigger to move moderated_queue item to content when approved
CREATE TRIGGER IF NOT EXISTS approve_content
AFTER UPDATE ON moderation_queue
WHEN NEW.status = 'approved' AND NEW.type = 'content'
BEGIN
  INSERT INTO content (title, type, body, slug, description, status, created_at, updated_at)
  SELECT 
    json_extract(NEW.data, '$.title'),
    json_extract(NEW.data, '$.type'),
    json_extract(NEW.data, '$.body'),
    lower(replace(json_extract(NEW.data, '$.title'), ' ', '-')),
    json_extract(NEW.data, '$.description'),
    'draft',
    NEW.submitted_at,
    NEW.moderated_at;

  -- Link author to content
  INSERT INTO content_to_users (content_id, user_id)
  SELECT last_insert_rowid(), NEW.submitted_by;

  -- Handle tags
  INSERT OR IGNORE INTO content_to_tags (content_id, tag_id)
  SELECT last_insert_rowid(), tags.id
  FROM json_each(json_extract(NEW.data, '$.tags')) as t
  JOIN tags ON tags.slug = t.value;
END;

-- Trigger to delete related entries in content_to_tags
CREATE TRIGGER IF NOT EXISTS delete_content_tags
BEFORE DELETE ON content
FOR EACH ROW
BEGIN
    DELETE FROM content_to_tags WHERE content_id = OLD.id;
END;

-- Trigger to delete related entries in content_to_users
CREATE TRIGGER IF NOT EXISTS delete_content_users
BEFORE DELETE ON content
FOR EACH ROW
BEGIN
    DELETE FROM content_to_users WHERE content_id = OLD.id;
END;

-- Trigger to delete related entries in likes
CREATE TRIGGER IF NOT EXISTS delete_content_likes
BEFORE DELETE ON content
FOR EACH ROW
BEGIN
    DELETE FROM likes WHERE target_id = OLD.id;
END;

-- Trigger to delete related entries in saves
CREATE TRIGGER IF NOT EXISTS delete_content_saves
BEFORE DELETE ON content
FOR EACH ROW
BEGIN
    DELETE FROM saves WHERE target_id = OLD.id;
END;

-- Trigger to set published_at when published
CREATE TRIGGER IF NOT EXISTS update_published_at
AFTER UPDATE OF status ON content
WHEN NEW.status = 'published' AND OLD.status != 'published'
BEGIN
    UPDATE content
    SET published_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;