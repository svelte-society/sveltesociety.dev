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