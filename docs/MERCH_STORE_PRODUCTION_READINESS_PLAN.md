# Minimum Merch Store Production Plan

> **For agentic workers:** Implement this plan checkpoint by checkpoint in one feature PR. Keep checkout disabled until the Production Definition of Done passes.

**Date:** 2026-07-14  
**Branch:** `kevmodrome/add-merch-store`  
**Target:** One draft PR to `staging`, then normal promotion to `main`

## Goal

Launch the existing customer-facing merch store with Stripe as the catalog, commercial order, tax, payment, invoice, and refund system; one SQLite fulfillment bridge; and admin-triggered Styria manufacturing.

## Final Architecture

### Stripe Dashboard

Stripe Dashboard is the only catalog back office. It owns:

- Products, descriptions, images, marketing features, tax codes, and active state
- One EUR Price per purchasable variant
- Variant labels, options, SKU, Styria `pn`, and standard-design metadata
- Price activation/archival and catalog availability
- Payments, invoices, receipts, customer tax IDs, and refunds

There are no in-app product creation, editing, activation, variant, size-guide, or deletion pages.

### SvelteSociety.dev

The application owns:

- Public catalog reads from Stripe with a small lazy in-memory cache
- The existing authenticated cart
- Checkout creation, supported-country enforcement, and pre-Checkout VAT-ID verification
- One local `merch_fulfillments` row per paid Stripe Checkout Session
- Admin order review and the explicit “Submit to Styria” action
- Cached Styria status/tracking and support notes
- Customer order history, tracking email, feature flags, and policy pages

### Styria

Styria owns manufacturing, vendor-payment state, production status, shipment, and tracking. Svelte Society submits each paid order manually from the admin order page, then pays Styria through its existing process.

## Deliberately Not Building

- Local product or Price tables
- In-app catalog administration
- A second local commercial order model
- Separate order-item, event, webhook, job, tax-profile, or refund tables
- Automatic Styria submission from the Stripe webhook
- A fulfillment outbox or retry worker
- Automated returns, replacements, or in-app Stripe refunds
- A custom tax engine, invoice generator, or reconciliation platform
- Guest checkout, discounts, multiple currencies, or additional countries

## Agreed Business Rules

1. Svelte School AB is the merchant of record. Styria manufactures and ships standard, non-personalized designs on demand.
2. Sell in EUR to EU member states except Slovenia, plus the United States.
3. Allowed countries are `AT`, `BE`, `BG`, `HR`, `CY`, `CZ`, `DK`, `EE`, `FI`, `FR`, `DE`, `GR`, `HU`, `IE`, `IT`, `LV`, `LT`, `LU`, `MT`, `NL`, `PL`, `PT`, `RO`, `SK`, `ES`, `SE`, and `US`.
4. Store the example item as a €20 net, tax-exclusive Stripe Price. Display €25 including Swedish 25% VAT by default.
5. US and qualifying verified EU reverse-charge orders pay €20 with zero tax. Invalid, pending, unavailable, inconsistent, domestic, or otherwise non-qualifying VAT IDs receive the normal consumer VAT treatment.
6. Charge €10 shipping once for a one-unit order. Shipping is free for two or more total units, including two of the same product. The €10 amount includes tax where applicable and is unchanged by destination.
7. US customers pay import duty, brokerage, and carrier charges not collected at Checkout.
8. Login is required.
9. Send Stripe's receipt/paid invoice and a Svelte Society order confirmation.
10. Paid orders require admin review, admin submission to Styria, and manual Styria payment.
11. Ambiguous Styria results never retry automatically. Admins reconcile before retrying.
12. Customer order pages refresh stale Styria status. One hourly status task is retained because proactive tracking email is required and Styria documents no webhook.
13. Returns start through `merch@sveltesociety.dev`, require admin approval, and have no self-service UI.
14. Follow EU withdrawal rules for standard-design goods, including standard outbound delivery refunds where required. Refund manually as soon as possible within the statutory deadline.
15. Prefer replacement for damaged/incorrect goods at Svelte Society's cost, with refund or price-reduction fallback where required.
16. Svelte Society may let the customer keep the item. Request a physical return only after approval, with customer-paid postage only where legally permitted.
17. Do not promise that manufacturing can be cancelled after payment. This does not limit statutory remedies.
18. Five business days is an internal support response target, not a public SLA.
19. Catalog access is controlled through Stripe. Application fulfillment, tracking, return, replacement, and refund notes are admin-only.
20. Every return, replacement, and refund records an admin, reason, private notes, and timestamp.
21. Launch behind storefront and checkout flags and complete one monitored real order before public release.

