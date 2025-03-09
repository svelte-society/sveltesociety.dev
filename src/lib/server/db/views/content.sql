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
