-- Migration: Add plunk_contact_id to users table
-- Stores the Plunk contact ID for newsletter management links

ALTER TABLE users ADD COLUMN plunk_contact_id TEXT;
