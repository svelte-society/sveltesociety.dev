-- Add newsletter_preference column to users table
-- Values: null (never asked), 'declined', 'subscribed'
ALTER TABLE users ADD COLUMN newsletter_preference TEXT
  CHECK(newsletter_preference IN (NULL, 'declined', 'subscribed'));
