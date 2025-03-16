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
