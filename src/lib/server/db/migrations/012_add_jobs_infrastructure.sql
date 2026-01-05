-- Migration: Add Jobs Infrastructure
-- Adds 'job' type to content, creates job_tiers, job_applications, and payments tables

-- ============================================
-- PART 1: Add 'job' to content type constraint
-- ============================================

-- Drop all triggers that reference content table
DROP TRIGGER IF EXISTS increment_likes;
DROP TRIGGER IF EXISTS decrement_likes;
DROP TRIGGER IF EXISTS increment_saves;
DROP TRIGGER IF EXISTS decrement_saves;
DROP TRIGGER IF EXISTS delete_content_tags;
DROP TRIGGER IF EXISTS delete_content_users;
DROP TRIGGER IF EXISTS delete_content_likes;
DROP TRIGGER IF EXISTS delete_content_saves;
DROP TRIGGER IF EXISTS update_published_at;
-- Note: approve_content trigger was removed in migration 010 along with moderation_queue
DROP TRIGGER IF EXISTS content___set_slug;

-- Drop all views that reference content table
DROP VIEW IF EXISTS collections_view;
DROP VIEW IF EXISTS published_content;
DROP VIEW IF EXISTS draft_content;
DROP VIEW IF EXISTS archived_content;
DROP VIEW IF EXISTS content_without_collections;
DROP VIEW IF EXISTS content_with_authors;

-- Drop indexes
DROP INDEX IF EXISTS statusIdx;
DROP INDEX IF EXISTS idx_content_status_published_at;
DROP INDEX IF EXISTS idx_content_to_users_content_id;
DROP INDEX IF EXISTS idx_content_to_users_user_id;

-- Create the new table with 'job' added to type constraint
CREATE TABLE new_content_table (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('recipe', 'video', 'library', 'announcement', 'link', 'blog', 'collection', 'event', 'resource', 'job')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived', 'pending_review')),
    body TEXT,
    rendered_body TEXT,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    metadata TEXT,
    children TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    likes INTEGER NOT NULL DEFAULT 0,
    saves INTEGER NOT NULL DEFAULT 0
);

-- Copy data
INSERT INTO new_content_table SELECT * FROM content;

-- Drop old table
DROP TABLE content;

-- Rename new table
ALTER TABLE new_content_table RENAME TO content;

-- Recreate indexes
CREATE INDEX IF NOT EXISTS statusIdx ON content(status);
CREATE INDEX IF NOT EXISTS idx_content_status_published_at ON content(status, published_at);
CREATE INDEX IF NOT EXISTS idx_content_to_users_content_id ON content_to_users(content_id);
CREATE INDEX IF NOT EXISTS idx_content_to_users_user_id ON content_to_users(user_id);

-- Recreate views
CREATE VIEW collections_view AS SELECT * FROM content WHERE type = 'collection';
CREATE VIEW published_content AS SELECT * FROM content WHERE status = 'published';
CREATE VIEW draft_content AS SELECT * FROM content WHERE status = 'draft';
CREATE VIEW archived_content AS SELECT * FROM content WHERE status = 'archived';
CREATE VIEW content_without_collections AS SELECT * FROM content WHERE type != 'collection';
CREATE VIEW content_with_authors AS
SELECT c.*, u.id as author_id, u.username as author_username, u.name as author_name
FROM content c
LEFT JOIN content_to_users cu ON c.id = cu.content_id
LEFT JOIN users u ON cu.user_id = u.id;

-- Recreate triggers
CREATE TRIGGER increment_likes AFTER INSERT ON likes
BEGIN UPDATE content SET likes = likes + 1 WHERE id = NEW.target_id; END;

CREATE TRIGGER decrement_likes AFTER DELETE ON likes
BEGIN UPDATE content SET likes = likes - 1 WHERE id = OLD.target_id; END;

CREATE TRIGGER increment_saves AFTER INSERT ON saves
BEGIN UPDATE content SET saves = saves + 1 WHERE id = NEW.target_id; END;

