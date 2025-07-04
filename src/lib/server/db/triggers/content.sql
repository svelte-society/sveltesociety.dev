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