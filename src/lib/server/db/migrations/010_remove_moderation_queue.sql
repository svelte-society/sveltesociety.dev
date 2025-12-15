-- Migration: Remove moderation queue table
-- The moderation queue has been replaced with content status workflow.
-- Submissions now go directly into the content table with status='pending_review'.
-- Ensure the moderation queue is empty before running this migration.

-- Drop the trigger that was tied to moderation_queue
DROP TRIGGER IF EXISTS approve_content;

DROP TABLE IF EXISTS moderation_queue;