CREATE TRIGGER decrement_saves AFTER DELETE ON saves
BEGIN UPDATE content SET saves = saves - 1 WHERE id = OLD.target_id; END;

CREATE TRIGGER delete_content_tags BEFORE DELETE ON content FOR EACH ROW
BEGIN DELETE FROM content_to_tags WHERE content_id = OLD.id; END;

CREATE TRIGGER delete_content_users BEFORE DELETE ON content FOR EACH ROW
BEGIN DELETE FROM content_to_users WHERE content_id = OLD.id; END;

CREATE TRIGGER delete_content_likes BEFORE DELETE ON content FOR EACH ROW
BEGIN DELETE FROM likes WHERE target_id = OLD.id; END;

CREATE TRIGGER delete_content_saves BEFORE DELETE ON content FOR EACH ROW
BEGIN DELETE FROM saves WHERE target_id = OLD.id; END;

CREATE TRIGGER update_published_at AFTER UPDATE OF status ON content
WHEN NEW.status = 'published' AND OLD.status != 'published'
BEGIN UPDATE content SET published_at = CURRENT_TIMESTAMP WHERE id = NEW.id; END;

-- Note: approve_content trigger was removed in migration 010 along with moderation_queue

CREATE TRIGGER content___set_slug AFTER INSERT ON content BEGIN
  UPDATE content SET slug = slug || '-' || lower(new.id) WHERE id = new.id;
END;

-- ============================================
-- PART 2: Job Pricing Tiers
-- ============================================

CREATE TABLE IF NOT EXISTS job_tiers (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    price_cents INTEGER NOT NULL,
    duration_days INTEGER NOT NULL,
    features TEXT NOT NULL,  -- JSON array of feature strings
    stripe_price_id TEXT,    -- Stripe Price ID for checkout
    sort_order INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default tiers ($199, $399, $599)
INSERT INTO job_tiers (name, display_name, price_cents, duration_days, features, sort_order) VALUES
    ('basic', 'Basic', 19900, 30, '["30-day listing", "Standard visibility"]', 1),
    ('featured', 'Featured', 39900, 45, '["45-day listing", "Featured badge", "Higher search ranking", "Social media promotion"]', 2),
    ('premium', 'Premium', 59900, 60, '["60-day listing", "Premium badge", "Top search ranking", "Social media promotion", "Newsletter feature", "Homepage spotlight"]', 3);

-- ============================================
-- PART 3: Job Applications
-- ============================================

CREATE TABLE IF NOT EXISTS job_applications (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    job_id TEXT NOT NULL,
    applicant_id TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'viewed', 'contacted', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    viewed_at TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES content(id) ON DELETE CASCADE,
    FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(job_id, applicant_id)
);

CREATE INDEX IF NOT EXISTS idx_job_applications_job ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_applicant ON job_applications(applicant_id);

-- ============================================
-- PART 4: Payments
-- ============================================

CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    user_id TEXT,                        -- Nullable: companies post without accounts
    employer_email TEXT NOT NULL,        -- Email for payment receipts and notifications
    content_id TEXT,                     -- Links to the job posting once created
    stripe_payment_intent_id TEXT UNIQUE,
    stripe_checkout_session_id TEXT UNIQUE,
    amount_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'succeeded', 'failed', 'refunded')),
    tier_id TEXT NOT NULL,
    metadata TEXT,                       -- JSON for additional data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE SET NULL,
    FOREIGN KEY (tier_id) REFERENCES job_tiers(id)
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_content ON payments(content_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session ON payments(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- ============================================
-- PART 5: Job-specific views and triggers
-- ============================================

-- View for published jobs (useful for listing pages)
CREATE VIEW IF NOT EXISTS published_jobs AS
SELECT c.*,
       json_extract(c.metadata, '$.company_name') as company_name,
       json_extract(c.metadata, '$.tier_name') as tier_name,
       json_extract(c.metadata, '$.expires_at') as expires_at
FROM content c
WHERE c.type = 'job' AND c.status = 'published';

-- Index for faster job expiration queries
CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
