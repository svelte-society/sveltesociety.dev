CREATE TRIGGER IF NOT EXISTS content_ai AFTER INSERT ON content BEGIN
  INSERT INTO content_fts(content_id, title, body)
  VALUES (NEW.id, NEW.title, NEW.body);
END;

CREATE TRIGGER IF NOT EXISTS content_au AFTER UPDATE ON content BEGIN
  UPDATE content_fts
  SET title = NEW.title,
      body = NEW.body,
  WHERE content_id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS content_ad AFTER DELETE ON content BEGIN
  DELETE FROM content_fts WHERE content_id = OLD.id;
END;
