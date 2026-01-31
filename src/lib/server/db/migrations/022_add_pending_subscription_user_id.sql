-- Add user_id to newsletter_pending_subscriptions
-- This allows us to link the pending subscription to a logged-in user
-- so we can update their plunk_contact_id after confirmation
ALTER TABLE newsletter_pending_subscriptions ADD COLUMN user_id TEXT REFERENCES users(id);
