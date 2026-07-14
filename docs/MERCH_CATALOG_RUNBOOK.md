# Merch Catalog Runbook

Stripe Dashboard is the only place to create or update merch products and prices. The application reads this catalog and does not expose product-management routes.

## Product Contract

Create a Stripe Product for each merch design and set:

- `name`, `description`, and customer-facing `images`
- `marketing_features` for short product highlights
- `active=true` only while the product can be purchased
- The Stripe Tax code for the applicable physical good
- Metadata `product_type=merch`
- Metadata `slug` with a unique, URL-safe value
- Metadata `sort_order` with an integer value
- Metadata `variant_options` as compact JSON, for example `[{"name":"Size","values":["S","M"]}]`
- Either metadata `size_guide` as compact JSON or `size_guide_url`
- Metadata `design_data` as compact JSON when the Styria product number does not fully identify the standard design

Keep every Stripe metadata value within Stripe's 500-character limit.

## Price Contract

Create one Stripe Price for every purchasable variant and set:

- A one-time EUR amount stored as the €20 net amount in integer cents
- `tax_behavior=exclusive`
- `active=true` only while the variant can be purchased
- Metadata `label` with the customer-facing variant name
- Metadata `option_values` as compact JSON, for example `{"Size":"M"}`
- Metadata `sort_order` with an integer value
- Metadata `sku` with Svelte Society's unique SKU
- Metadata `pn` with Styria's product number

Do not edit fulfillment metadata on a Price after it has been used in an order. Create a replacement Price, validate it, activate it, and archive the old Price instead.

## Publishing Checklist

1. Confirm the Product and all intended Prices are active.
2. Confirm every Price is one-time, EUR, tax-exclusive, and has `label`, `option_values`, `sku`, `pn`, and `sort_order` metadata.
3. Confirm the Product has the physical-goods tax code and required metadata.
4. Open the storefront and verify the title, images, variants, order, and displayed VAT-inclusive price.
5. Complete a Stripe test Checkout before making a new product publicly available.

Archive a Price or Product in Stripe to remove it from future catalog refreshes. Existing paid orders retain the Stripe objects and metadata used at purchase time.
