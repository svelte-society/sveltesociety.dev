# Merch Store Implementation Plan

## Context

SvelteSociety.dev needs a merch store. Rather than making merch a content type (which would add latency and complexity to the content system), merch lives as its own standalone section with custom pages. Product catalog is stored locally for fast browsing. Stripe handles checkout, shipping address collection, and order history. Styria Shirts handles fulfillment. Login is required to purchase.

### Key Design Decisions

- **Not a content type** — merch is standalone, avoiding content table migrations and keeping the content system untouched
- **Stripe-heavy** — Stripe manages Products/Prices, checkout, shipping address collection, and order history (source of truth for orders)
- **Orama search index** — products indexed in-memory at startup for instant search/filter (same pattern as content SearchService)
- **Login required** — orders linked to user_id, order history via "My Orders" page
- **Styria Shirts** — fulfillment partner, orders submitted via their API, status synced manually by admins
- **Local DB stores**: product catalog (for fast display), variant-to-Styria mappings, fulfillment tracking bridge

---

## 1. Database Migration (`024_add_merch_infrastructure.sql`)

**File**: `src/lib/server/db/migrations/024_add_merch_infrastructure.sql`

No content table changes needed — merch is standalone.

### 1a. Add `stripe_customer_id` to users table

```sql
ALTER TABLE users ADD COLUMN stripe_customer_id TEXT;
CREATE UNIQUE INDEX idx_users_stripe_customer ON users(stripe_customer_id);
```

### 1b. Product catalog tables

```sql
CREATE TABLE merch_products (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    body TEXT,                 -- Rich description (markdown)
    rendered_body TEXT,        -- HTML
    base_price_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    images TEXT,               -- JSON array of image URLs
    variant_options TEXT,      -- JSON: [{"name":"Size","values":["S","M","L","XL"]},{"name":"Color","values":["Black","White"]}]
    stripe_product_id TEXT,    -- Stripe Product ID
    active BOOLEAN NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE merch_variants (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    product_id TEXT NOT NULL,
    option_values TEXT NOT NULL,       -- JSON: {"Size":"M","Color":"Black"}
    label TEXT NOT NULL,               -- Display: "M / Black"
    styria_product_code TEXT,          -- Styria Shirts product code
    stripe_price_id TEXT,              -- Stripe Price ID
    price_cents INTEGER,              -- Override price (NULL = use product base_price_cents)
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    sku TEXT UNIQUE,
    active BOOLEAN NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES merch_products(id) ON DELETE CASCADE
);
```

### 1c. Fulfillment bridge (Stripe -> Styria)