## Stripe Catalog Contract

Document this contract in the operator runbook and validate it when reading Stripe objects.

### Product

- `name`, `description`, `images`, `marketing_features`, `active`, and the appropriate physical-goods `tax_code`
- Metadata: `product_type=merch`, unique `slug`, integer `sort_order`
- Metadata for standard design URLs/placements when the Styria `pn` does not encapsulate the design
- Compact size-guide metadata or a `size_guide_url`; each metadata value must remain within Stripe's 500-character limit

### Price

- One-time EUR Price with integer `unit_amount` in cents
- Explicit `tax_behavior=exclusive`
- Metadata: variant `label`, option values, integer `sort_order`, `sku`, and Styria `pn`
- Treat fulfillment metadata as immutable after the Price is used. Create and activate a replacement Price instead of changing a purchased variant's fulfillment mapping.

The public product service derives variant options and the displayed `net * 1.25` EU price from active Prices. It never trusts client-provided amounts or Styria codes.

## Single Local Table

Create `027_simplify_merch_fulfillments.sql` to rebuild the unlaunched `merch_fulfillments` table without introducing another order table.

### `merch_fulfillments`

- `order_number INTEGER PRIMARY KEY AUTOINCREMENT`; display `SS-{order_number}` and send the number as Styria `external_id`
- `stripe_checkout_session_id TEXT NOT NULL UNIQUE`
- `user_id TEXT NOT NULL`
- Cached `payment_status`
- `fulfillment_status`: `pending_review`, `submitting`, `submitted`, `awaiting_vendor_payment`, `in_production`, `shipped`, `review_required`, `cancelled`, `refunded`
- Styria order ID and raw status
- Tracking number, shipped timestamp, and last synchronized timestamp
- Order-confirmation, admin-alert, and tracking-email timestamps
- Withdrawal-request timestamp and statutory refund deadline
- Last fulfillment error
- `metadata TEXT` containing structured JSON:
  - Cached Stripe summary: Customer, PaymentIntent, invoice, EUR totals, tax treatment, customer email/business/VAT details, and item count
  - Immutable Styria submission payload: shipping name/phone/address and item `pn`, title, charged `retailPrice`, quantity, and design data
  - Append-only support events: type, admin ID, reason, private notes, external reference, and timestamp
- Created and updated timestamps

Use the unique Checkout Session ID for webhook idempotency. No other merch persistence table is required.

## Checkpoint 1: Remove Catalog Administration

**Delete:**

- `src/routes/(admin)/admin/merch/+page.svelte`
- `src/routes/(admin)/admin/merch/new/+page.svelte`
- `src/routes/(admin)/admin/merch/[id]/+page.svelte`
- `src/routes/(admin)/admin/merch/data.remote.ts`
- `src/routes/(admin)/admin/merch/MarketingFeaturesEditor.svelte`
- `src/routes/(admin)/admin/merch/SizeGuideEditor.svelte`
- `src/routes/(admin)/admin/merch/VariantOptionsEditor.svelte`
- `tests/pages/AdminMerchPage.ts`

**Modify:**

- `src/routes/(admin)/admin/+layout.svelte`
- `src/lib/server/services/merch/product.ts`
- `tests/pages/index.ts`
- `tests/e2e/admin/merch.spec.ts`

- [x] Point the admin navigation directly to `/admin/merch/orders` and label it “Merch Orders.”
- [x] Remove Product/Price create, update, activate, and delete methods from `MerchProductService`.
- [x] Keep only Stripe catalog reads and Product/Price parsing.
- [x] Remove product-admin E2E tests and the page-object export. Repurpose the admin merch spec for order/recovery authorization and behavior.
- [x] Update order breadcrumbs so they do not link to the deleted `/admin/merch` catalog page.
- [x] Add a short Stripe Dashboard catalog runbook with the exact Product/Price contract above.

## Checkpoint 2: Make Catalog Reads Non-Blocking

**Modify:**

- `src/hooks/attach_services.ts`
- `src/lib/server/services/merch/product.ts`
- Public merch routes and search service

