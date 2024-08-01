-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    github_id INTEGER UNIQUE,
    email TEXT,
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

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    session_token TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS user_id_idx ON sessions(user_id);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    description TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content table
CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK(type IN ('recipe', 'video', 'library', 'link', 'blog', 'collection')),
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
    content_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (content_id, user_id),
    FOREIGN KEY (content_id) REFERENCES content(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    color TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content to Tags junction table
CREATE TABLE IF NOT EXISTS content_to_tags (
    content_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (content_id, tag_id),
    FOREIGN KEY (content_id) REFERENCES content(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);
CREATE INDEX IF NOT EXISTS tag_id_idx ON content_to_tags(tag_id);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    target_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (target_id) REFERENCES content(id)
);

-- Saves table
CREATE TABLE IF NOT EXISTS saves (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    target_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (target_id) REFERENCES content(id)
);

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

-- Full-text search
CREATE VIRTUAL TABLE IF NOT EXISTS content_fts USING fts5(
  content_id UNINDEXED,
  title, 
  body, 
  description
);

CREATE TRIGGER IF NOT EXISTS content_ai AFTER INSERT ON content BEGIN
  INSERT INTO content_fts(content_id, title, body, description)
  VALUES (NEW.id, NEW.title, NEW.body, NEW.description);
END;

CREATE TRIGGER IF NOT EXISTS content_au AFTER UPDATE ON content BEGIN
  UPDATE content_fts
  SET title = NEW.title,
      body = NEW.body,
      description = NEW.description
  WHERE content_id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS content_ad AFTER DELETE ON content BEGIN
  DELETE FROM content_fts WHERE content_id = OLD.id;
END;