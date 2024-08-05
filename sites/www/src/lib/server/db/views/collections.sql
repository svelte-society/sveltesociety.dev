CREATE VIEW collections_view AS
SELECT *
FROM content
WHERE type = 'collection';