- [x] Remove blocking catalog initialization from the global request hook.
- [x] Load Stripe merch Products lazily only for public merch requests.
- [x] Add a short TTL to the in-memory catalog and preserve the last successful value when refresh fails.
- [x] Show an explicit catalog-unavailable state when the current process has no cache.
- [ ] Ensure unrelated public, authentication, and admin routes work when Stripe is unavailable.
- [ ] Parse only active Products and Prices matching the documented merch contract. Reject malformed currency, tax behavior, variant, Styria, and metadata values.
- [ ] Calculate displayed EU prices using integer cents and the single 25% rate.

## Checkpoint 3: Tax, Shipping, And Checkout

**Modify:**

- `src/routes/(app)/(public)/merch/cart/+page.svelte`
- `src/routes/(app)/(public)/merch/cart/cart.remote.ts`
- `src/lib/server/services/payments/stripe.ts`
- `.env.example`

- [ ] Require one supported destination before Checkout; reject Slovenia and every unsupported country server-side.
- [ ] Add an optional company name and EU VAT-ID section.
- [ ] Create a dedicated Customer for each merch checkout attempt. Do not reuse `users.stripe_customer_id` because a saved VAT ID could affect unrelated or later personal purchases.
- [ ] For a business checkout, add the tax ID and wait for Stripe/VIES verification. Require consistent legal name/location and an explicit Stripe Tax reverse-charge classification.
- [ ] If verification is invalid, pending, unavailable, inconsistent, domestic, or non-qualifying, use a clean Customer without the tax ID and charge consumer VAT.
- [ ] Keep Checkout tax-ID collection disabled because qualification occurs before Session creation.
- [ ] Validate every cart Price against live/cached server catalog data immediately before creating Checkout.
- [ ] Sum all quantities. Pass one preconfigured €10 inclusive Stripe Shipping Rate for quantity one and one free rate for quantity two or more.
- [ ] Configure the paid rate with Stripe's shipping tax code and explicit inclusive behavior.
- [ ] Create Checkout with Stripe Price IDs, `automatic_tax.enabled=true`, the selected destination as the only allowed shipping country, shipping/phone collection, `invoice_creation.enabled=true`, and metadata containing only `product_type=merch` and `user_id`.
- [ ] Recreate any active merch Price lacking EUR, the correct physical-goods tax code, or explicit exclusive tax behavior.
- [ ] Configure Svelte School AB's tax identity/registrations and the actual Styria ship-from location in Stripe Tax.

**Required example totals:**

- EU consumer, one item: €20 + €5 VAT + €10 shipping = €35
- US, one item: €20 + €0 tax + €10 shipping = €30
- Qualifying reverse charge, one item: €20 + €0 tax + €10 shipping = €30
- Invalid/unavailable VAT ID, one item: normal €35 consumer total
- Any supported destination, two items: free shipping

## Checkpoint 4: Paid Webhook And Manual Styria Submission

**Modify:**

- `src/lib/server/db/migrations/027_simplify_merch_fulfillments.sql`
- `src/routes/(api)/api/webhooks/stripe/+server.ts`
- `src/lib/server/services/merch/fulfillment.ts`
- `src/lib/server/services/merch/styriashirts.ts`
- `src/routes/(admin)/admin/merch/orders/data.remote.ts`
- Admin merch order pages

- [ ] On a paid merch event, retrieve the complete Checkout Session and paginated line items, expanding Price/Product data.
- [ ] Verify `payment_status=paid`, user metadata, EUR currency, allowed destination, tax result, and totals.
- [ ] Build the immutable Styria payload from the paid Session, Price metadata, Product design metadata, and shipping details.
- [ ] Set each Styria `retailPrice` from the actual per-unit customer charge for that order, including consumer VAT where applicable, not from vendor cost.
- [ ] Insert `merch_fulfillments` with `pending_review` using `ON CONFLICT(stripe_checkout_session_id)` idempotency.
- [ ] Return non-2xx when the paid fulfillment row cannot be persisted so Stripe retries the event.
- [ ] Send the customer order confirmation and admin “paid order needs Styria submission” alert after the row is durable, using conditional timestamp updates so webhook/success-page races send each message once.
- [ ] Never call Styria from the Stripe webhook.
- [ ] Rewrite `styriashirts.ts` to the documented query-string `AppId`/`Signature`, SHA1 signing, order payload, response status, tracking, list, and unpaid delete contract.
- [ ] Admin order detail shows paid Session/invoice data, immutable Styria payload, support notes, and a confirmed “Submit to Styria” action.
- [ ] Claim `pending_review` by changing it to `submitting`, then issue one bounded Styria create request.
- [ ] On success, save Styria ID/status, mark `awaiting_vendor_payment`, append an event, and remind the admin to pay Styria.
- [ ] On timeout, connection loss, malformed success, or unexpected response, mark `review_required` and never retry automatically.
- [ ] Reconciliation lists recent Styria orders and compares `external_id`, time, address, and items before enabling retry.
- [ ] Contract-test unpaid deletion because Styria's documentation labels the endpoint `DELETE` but its example shows `GET`.

