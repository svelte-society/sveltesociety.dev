-- Migration: Move merch products/variants to Stripe as source of truth
-- Drop SQLite product/variant tables and recreate cart without foreign keys to them

-- Preserve cart data by recreating without product/variant FKs
DROP TABLE IF EXISTS merch_cart_items;

CREATE TABLE merch_cart_items (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    variant_id TEXT NOT NULL,
    product_title TEXT NOT NULL,
    variant_label TEXT NOT NULL,
    image TEXT NOT NULL DEFAULT '',
    price_cents INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, variant_id)
);
CREATE INDEX idx_merch_cart_items_user ON merch_cart_items(user_id);

-- Drop product/variant tables (data now lives in Stripe)
DROP TABLE IF EXISTS merch_variants;
DROP TABLE IF EXISTS merch_products;
