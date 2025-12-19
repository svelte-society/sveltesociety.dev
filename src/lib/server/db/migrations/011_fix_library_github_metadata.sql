-- Fix library metadata where github was stored as an object instead of a string URL
-- This was caused by MetadataService.fetchGithubMetadata() returning github as an object
-- which then overwrote the original string URL during Object.assign()

UPDATE content
SET metadata = json_set(
  metadata,
  '$.github',
  'https://github.com/' || json_extract(metadata, '$.github.owner') || '/' || json_extract(metadata, '$.github.repo')
)
WHERE type = 'library'
  AND json_type(metadata, '$.github') = 'object'
  AND json_extract(metadata, '$.github.owner') IS NOT NULL
  AND json_extract(metadata, '$.github.repo') IS NOT NULL;