## Checkpoint 5: Customer Orders, Tracking, And Support

**Modify:**

- `src/routes/(app)/(public)/merch/checkout/success/`
- `src/routes/(app)/(public)/merch/orders/`
- `src/routes/(admin)/admin/merch/orders/`
- `src/lib/server/services/merch/fulfillment.ts`
- New protected status route under `src/routes/(api)/api/merch/status/+server.ts`
- Existing Stripe refund webhook handling

- [ ] Success page retrieves the Session and calls the same idempotent paid-order recorder as the webhook, but never submits to Styria.
- [ ] Verify authenticated ownership and paid state. Never confirm a fake, foreign, or unpaid Session.
- [ ] List orders from local fulfillment rows and retrieve Stripe Session/line-item detail on demand. Use the cached summary if Stripe is temporarily unavailable.
- [ ] Show order reference, payment, items, invoice, fulfillment, tracking, and `merch@sveltesociety.dev`.
- [ ] Refresh non-terminal Styria data on customer view only when older than 15 minutes; serve cached state on failure.
- [ ] Map `received` to awaiting vendor payment; `in progress`, `paid`, `stock allocation`, `printing`, and `quality control` to in production; `internal order query` to review; `refunded` to refunded; and `deleted=true` to cancelled.
- [ ] Infer shipment from `shipping.shiped_at` or `shipping.trackingNumber`, not an undocumented `shipped` status.
- [ ] Add one secret-protected hourly synchronization for non-terminal orders and send tracking email exactly once.
- [ ] Keep single-order and “sync active orders” admin controls.
- [ ] Record withdrawal, damage, incorrect item, replacement, refund, and private notes in the fulfillment metadata event array.
- [ ] Process refunds in Stripe Dashboard and update cached payment state from the Stripe refund webhook.
- [ ] Process replacements manually in Styria and record the replacement reference/cost in metadata.
- [ ] Track withdrawal/refund deadline and alert admins until the manual refund is complete.

## Checkpoint 6: Policy, Configuration, And Operations

**Modify:**

- `.env.example`
- `src/routes/(app)/terms/+page.svelte`
- `src/routes/(app)/privacy/+page.svelte`
- Storefront shipping/returns content
- Deployment/operator documentation

- [ ] Document Styria credentials, paid/free Stripe Shipping Rate IDs, allowed countries, seller tax identity, `merch@sveltesociety.dev`, both feature flags, and status-task secret.
- [ ] Storefront flag hides navigation. Checkout flag blocks new Sessions. Existing orders, webhooks, refunds, and tracking remain active.
- [ ] Publish seller identity, EUR/VAT pricing, countries, shipping, delivery estimate, US import responsibility, withdrawal instructions/model form, defect remedies, and support contact.
- [ ] Do not claim a personalized-goods exception or guaranteed production cancellation.
- [ ] Cover Stripe/Styria data sharing, the existing Styria data-processing agreement, VAT evidence, address retention, access, and log redaction in privacy text.
- [ ] Confirm Styria's parcel invoice/packing slip identifies Svelte School AB and does not conflict with Stripe's invoice.
- [ ] Add structured logs and alerts for paid pending review, Styria review required, awaiting vendor payment, missed status task, withdrawal deadline, and failed email.
- [ ] Write runbooks for Stripe Dashboard catalog management, manual Styria submission/payment, ambiguous result, safe retry, tracking, withdrawal, replacement, refund, and checkout kill switch.

## Test Matrix

### Automated

