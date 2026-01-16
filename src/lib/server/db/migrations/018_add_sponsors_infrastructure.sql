-- Migration: Add Sponsors Infrastructure
-- Creates sponsor_tiers, sponsors, sponsor_subscriptions, and sponsor_payments tables
-- Supports both one-time sponsorships and monthly/yearly subscriptions

-- ============================================
-- PART 1: Sponsor Pricing Tiers
-- ============================================

CREATE TABLE IF NOT EXISTS sponsor_tiers (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    name TEXT NOT NULL UNIQUE,                      -- 'basic', 'premium'
    display_name TEXT NOT NULL,                     -- 'Basic Sponsor', 'Premium Sponsor'

    -- Pricing (all in cents)
    price_cents INTEGER NOT NULL,                   -- Monthly price
    yearly_price_cents INTEGER NOT NULL,            -- Yearly price (with discount)
    one_time_price_cents INTEGER NOT NULL,          -- One-time 30-day price

    -- Features
    features TEXT NOT NULL,                         -- JSON array of feature strings
    logo_size TEXT NOT NULL DEFAULT 'normal' CHECK(logo_size IN ('normal', 'large')),
    max_tagline_length INTEGER NOT NULL DEFAULT 100,

    -- Display options
    show_in_feed BOOLEAN NOT NULL DEFAULT 1,
    show_in_sidebar BOOLEAN NOT NULL DEFAULT 1,
    include_social_promo BOOLEAN NOT NULL DEFAULT 0,

    -- Stripe Price IDs (created in Stripe dashboard or via API)
    stripe_monthly_price_id TEXT,
    stripe_yearly_price_id TEXT,
    stripe_onetime_price_id TEXT,

    -- Ordering and status
    sort_order INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default tiers
-- Basic: ~$399/mo, Premium: ~$799/mo (2x size, social promo)
INSERT INTO sponsor_tiers (name, display_name, price_cents, yearly_price_cents, one_time_price_cents, features, logo_size, max_tagline_length, include_social_promo, sort_order) VALUES
    ('basic', 'Basic Sponsor', 39900, 399000, 39900, '["Logo in feed cards", "Logo in sidebar", "Company tagline", "Website link", "Optional discount code"]', 'normal', 100, 0, 1),
    ('premium', 'Premium Sponsor', 79900, 799000, 79900, '["2x larger logo", "Logo in feed cards", "Logo in sidebar", "Extended tagline (200 chars)", "Website link", "Optional discount code", "Social media promotion"]', 'large', 200, 1, 2);


-- ============================================
-- PART 2: Sponsors (Company Profiles)
-- ============================================

CREATE TABLE IF NOT EXISTS sponsors (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),

    -- Company info
    company_name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    tagline TEXT NOT NULL,
    website_url TEXT NOT NULL,

    -- Contact (captured from Stripe checkout)
    contact_email TEXT,

    -- Optional discount offering
    discount_code TEXT,
    discount_description TEXT,

    -- Status workflow: pending -> active -> (paused/expired/cancelled)
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'active', 'paused', 'expired', 'cancelled')),

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activated_at TIMESTAMP,                         -- When first approved/went live
    expires_at TIMESTAMP                            -- For one-time sponsorships
);

CREATE INDEX IF NOT EXISTS idx_sponsors_status ON sponsors(status);
CREATE INDEX IF NOT EXISTS idx_sponsors_expires_at ON sponsors(expires_at);


-- ============================================
-- PART 3: Sponsor Subscriptions (Stripe tracking)
-- ============================================

CREATE TABLE IF NOT EXISTS sponsor_subscriptions (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    sponsor_id TEXT NOT NULL,
    tier_id TEXT NOT NULL,

    -- Billing type
    billing_type TEXT NOT NULL CHECK(billing_type IN ('monthly', 'yearly', 'one_time')),

    -- Stripe references
    stripe_subscription_id TEXT UNIQUE,             -- NULL for one-time payments
    stripe_customer_id TEXT,
    stripe_checkout_session_id TEXT,

    -- Payment details
    amount_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',

    -- Subscription status (mirrors Stripe subscription status)
    status TEXT NOT NULL DEFAULT 'incomplete' CHECK(status IN (
        'incomplete',           -- Checkout started
        'incomplete_expired',   -- Checkout expired
        'active',               -- Paid and active
        'past_due',             -- Payment failed, retrying
        'canceled',             -- Cancelled by user or admin
        'unpaid',               -- All retry attempts failed
        'trialing',             -- In trial period (if applicable)
        'paused'                -- Paused (if applicable)
    )),

    -- Subscription period
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,

    -- Cancellation
    cancelled_at TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT 0,

    -- Additional data
    metadata TEXT,                                  -- JSON for any extra data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (sponsor_id) REFERENCES sponsors(id) ON DELETE CASCADE,
    FOREIGN KEY (tier_id) REFERENCES sponsor_tiers(id)
);

CREATE INDEX IF NOT EXISTS idx_sponsor_subscriptions_sponsor ON sponsor_subscriptions(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_sponsor_subscriptions_status ON sponsor_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_sponsor_subscriptions_stripe_sub ON sponsor_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_sponsor_subscriptions_stripe_session ON sponsor_subscriptions(stripe_checkout_session_id);


-- ============================================
-- PART 4: Sponsor Payments (Payment History)
-- ============================================

CREATE TABLE IF NOT EXISTS sponsor_payments (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    sponsor_id TEXT NOT NULL,
    subscription_id TEXT,                           -- Links to sponsor_subscriptions

    -- Stripe references
    stripe_payment_intent_id TEXT UNIQUE,
    stripe_invoice_id TEXT,

    -- Payment details
    amount_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'succeeded', 'failed', 'refunded')),

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,

    -- Additional data
    metadata TEXT,                                  -- JSON for any extra data

    FOREIGN KEY (sponsor_id) REFERENCES sponsors(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES sponsor_subscriptions(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_sponsor_payments_sponsor ON sponsor_payments(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_sponsor_payments_subscription ON sponsor_payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_sponsor_payments_status ON sponsor_payments(status);


-- ============================================
-- PART 5: Active Sponsors View
-- ============================================

-- View for displaying active sponsors with their tier info
-- Used by sidebar and feed components
CREATE VIEW IF NOT EXISTS active_sponsors AS
SELECT
    s.id,
    s.company_name,
    s.logo_url,
    s.tagline,
    s.website_url,
    s.discount_code,
    s.discount_description,
    s.status,
    s.activated_at,
    s.expires_at,
    t.name as tier_name,
    t.display_name as tier_display_name,
    t.logo_size,
    t.show_in_feed,
    t.show_in_sidebar,
    sub.billing_type,
    sub.current_period_end
FROM sponsors s
JOIN sponsor_subscriptions sub ON s.id = sub.sponsor_id
JOIN sponsor_tiers t ON sub.tier_id = t.id
WHERE s.status = 'active'
  AND sub.status = 'active'
  AND (s.expires_at IS NULL OR s.expires_at > CURRENT_TIMESTAMP)
ORDER BY t.sort_order DESC, s.activated_at ASC;


-- ============================================
-- PART 6: Triggers
-- ============================================

-- Update sponsors.updated_at on any change
CREATE TRIGGER IF NOT EXISTS sponsors_updated_at
AFTER UPDATE ON sponsors
BEGIN
    UPDATE sponsors SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Update sponsor_subscriptions.updated_at on any change
CREATE TRIGGER IF NOT EXISTS sponsor_subscriptions_updated_at
AFTER UPDATE ON sponsor_subscriptions
BEGIN
    UPDATE sponsor_subscriptions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
