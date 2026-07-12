# Revenue verification runbook

Last reviewed: 2026-07-12

## Production configuration audit

The Vercel project contains the existing Anthropic, Redis, entitlement, and Stripe variable names. The production `STRIPE_SECRET_KEY` currently resolves to an empty value. These required revenue variables are absent:

- `STRIPE_PRICE_PER_USE`
- `STRIPE_PRICE_MONTHLY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL` (the code safely falls back to the request origin)

No secret values are recorded in this file or in test output.

## Required Stripe test setup

1. Supply a Stripe test secret key.
2. Create or select one active, one-time USD price for exactly $4.99 and assign its `price_...` identifier to `STRIPE_PRICE_PER_USE`.
3. Create or select one active, monthly USD price for exactly $49.00 and assign its `price_...` identifier to `STRIPE_PRICE_MONTHLY`.
4. Configure the Stripe customer portal to allow subscription cancellation.
5. Create a webhook endpoint for `/api/stripe/webhook` and subscribe it to:
   - `checkout.session.completed`
   - `charge.refunded`
   - `refund.created`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
6. Store the webhook signing secret as `STRIPE_WEBHOOK_SECRET`.

Do not add live-mode values until the complete test-mode payment and delivery matrix passes.

## Verified automatically

- checkout accepts only the two server-configured Stripe price identifiers
- success and cancellation URLs cannot be replaced with a caller-supplied origin
- unpaid, expired, unrelated, and refunded sessions do not authorize analysis
- checkout return cookies are Secure and HttpOnly and are created only after Stripe verification
- one paid session cannot be used twice or concurrently
- failed AI delivery releases rather than consumes a paid credit
- cancelled subscriptions fail server verification
- subscription usage is capped atomically on the server
- refund webhooks revoke pay-per-use access
- duplicate webhook events are processed once
- failed webhook processing releases its lock so Stripe can retry
- billing portal sessions require a server-issued subscription cookie
- conversion analytics discard all fields except event name, plan type, and MIME type

## Live production checks completed

Using a synthetic document containing no medical or identifying information:

- direct analysis without entitlement returned `401`
- free entitlement issuance returned `200`
- first free analysis returned `200`
- replaying the same free entitlement returned `401`

## Production-only test matrix still required

- $4.99 test Checkout completes, returns, and delivers exactly one analysis
- $49 test subscription completes, returns, and enforces the monthly cap
- card decline and cancelled Checkout grant no cookie or entitlement
- expired Checkout grants no entitlement
- refund revokes unused pay-per-use access
- portal cancellation stops access when Stripe reports the subscription inactive
- Stripe test webhook retries and duplicate delivery remain idempotent
- consented analytics receive the six conversion events without medical or identifying fields

The pull request must not be merged and no production variables should be changed until Jason approves this matrix and supplies the missing test-mode Stripe configuration.
