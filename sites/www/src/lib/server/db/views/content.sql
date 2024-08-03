-- View for published content
CREATE VIEW published_content AS
SELECT *
FROM content
WHERE status = 'published';

-- View for draft content
CREATE VIEW draft_content AS
SELECT *
FROM content
WHERE status = 'draft';

-- View for archived content
CREATE VIEW archived_content AS
SELECT *
FROM content
WHERE status = 'archived';