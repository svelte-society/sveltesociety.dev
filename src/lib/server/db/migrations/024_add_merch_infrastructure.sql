-- Add stripe_customer_id to users table
ALTER TABLE users ADD COLUMN stripe_customer_id TEXT;
CREATE UNIQUE INDEX idx_users_stripe_customer ON users(stripe_customer_id);

-- Product catalog
CREATE TABLE merch_products (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    body TEXT,
    rendered_body TEXT,
    base_price_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    images TEXT,
    variant_options TEXT,
    stripe_product_id TEXT,
    active BOOLEAN NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE merch_variants (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    product_id TEXT NOT NULL,
    option_values TEXT NOT NULL,
    label TEXT NOT NULL,
    styria_product_code TEXT,
    stripe_price_id TEXT,
    price_cents INTEGER,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    sku TEXT UNIQUE,
    active BOOLEAN NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES merch_products(id) ON DELETE CASCADE
);

-- Fulfillment bridge (Stripe -> Styria)
CREATE TABLE merch_fulfillments (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    stripe_checkout_session_id TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL,
    styria_order_id TEXT,
    fulfillment_status TEXT NOT NULL DEFAULT 'pending' CHECK(fulfillment_status IN (
        'pending',
        'submitted',
        'in_production',
        'shipped',
        'delivered',
        'cancelled',
        'refunded'
    )),
    shipping_tracking_number TEXT,
    metadata TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_merch_variants_product ON merch_variants(product_id);
CREATE INDEX idx_merch_fulfillments_user ON merch_fulfillments(user_id);
CREATE INDEX idx_merch_fulfillments_stripe ON merch_fulfillments(stripe_checkout_session_id);
CREATE INDEX idx_merch_fulfillments_status ON merch_fulfillments(fulfillment_status);
CREATE INDEX idx_merch_products_slug ON merch_products(slug);