```sql
CREATE TABLE merch_fulfillments (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    stripe_checkout_session_id TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL,
    styria_order_id TEXT,
    fulfillment_status TEXT NOT NULL DEFAULT 'pending' CHECK(fulfillment_status IN (
        'pending',           -- Payment received, not yet sent to Styria
        'submitted',         -- Sent to Styria Shirts
        'in_production',     -- Styria: in progress / printing
        'shipped',           -- Styria: shipped
        'delivered',         -- Confirmed delivered
        'cancelled',
        'refunded'
    )),
    shipping_tracking_number TEXT,
    metadata TEXT,            -- JSON for extra data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 1d. Indexes

```sql
CREATE INDEX idx_merch_variants_product ON merch_variants(product_id);
CREATE INDEX idx_merch_fulfillments_user ON merch_fulfillments(user_id);
CREATE INDEX idx_merch_fulfillments_stripe ON merch_fulfillments(stripe_checkout_session_id);
CREATE INDEX idx_merch_fulfillments_status ON merch_fulfillments(fulfillment_status);
CREATE INDEX idx_merch_products_slug ON merch_products(slug);
```

---

## 2. Service Layer

### 2a. `MerchSearchService` (`src/lib/server/services/merch/search.ts`)

Orama-based search index for merch products, following the exact pattern of `SearchService` (`src/lib/server/services/search.ts`):

**On startup**: Loads all active products + variants from SQLite into Orama for instant search/filter:
```typescript
const merchSchema = {
    id: 'string',
    title: 'string',
    description: 'string',
    slug: 'string',
    base_price_cents: 'number',
    min_price_cents: 'number',    // Cheapest variant price
    max_price_cents: 'number',    // Most expensive variant price
    currency: 'string',
    images: 'string[]',
    variant_count: 'number',
    in_stock: 'boolean',          // true if any variant has stock > 0
    active: 'boolean',
    created_at: 'string',
    updated_at: 'string'
} as const
```

**Methods** (mirror SearchService pattern):
- Constructor: creates Orama instance, queries `merch_products` + `merch_variants` from DB, inserts all
- `search(filters?)` — search with text query, sort by price/date, filter by in_stock
- `getById(id)` — single product from index
- `add(product)` — insert into index (called after admin creates product)
- `update(id, product)` — update in index (called after admin updates product/variants)
- `remove(id)` — remove from index (called after admin deletes product)
- `reindex()` — full rebuild from DB (called as fallback)

**Integration points** — MerchProductService calls search service methods after mutations:
- `createProduct()` -> `merchSearchService.add()`
- `updateProduct()` / `createVariant()` / `updateVariant()` / `deleteVariant()` -> `merchSearchService.update()`
- `deleteProduct()` -> `merchSearchService.remove()`

### 2b. `MerchProductService` (`src/lib/server/services/merch/product.ts`)

Constructor: `new MerchProductService(db, merchSearchService)` — mirrors `ContentService(db, searchService)` pattern.

CRUD for products + variants (each mutation updates the search index):
- `createProduct(data)` — insert into merch_products, update search index
- `getProductById(id)` — product with variants (from DB for full data)
- `getProductBySlug(slug)` — for public detail page (from DB)
- `getAllProducts(filters?)` — admin listing (from DB)
- `updateProduct(id, data)` — update product, update search index
- `deleteProduct(id)` — cascade deletes variants, remove from search index
- `createVariant(productId, data)` — add variant, update parent in search index
- `updateVariant(variantId, data)` — update variant, update parent in search index
- `deleteVariant(variantId)` — remove variant, update parent in search index
- `getVariantById(variantId)` — single variant
- `getVariantsByProductId(productId)` — all variants
- `decrementStock(variantId, quantity)` — reduce stock, update parent in search index

### 2c. `MerchFulfillmentService` (`src/lib/server/services/merch/fulfillment.ts`)

Fulfillment tracking:
- `createFulfillment(stripeSessionId, userId)` — create record
- `getByStripeSessionId(sessionId)` — for webhook handling
- `getByUserId(userId)` — user's fulfillments (joined with Stripe data)
- `setStyriaOrderId(id, styriaOrderId)` — link to Styria
- `updateStatus(id, status)` — status transitions
- `setTrackingNumber(id, trackingNumber)` — set tracking
- `getActiveFulfillments()` — admin: all non-terminal fulfillments
- `getAllFulfillments(filters?)` — admin listing

### 2d. `StyriashirtsService` (`src/lib/server/services/merch/styriashirts.ts`)

Styria Shirts API client (singleton, no DB dependency):
- Constructor uses `STYRIA_APP_ID` and `STYRIA_SECRET_KEY` env vars
- `createOrder(orderData)` — POST /api/orders.php
- `getOrder(orderId)` — GET /api/order.php?id=X
- `listOrders(filters?)` — GET /api/orders.php
- Private `sign(body)` — SHA1(body + secretKey)
- Private `request(method, path, body?)` — handles auth + JSON format

### 2e. Index + registration

**File**: `src/lib/server/services/merch/index.ts` — barrel export

**Files to update**:
- `src/hooks/attach_services.ts`:
  - `merchSearchService = new MerchSearchService(db)` (loads products into Orama on startup)
  - `merchProductService = new MerchProductService(db, merchSearchService)` (passes search service)
  - `merchFulfillmentService = new MerchFulfillmentService(db)`
  - `styriashirtsService = new StyriashirtsService()` (singleton, like stripeService)
  - Attach all four to `event.locals`
- `src/app.d.ts` — add `merchSearchService`, `merchProductService`, `merchFulfillmentService`, `styriashirtsService` to `App.Locals`

---

## 3. Stripe Integration

### 3a. Extend `ProductType`

**File**: `src/lib/server/services/payments/types.ts`
- Add `'merch'` to `ProductType`: `'job' | 'sponsor' | 'merch'`

### 3b. New methods on StripeService

**File**: `src/lib/server/services/payments/stripe.ts`

```typescript
// Create Stripe Product for a merch item
async createStripeProduct(product: { title: string, description?: string, images?: string[] }): Promise<string>

