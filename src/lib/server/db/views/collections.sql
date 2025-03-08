CREATE VIEW IF NOT EXISTS collections_view AS
SELECT *
FROM content
WHERE type = 'collection';