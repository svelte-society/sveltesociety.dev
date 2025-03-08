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