# Refund operations

Last reviewed: 2026-08-17

Stripe is the billing source of truth. Refunds require explicit owner approval
and must be performed in Stripe. Never copy payment details, customer records,
medical documents, or health information into this repository, logs, tickets,
or support messages.

## Pay-per-use refunds

The application re-reads the current Stripe Charge and Refund objects at
checkout confirmation and before every paid analysis. A successful full refund
revokes an unused credit. A full refund that is pending or requires action
temporarily freezes the credit. A partial refund does not revoke the indivisible
credit, and a terminal failed or cancelled refund restores it after Stripe's
Charge state agrees.

The signed Stripe webhook validates and acknowledges events but does not mutate
entitlement state. This keeps duplicate and out-of-order refund events from
becoming access authority.

## Monthly subscription refunds

Stripe treats subscription cancellation and payment refunds as separate
operations. Medical Bill Reader uses the live Stripe Subscription status as its
subscription-access authority and offers no trial through its Checkout flow.
Access requires status `active` with `pause_collection` unset. Pausing payment
collection is not an access-management substitute: analysis access remains
unavailable while collection is paused, but the billing portal can remain
available from the same verified browser for account management.

For an approved full refund of a monthly subscription charge:

1. Use Stripe's single Cancel subscription flow with immediate cancellation and
   **refund last payment in full**. Do not issue a standalone refund, and do not
   use `cancel_at_period_end` for a fully refunded period.
2. The authorized owner must verify in Stripe that the Subscription status is
   `canceled` and that the Refund status is `succeeded` before treating the
   workflow as complete. Repository automation must not inspect customer or
   payment records to make this determination.
3. Do not leave a fully refunded Subscription `active`; that would preserve site
   access and future billing. Do not leave it `trialing` either: trials are not
   eligible for site access, but they can still lead to future billing.

An end-of-period cancellation without a refund remains eligible only while
Stripe reports the Subscription status as `active`; once Stripe cancels it,
access stops. Partial refunds, credits, prorations, legal exceptions, and refunds
of historical periods require a separate owner decision; do not infer that they
should change current access.

The application does not automatically cancel future billing when it receives
a refund event. Billing-portal access can remain available from the same
verified browser. If that binding is unavailable, stop and obtain an owner
decision for support-assisted recovery; do not copy customer or payment data
outside Stripe. An immediately canceled Stripe subscription cannot be
reactivated. If the refund fails or is canceled after the subscription is
canceled, stop and obtain an owner decision for manual recovery; do not silently
restore access or issue another payment/refund operation.

## Verification boundary

Use synthetic, non-sensitive fixtures for automated tests. A refund workflow is
not verified merely because a webhook returned HTTP 200. The authorized owner
must verify the current Stripe Subscription and Refund statuses and then verify
the application's entitlement result without copying customer or payment data
outside Stripe. Repository automation must not inspect those live records. Do
not perform a real payment or refund solely to test this runbook.
