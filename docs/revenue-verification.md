# Revenue verification runbook

Last reviewed: 2026-08-17

## Production configuration audit

The Vercel production project contains the existing Anthropic, Redis, entitlement, and Stripe variable names. As of July 12, 2026, all required revenue variable names are present and encrypted:

- `STRIPE_PRICE_PER_USE`
- `STRIPE_PRICE_MONTHLY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL`

The variable names were audited without printing their secret values. The July
12, 2026 live Checkout check documented below confirmed that the monthly mapping
then resolved to the intended active product and amount; this August review did
not reverify external configuration.

## Stripe sandbox setup completed

- created one active, one-time USD price for exactly $4.99
- created one active, monthly USD price for exactly $49.00
- mapped both price identifiers to the pull-request preview branch only
- verified the customer portal creates a management session for a server-verified subscriber
- created a temporary refund webhook subscribed only to `charge.refunded` and `refund.created`
- verified its signature and duplicate-delivery handling against the local branch, then removed the temporary destination to prevent retries against Vercel's protected preview

No live-mode Stripe value or production Vercel variable was changed.

## Verified automatically

- checkout accepts only the two server-configured Stripe price identifiers
- success and cancellation URLs cannot be replaced with a caller-supplied origin
- unpaid, expired, unrelated, and refunded sessions do not authorize analysis
- checkout return cookies are Secure and HttpOnly and are created only after Stripe verification
- one paid session cannot be used twice or concurrently
- failed AI delivery releases rather than consumes a paid credit
- cancelled subscriptions fail server verification
- subscription usage is capped atomically on the server
- pay-per-use access is derived from current Stripe Charge and Refund state at
  checkout confirmation and before every paid analysis
- a successful full pay-per-use refund revokes the credit, an in-flight full
  refund freezes it, and a partial refund does not revoke it
- signed refund webhooks validate and acknowledge events without mutating
  entitlement state, so duplicate and out-of-order delivery cannot change access
- paid subscription access requires a current MBR Subscription with Stripe
  status `active` and `pause_collection` unset; see `docs/refund-operations.md`
  for the required coupled cancellation-and-refund procedure
- billing portal sessions require a server-issued subscription cookie
- no Google Analytics conversion events are sent; authoritative purchase and refund evidence comes from Stripe

## Historical live production checks completed (July 12, 2026)

Using a synthetic document containing no medical or identifying information:

- direct analysis without entitlement returned `401`
- free entitlement issuance returned `200`
- first free analysis returned `200`
- replaying the same free entitlement returned `401`
- an owner-verification $4.99 purchase returned through server confirmation,
  delivered one synthetic analysis, and was refunded; this was not customer
  demand or retained revenue
- the production refund event was accepted by the then-current webhook and the
  paid entitlement was revoked; the current implementation instead derives
  access from live Charge and Refund state
- the $49 subscription button opened a live Stripe Checkout for “Medical Bill Reader Monthly” at exactly $49 per month with a 44-analysis description
- the $49 Checkout was exited through its cancellation URL without entering payment information, creating a charge, or granting an entitlement
- the expired Cookiebot dependency was removed; Google Analytics is now disabled site-wide for the strict-YMYL release
- Microsoft Clarity session recording and the inactive AdSense loader were removed to reduce health-data privacy risk

## Stripe sandbox matrix completed

Using Stripe sandbox cards and a generated image containing no patient or medical information:

- the $4.99 Checkout completed and returned through the server confirmation route
- the server accepted the paid entitlement and delivered one Anthropic analysis
- Stripe marked the paid credit used only after successful delivery
- replaying the paid entitlement returned `401`
- the $49 subscription Checkout completed with active status and a server cap of 44 analyses
- a seeded usage count of 44 caused request 45 to return `401`; the temporary usage key was removed after the check
- the billing portal created a valid Stripe portal session
- cancelling the test subscription changed its status to cancelled and subsequent analysis returned `401`
- Stripe's decline card remained unpaid and produced no entitlement
- leaving the declined Checkout returned to the cancellation URL and still produced no entitlement
- a full test refund generated a real `refund.created` event
- the signed refund event was accepted by the then-current webhook, marked the
  PaymentIntent refunded, and safely acknowledged a duplicate; the current
  webhook is acknowledgement-only and current Refund objects are authoritative
- local logs contained neither the synthetic document marker nor base64 upload data
- automated tests prevent third-party analytics from running on analyzer, pricing, checkout, contact, and privacy-sensitive routes

Expired, unrelated, malformed, and concurrent entitlement cases remain covered by the automated suite because Stripe does not offer a practical dashboard flow for every adversarial state.

## Priority 1 closeout

Medical Bill Reader's revenue-verification milestone is complete:

- production price mappings and webhook configuration were present in the
  July 12, 2026 audit snapshot; this August 17 documentation update did not
  reverify external configuration
- the $4.99 owner-verification purchase-delivery-refund path was verified; it is
  not evidence of customer demand or retained revenue
- the $49 path was verified in Stripe sandbox through delivery, cap enforcement, portal access, cancellation, and post-cancellation denial
- the live $49 product mapping and cancellation return were verified without an unnecessary charge
- revenue events are not forwarded to Google Analytics; use Stripe records for purchase, subscription, cancellation, and refund verification

Third-party analytics is disabled for the strict-YMYL release. Do not infer traffic or conversion counts from an unavailable analytics dashboard, and do not re-enable analytics or forward sensitive funnel events without a new privacy review and regression tests. Revenue claims require current Stripe or other authoritative transaction evidence.
