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
  SELECT last_insert_rowid(), NEW.submitted_by
  WHERE NEW.submitted_by IS NOT NULL;

  -- Handle tags
  INSERT OR IGNORE INTO content_to_tags (content_id, tag_id)
  SELECT last_insert_rowid(), tags.id
  FROM json_each(json_extract(NEW.data, '$.tags')) as t
  JOIN tags ON tags.slug = t.value;
END;