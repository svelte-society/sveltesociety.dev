# Stripe Setup for Job Board Payments

This document describes the Stripe integration for paid job postings.

## Current Status

**Test Mode** - The job board is currently configured with Stripe test keys.

## Environment Variables

```bash
STRIPE_SECRET_KEY=                  # Stripe secret key (sk_test_... or sk_live_...)
STRIPE_WEBHOOK_SECRET=              # Stripe webhook signing secret (whsec_...)
PUBLIC_STRIPE_PUBLISHABLE_KEY=      # Stripe publishable key (pk_test_... or pk_live_...)
```

## Features Enabled

### 1. Stripe Checkout
One-time payments using Stripe Checkout (`mode: 'payment'`).

### 2. Automatic Tax (VAT)
```typescript
automatic_tax: { enabled: true }
```
Automatically calculates VAT based on customer location.

### 3. Tax ID Collection (B2B)
```typescript
tax_id_collection: { enabled: true }
```
Allows businesses to enter their VAT number at checkout. For valid EU VAT numbers, the reverse charge mechanism applies (0% VAT).

### 4. Invoice Creation
```typescript
invoice_creation: { enabled: true }
```
Automatically generates invoices for each payment, which are emailed to customers.

## Production Setup Checklist

Before going live, complete these steps in the Stripe Dashboard:

### 1. Enable Stripe Tax
- Go to: Dashboard → Settings → Tax
- Click "Enable Stripe Tax"

### 2. Add Tax Registration
- Add your Swedish VAT number (if VAT-registered)
- This tells Stripe to collect Swedish VAT (25%) on domestic sales

### 3. Set Origin Address
- Enter your business address in Sweden
- This determines B2B reverse charge rules

### 4. Configure Tax Behavior
Choose how prices are displayed:
- **Exclusive** (recommended): Tax added on top of listed price
  - Example: $99 + $24.75 VAT = $123.75 total
- **Inclusive**: Tax included in listed price
  - Example: $99 total (includes ~$19.80 VAT)

### 5. Update Environment Variables
Replace test keys with live keys:
```bash
STRIPE_SECRET_KEY=sk_live_...
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...  # Create new webhook for production URL
```

### 6. Configure Webhook Endpoint
In Stripe Dashboard → Developers → Webhooks:
- Add endpoint: `https://sveltesociety.dev/api/webhooks/stripe`
- Select events:
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `charge.refunded`

## Tax Handling Summary

| Customer Type | Location | VAT Treatment |
|--------------|----------|---------------|
| Business with valid VAT ID | EU (non-Sweden) | Reverse charge (0%) |
| Business with valid VAT ID | Sweden | 25% Swedish VAT |
| Business without VAT ID | EU | Local VAT rate |
| Consumer | Sweden | 25% Swedish VAT |
| Consumer | Other EU | Local VAT rate |
| Any | Non-EU | No VAT |

## Testing

Use Stripe test mode to verify:
1. Checkout flow works
2. Webhooks are received
3. Invoices are generated
4. Tax calculation appears correct

Test card numbers:
- `4242 4242 4242 4242` - Successful payment
- `4000 0000 0000 0002` - Card declined

## Files

- `src/lib/server/services/jobs/stripe.ts` - Stripe service class
- `src/routes/(api)/api/webhooks/stripe/+server.ts` - Webhook handler
