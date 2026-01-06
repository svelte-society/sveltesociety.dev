-- Migration: Add newsletter pending subscriptions for double opt-in
-- Stores pending email confirmations with time-limited tokens

CREATE TABLE IF NOT EXISTS newsletter_pending_subscriptions (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    email TEXT NOT NULL UNIQUE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for token lookup (used in confirmation endpoint)
CREATE INDEX IF NOT EXISTS idx_newsletter_pending_token ON newsletter_pending_subscriptions(token);

-- Index for email lookup (used in subscribe endpoint)
CREATE INDEX IF NOT EXISTS idx_newsletter_pending_email ON newsletter_pending_subscriptions(email);
