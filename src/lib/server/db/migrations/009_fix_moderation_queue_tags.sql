-- Fix malformed tags in moderation queue items
-- Some items have tags: [""] - empty string only
-- Some items have tags: ["id1,id2,id3"] - comma-separated in single string

-- Fix all items with only empty string tags by setting a default tag (sveltekit tag)
UPDATE moderation_queue
SET data = json_set(data, '$.tags', json('["2E60CF2155166A75"]'))
WHERE json_extract(data, '$.tags') = '[""]'
   OR json_extract(data, '$.tags') = '["", ""]'
   OR json_extract(data, '$.tags') = '[]';

-- Fix all comma-separated tags entries by splitting the first element on commas
-- This handles any record where tags[0] contains a comma (e.g., ["tag1,tag2,tag3"])
-- SQLite doesn't have native string splitting, so we handle common cases (1-5 comma-separated values)
-- and fall back to setting a default tag for more complex cases

-- Single comma (2 tags): "a,b" -> ["a", "b"]
UPDATE moderation_queue
SET data = json_set(data, '$.tags', json_array(
    trim(substr(json_extract(data, '$.tags[0]'), 1, instr(json_extract(data, '$.tags[0]'), ',') - 1)),
    trim(substr(json_extract(data, '$.tags[0]'), instr(json_extract(data, '$.tags[0]'), ',') + 1))
))
WHERE json_array_length(json_extract(data, '$.tags')) = 1
  AND json_extract(data, '$.tags[0]') LIKE '%,%'
  AND json_extract(data, '$.tags[0]') NOT LIKE '%,%,%';

-- Two commas (3 tags): "a,b,c" -> ["a", "b", "c"]
UPDATE moderation_queue
SET data = json_set(data, '$.tags', json_array(
    trim(substr(json_extract(data, '$.tags[0]'), 1, instr(json_extract(data, '$.tags[0]'), ',') - 1)),
    trim(substr(
        substr(json_extract(data, '$.tags[0]'), instr(json_extract(data, '$.tags[0]'), ',') + 1),
        1,
        instr(substr(json_extract(data, '$.tags[0]'), instr(json_extract(data, '$.tags[0]'), ',') + 1), ',') - 1
    )),
    trim(substr(
        substr(json_extract(data, '$.tags[0]'), instr(json_extract(data, '$.tags[0]'), ',') + 1),
        instr(substr(json_extract(data, '$.tags[0]'), instr(json_extract(data, '$.tags[0]'), ',') + 1), ',') + 1
    ))
))
WHERE json_array_length(json_extract(data, '$.tags')) = 1
  AND json_extract(data, '$.tags[0]') LIKE '%,%,%'
  AND json_extract(data, '$.tags[0]') NOT LIKE '%,%,%,%';

-- For entries with 4+ commas, set default tag (rare edge case)
UPDATE moderation_queue
SET data = json_set(data, '$.tags', json('["2E60CF2155166A75"]'))
WHERE json_array_length(json_extract(data, '$.tags')) = 1
  AND json_extract(data, '$.tags[0]') LIKE '%,%,%,%';
