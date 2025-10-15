-- Add trigger to automatically unset other defaults when setting a new default template
-- This ensures only one default template per content_type/platform combination

-- Trigger for INSERT operations
CREATE TRIGGER enforce_single_default_insert
BEFORE INSERT ON social_templates
WHEN NEW.is_default = 1
BEGIN
    -- Unset any existing defaults for this content_type/platform
    UPDATE social_templates
    SET is_default = 0
    WHERE content_type = NEW.content_type
    AND platform = NEW.platform
    AND is_default = 1;
END;

-- Trigger for UPDATE operations
CREATE TRIGGER enforce_single_default_update
BEFORE UPDATE ON social_templates
WHEN NEW.is_default = 1 AND OLD.is_default = 0
BEGIN
    -- Unset any existing defaults for this content_type/platform
    UPDATE social_templates
    SET is_default = 0
    WHERE content_type = NEW.content_type
    AND platform = NEW.platform
    AND is_default = 1
    AND id != NEW.id;
END;