- Lazy catalog load, TTL, refresh failure, and unrelated-route availability
- Stripe Product/Price parsing and malformed metadata rejection
- €25 display from a €20 exclusive Price
- Exact allowed countries and Slovenia rejection
- One-unit €10 shipping and same/mixed two-unit free shipping
- Verified reverse charge and invalid/pending/unavailable fallback
- Checkout IDs-only metadata and dedicated Customer behavior
- Paid webhook, duplicate webhook, wrong user/amount/currency/country, and persistence failure
- Styria POST/GET signatures and documented payload mapping
- Manual Styria success, explicit error, timeout, ambiguous result, reconciliation, and guarded retry
- Styria status/tracking cache and tracking email exactly once
- Refund webhook, withdrawal deadline, support-event append, and admin authorization
- Storefront/checkout feature flags
- Public storefront, cart, success, and order Playwright flows
- Admin order/recovery Playwright flows; no catalog-admin tests remain

### Contract And Manual

- Stripe test Checkout for EU consumer, US, qualifying VAT ID, invalid VAT ID, one item, and two items
- Inspect receipt/paid invoice identity, VAT ID, reverse charge, tax, and shipping
- Controlled live unpaid Styria create/get/list/delete test because no sandbox exists
- Confirm Styria external ID, manual payment status, tracking, and parcel document
- One monitored production order through payment, manual submission/payment, tracking email, and refund/replacement drill

### Required Commands

```bash
bun run lint
bun run check
bun test src/ tests/unit/
bun run --bun build
bunx playwright test tests/e2e/public/merch.spec.ts tests/e2e/admin/merch.spec.ts
```

All automated tests must run without production Stripe or Styria credentials.

## Single PR And Rollout

Use one draft PR from `kevmodrome/add-merch-store` to `staging`.

1. Complete the six checkpoints with focused commits.
2. Deploy staging with Stripe test mode and fake Styria.
3. Run the separately authorized live unpaid Styria contract test.
4. Deploy production with storefront and checkout disabled.
5. Configure Stripe catalog/tax/invoice/shipping, webhook, Styria credentials, and hourly status task.
6. Verify live Products, Prices, metadata, designs, tax codes, and public display.
7. Enable checkout only for one monitored operator order.
8. Verify payment, invoice, fulfillment row, admin alert, manual Styria submission/payment, tracking email, and support/refund notes.
9. Fix discrepancies, enable public navigation/checkout, and manually monitor every order for the first week.

## Production Definition Of Done

- Stripe Dashboard is the only catalog back office; deleted admin catalog routes are unreachable and unreferenced.
- Unrelated site routes remain operational during Stripe catalog failure.
- €25/€20/€20 pricing and €10/free shipping are proven in Stripe test mode.
- Reverse charge requires verified evidence and Stripe Tax classification.
- Every paid Session maps idempotently to one fulfillment row and an admin alert.
- No Stripe webhook calls Styria.
- Admin submission creates at most one Styria order or enters visible review.
- Every submitted Styria order requiring manual payment is visible.
- Styria contract and controlled live test pass.
- Customers see verified Stripe order data plus local Styria status and receive order/tracking/refund emails.
- Returns, replacements, and refunds use the agreed manual process with admin reason/notes.
- Policies, privacy, configuration, monitoring, runbooks, feature flags, and automated tests pass.
- The monitored production order passes before public release.
- The merchant approves invoice/packing-slip identity, policy text, tax results, and recorded tax risk.

## Primary References

- [Stripe Checkout Sessions](https://docs.stripe.com/api/checkout/sessions)
- [Stripe Checkout line items](https://docs.stripe.com/api/checkout/sessions/line_items)
- [Stripe fulfillment guidance](https://docs.stripe.com/checkout/fulfillment)
- [Stripe Price tax behavior](https://docs.stripe.com/tax/products-prices-tax-codes-tax-behavior)
- [Stripe Checkout automatic tax](https://docs.stripe.com/tax/checkout)
- [Stripe Checkout tax IDs](https://docs.stripe.com/tax/checkout/tax-ids)
- [Stripe customer tax-ID verification](https://docs.stripe.com/billing/customer/tax-ids)
- [Stripe Shipping Rate API](https://docs.stripe.com/api/shipping_rates/create)
- [Styria Shirts API documentation](https://styriashirts.eu/api-documentation)
- [EU distance-selling rules](https://europa.eu/youreurope/business/selling-in-eu/selling-goods-services/ecommerce-distance-selling/index_en.htm)
- [EU consumer guarantees](https://europa.eu/youreurope/citizens/consumers/shopping/guarantees/indexamp_en.htm)