// Create Stripe Price for a variant (linked to Stripe Product)
async createStripePrice(stripeProductId: string, priceCents: number, currency: string): Promise<string>

// Create checkout session with multiple line items + shipping collection
async createMerchCheckoutSession(params: {
    lineItems: Array<{ stripePriceId: string, quantity: number }>
    customerId: string           // Stripe Customer (linked to user)
    successUrl: string
    cancelUrl: string
    metadata: Record<string, string>
}): Promise<CheckoutSessionResult>

// Customer management
async createCustomer(email: string, name?: string): Promise<string>

// List checkout sessions for a customer (order history)
async listCustomerSessions(customerId: string, limit?: number): Promise<Stripe.Checkout.Session[]>

// Retrieve session with line items expanded
async getSessionWithLineItems(sessionId: string): Promise<Stripe.Checkout.Session>
```

### 3c. User service extension

**File**: `src/lib/server/services/user.ts`
- Add `setStripeCustomerId(userId: string, customerId: string)` method
- Existing user model already returned by `getUserById()` — just need the column

### 3d. Webhook handler

**File**: `src/routes/(api)/api/webhooks/stripe/+server.ts`

Add `'merch'` branch in `checkout.session.completed`:
```typescript
if (productType === 'merch') {
    await handleMerchCheckoutCompleted(session, locals)
}
```

`handleMerchCheckoutCompleted(session, locals)`:
1. Create fulfillment record (stripe_session_id, user_id from metadata)
2. Decrement stock for each variant (variant IDs in metadata)
3. Build Styria order from session line items + shipping details
4. Submit to Styria Shirts API
5. Update fulfillment: status -> 'submitted', store styria_order_id
6. Send confirmation email with link to /merch/orders

---

## 4. Public Routes

### 4a. Navigation

**File**: `src/routes/(app)/+layout.svelte`
- Add `{ name: 'Merch', href: '/merch' }` under the "OTHER" section (after Jobs)

### 4b. Store listing page

**File**: `src/routes/(app)/(public)/merch/+page.svelte` (new)
- Grid of product cards with images, titles, prices
- Search/filter support (text search, price sort, in-stock filter)
- Links to product detail pages

**File**: `src/routes/(app)/(public)/merch/data.remote.ts` (new)
- `getProducts(filters?)` — queries `merchSearchService.search()` for instant results (text search, sort, pagination)
- Returns product cards with price ranges, stock status, images — all from Orama index, no DB hit

### 4c. Product detail page

**File**: `src/routes/(app)/(public)/merch/[slug]/+page.svelte` (new)
- Product images, description, rendered body
- Variant selector (dropdowns for each variant dimension)
- Price display (updates based on selected variant)
- Stock indicator
- "Add to Cart" button
- Requires login check for cart actions

**File**: `src/routes/(app)/(public)/merch/[slug]/data.remote.ts` (new)
- `getProduct(slug)` — product with all variants

### 4d. Cart (client-side localStorage)

**File**: `src/lib/stores/cart.svelte.ts` (new)

Svelte 5 runes-based cart store:
```typescript
// Cart item shape:
// { productId, variantId, productTitle, variantLabel, image, priceCents, stripePriceId, quantity }
//
// Persisted to localStorage
// Methods: addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount
```

### 4e. Cart page

**File**: `src/routes/(app)/(public)/merch/cart/+page.svelte` (new)
- Displays cart items with quantities, prices, subtotal
- Requires login (redirect if not authenticated)
- "Checkout" button -> calls remote function -> redirects to Stripe

**File**: `src/routes/(app)/(public)/merch/cart/cart.remote.ts` (new)
- `createMerchCheckout(cartItems)` remote function:
  1. Verify user is logged in
  2. Validate cart items against DB (check stock, verify stripe_price_ids exist)
  3. Get or create Stripe Customer for user -> save stripe_customer_id on user
  4. Create Stripe checkout session with line items + shipping_address_collection
  5. Return Stripe checkout URL

### 4f. Checkout success page

**File**: `src/routes/(app)/(public)/merch/checkout/success/+page.svelte` (new)
- Retrieves session from URL param, confirms payment
- Shows order summary
- Links to "My Orders"
- Clears cart from localStorage

### 4g. My Orders

**File**: `src/routes/(app)/(public)/merch/orders/+page.svelte` (new)
- Requires login
- Fetches order history from Stripe (via user's stripe_customer_id)
- Joins with local fulfillment data (Styria status + tracking)
- Displays list: date, items summary, total, payment status, fulfillment status

**File**: `src/routes/(app)/(public)/merch/orders/[session_id]/+page.svelte` (new)
- Order detail: line items (from Stripe), shipping address (from Stripe), fulfillment status + tracking (from local DB)
- Requires login + ownership check (session.customer matches user's stripe_customer_id)

**File**: `src/routes/(app)/(public)/merch/orders/data.remote.ts` (new)
- `getMyOrders()` — list Stripe sessions + join fulfillments
- `getMyOrder(sessionId)` — single order detail

---

## 5. Admin Routes

### 5a. Admin navigation

**File**: `src/routes/(admin)/admin/+layout.svelte`
- Add merch link: `{ href: '/admin/merch', label: 'Merch', icon: ShoppingBag, allowedRoles: ['admin'] }`

### 5b. Product management

**Files**:
- `src/routes/(admin)/admin/merch/+page.svelte` — Product list table
- `src/routes/(admin)/admin/merch/new/+page.svelte` — Create product form (title, description, body, images, price, variant options)
- `src/routes/(admin)/admin/merch/[id]/+page.svelte` — Edit product + inline variant editor (add/edit/delete variants, set Styria codes, stock, prices)
- `src/routes/(admin)/admin/merch/data.remote.ts`:
  - `getMerchProducts(filters)` — list with search/active filter
  - `getMerchProduct(id)` — single product with variants
  - `createMerchProduct(data)` — creates local product + Stripe Product + Stripe Prices per variant
  - `updateMerchProduct(data)` — updates product (creates new Stripe Prices if price changed)
  - `createVariant(data)` / `updateVariant(data)` / `deleteVariant(data)` — variant CRUD + Stripe Price sync
  - `toggleProductActive(id)` — activate/deactivate

### 5c. Order/fulfillment management

**Files**:
- `src/routes/(admin)/admin/merch/orders/+page.svelte` — Fulfillment list with status filters
- `src/routes/(admin)/admin/merch/orders/[id]/+page.svelte` — Fulfillment detail (Stripe session data + Styria status)
- `src/routes/(admin)/admin/merch/orders/data.remote.ts`:
  - `getMerchFulfillments(filters)` — list with status filter
  - `getMerchFulfillment(id)` — detail with Stripe session data
  - `syncStyriaStatus(id)` — pull status from Styria API
  - `syncAllActiveFulfillments()` — batch sync all non-terminal
  - `cancelOrder(id)` — cancel + refund via Stripe

---

## 6. Styria Shirts Order Sync

Admin-triggered (no webhooks from Styria):
- "Sync Status" button on individual fulfillment detail
- "Sync All" button on fulfillment list (updates all non-terminal orders)
- Maps Styria statuses -> local fulfillment_status:
  - `received` / `in progress` -> `submitted`
  - `printing` / `quality control` -> `in_production`
  - `shipped` -> `shipped` (also captures tracking number)

---

## 7. Files Summary

### New files (24)

| File | Purpose |
|------|---------|
| `src/lib/server/db/migrations/024_add_merch_infrastructure.sql` | DB migration |
| `src/lib/server/services/merch/index.ts` | Service barrel export |
| `src/lib/server/services/merch/search.ts` | MerchSearchService (Orama index) |
| `src/lib/server/services/merch/product.ts` | MerchProductService |
| `src/lib/server/services/merch/fulfillment.ts` | MerchFulfillmentService |
| `src/lib/server/services/merch/styriashirts.ts` | Styria Shirts API client |
| `src/lib/stores/cart.svelte.ts` | Client-side cart store |
| `src/routes/(app)/(public)/merch/+page.svelte` | Store listing |
| `src/routes/(app)/(public)/merch/data.remote.ts` | Store data queries |
| `src/routes/(app)/(public)/merch/[slug]/+page.svelte` | Product detail |
| `src/routes/(app)/(public)/merch/[slug]/data.remote.ts` | Product detail queries |
| `src/routes/(app)/(public)/merch/cart/+page.svelte` | Cart page |
| `src/routes/(app)/(public)/merch/cart/cart.remote.ts` | Cart checkout |
| `src/routes/(app)/(public)/merch/checkout/success/+page.svelte` | Checkout success |
| `src/routes/(app)/(public)/merch/orders/+page.svelte` | My Orders |
| `src/routes/(app)/(public)/merch/orders/[session_id]/+page.svelte` | Order detail |
| `src/routes/(app)/(public)/merch/orders/data.remote.ts` | Order data queries |
| `src/routes/(admin)/admin/merch/+page.svelte` | Admin product list |
| `src/routes/(admin)/admin/merch/new/+page.svelte` | Admin create product |
| `src/routes/(admin)/admin/merch/[id]/+page.svelte` | Admin edit product + variants |
| `src/routes/(admin)/admin/merch/data.remote.ts` | Admin product remote functions |
| `src/routes/(admin)/admin/merch/orders/+page.svelte` | Admin fulfillment list |
| `src/routes/(admin)/admin/merch/orders/[id]/+page.svelte` | Admin fulfillment detail |
| `src/routes/(admin)/admin/merch/orders/data.remote.ts` | Admin fulfillment remote functions |

### Modified files (8)

| File | Change |
|------|--------|
| `src/routes/(app)/+layout.svelte` | Add "Merch" to nav links |
| `src/routes/(admin)/admin/+layout.svelte` | Add merch to admin nav |
| `src/hooks/attach_services.ts` | Register merch services |
| `src/app.d.ts` | Add merch services to Locals |
| `src/lib/server/services/payments/types.ts` | Add 'merch' to ProductType |
| `src/lib/server/services/payments/stripe.ts` | Add merch checkout + customer + product/price methods |
| `src/lib/server/services/user.ts` | Add setStripeCustomerId method |
| `src/routes/(api)/api/webhooks/stripe/+server.ts` | Handle merch checkout events |

---

## 8. Implementation Order

1. **Database migration** — merch tables + stripe_customer_id on users
2. **Service layer** — MerchSearchService, MerchProductService, MerchFulfillmentService, StyriashirtsService
3. **Service registration** — attach_services.ts + app.d.ts
4. **Stripe extensions** — ProductType, merch checkout, customer mgmt, product/price creation
5. **User service** — stripe_customer_id getter/setter
6. **Admin: Products** — CRUD pages with Stripe Product/Price sync
7. **Public: Store** — Listing page + product detail with variant selector
8. **Cart** — Client-side store + cart page
9. **Checkout flow** — Cart -> Stripe session -> success page
10. **Webhook** — Handle merch payment -> create fulfillment -> submit to Styria
11. **My Orders** — User order history from Stripe + fulfillment status
12. **Admin: Fulfillments** — Order list, detail, Styria sync
13. **E2E tests** — Playwright tests for merch flows

---

## 9. Verification

1. **Run migration**: `bun run db:migrate`
2. **Type check**: `bun run agent:check`
3. **Lint**: `bun run agent:lint`
4. **Admin product flow**: Create product with variants at /admin/merch/new, verify Stripe Product + Prices created
5. **Public store**: Browse /merch, click product, select variant, add to cart
6. **Cart + checkout**: View cart, click checkout (Stripe test mode), verify redirect + payment
7. **Webhook**: Verify fulfillment record created, Styria order submitted
8. **My Orders**: Visit /merch/orders, verify order from Stripe API + fulfillment status
9. **Admin orders**: Visit /admin/merch/orders, sync Styria status
10. **E2E tests**: `bun run agent:e2e`
