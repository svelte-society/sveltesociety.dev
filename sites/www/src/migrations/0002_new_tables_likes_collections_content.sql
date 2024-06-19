-- Create the new `Content` table
CREATE TABLE content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL, -- post, video, news, etc.
  title TEXT,
  body TEXT,
  url TEXT,
  created_at DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create the new `Likes` table
CREATE TABLE likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  content_id INTEGER NOT NULL,
  created_at DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (content_id) REFERENCES content(id)
);

-- Create the new `Collections` table
CREATE TABLE collections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create the new `CollectionContent` table to manage the many-to-many relationship
-- between `Collections` and `Content`, including ordering within collections
CREATE TABLE collection_content (
  collection_id INTEGER NOT NULL,
  content_id INTEGER NOT NULL,
  position INTEGER NOT NULL, -- to manage ordering
  FOREIGN KEY (collection_id) REFERENCES collections(id),
  FOREIGN KEY (content_id) REFERENCES content(id),
  PRIMARY KEY (collection_id, content_id) -- composite primary key
);