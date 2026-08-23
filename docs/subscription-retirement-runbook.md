# Existing Subscription Support and Retirement Runbook

Last reviewed: 2026-08-23

## Purpose

New monthly subscription checkout is disabled. This runbook keeps access,
cancellation, entitlement, refund, and billing-portal safeguards available for
any real existing subscriber until the owner verifies that retirement is safe.
It does not authorize a Stripe change, customer contact, cancellation, refund,
deployment, or code removal.

## Privacy boundary

- Work in Stripe's dashboard or an approved aggregate report. Do not export,
  copy, screenshot, or commit customer names, email addresses, payment details,
  Stripe identifiers, uploaded documents, bill details, or health information.
- Record only aggregate counts by Stripe mode, subscription status, and relevant
  recurring product or price.
- Treat missing access or an unavailable report as UNKNOWN, never as zero.
- Never ask a subscriber to email a medical bill or describe care received.

## Owner verification in Stripe

1. Confirm the signed-in Stripe account is the production Medical Bill Reader
   account. Record only that the account and mode were verified, not an account
   identifier.
2. Check test mode first. Transactions or subscriptions shown only there are
   synthetic tests and do not establish customer demand or retained revenue.
3. Switch deliberately to live mode and filter subscriptions to the recurring
   product or price configured internally as STRIPE_PRICE_MONTHLY. Do not paste
   the price identifier into this repository or a report.
4. Record aggregate counts for trialing, active, past_due, unpaid, paused,
   canceled, and any incomplete state Stripe exposes. Include the dashboard
   review date and mode.
5. Check scheduled cancellations, billing-cycle end dates, open invoices,
   refunds, disputes, and credit notes in aggregate. Do not infer eligibility
   from subscription status alone.
6. Independently confirm current provider objects before a consequential
   conclusion. A webhook is a signal, not the sole source of truth.

## While any relevant subscription may exist

- Keep existing subscription confirmation and entitlement verification.
- Keep fail-closed handling for paused, unpaid, refunded, disputed, or otherwise
  ineligible paid states.
- Keep the Stripe-hosted billing portal available for legitimate management and
  cancellation even when the subscription no longer grants analyzer access.
- Keep webhook, refund, replay, and browser-bound entitlement protections.
- Keep STRIPE_PRICE_MONTHLY configured where legacy verification requires it.
- Do not restore or expose new subscription checkout.

## Notice, cancellation, and unused time

Any notice is an owner-approved operational communication sent from the existing
customer system. Do not export addresses or create a mailing list. The notice
should contain only the service change, effective date, management/cancellation
link, support path, and applicable billing/refund terms. It must not mention a
bill, diagnosis, provider, insurer, analysis result, or other health information.

Customers should normally manage or cancel through the verified Stripe-hosted
billing portal. An owner-initiated cancellation, refund, credit, or billing-date
change requires separate action-time approval and a fresh check of current
Stripe objects. Preserve access through the period the verified subscription
actually authorizes. Handle unused time under the existing terms, applicable
law, and an owner-approved refund decision; do not promise unapproved proration.
After a full refund or other ineligible paid state, entitlement must fail closed
under the current verified rules while portal access remains available where
legitimate.

## Eligibility for code removal

Subscription code is eligible for a removal proposal only after all of the
following are documented with aggregate evidence:

1. The correct live Stripe account and relevant recurring product or price were
   verified.
2. No relevant subscription remains in any state that could authorize access or
   require management, recovery, cancellation, notice, refund, dispute, invoice,
   or credit handling.
3. The complete applicable billing, cancellation, refund, dispute, and recovery
   window has elapsed. The owner or specialist must determine that window; this
   runbook does not invent one.
4. No open invoice, refund, dispute, credit note, scheduled change, or support
   obligation remains.
5. The owner records approval for a separate, reversible removal change with
   regression tests and a rollback plan.

Removal must cover public copy, environment documentation, confirmation,
entitlement, portal, webhook, refund, tests, and operational docs as one reviewed
change. Until every condition is satisfied, existing-subscriber support stays.

## Actions requiring owner approval

- Opening or changing live Stripe account, product, price, subscription, portal,
  webhook, refund, credit, dispute, invoice, or tax settings.
- Sending any customer notice or support message.
- Canceling, refunding, crediting, pausing, or changing a subscription.
- Changing price, offer, refund terms, or the business model.
- Deploying, publishing, or removing existing-subscriber support.

## Verification record template

| Field | Value |
| --- | --- |
| Review date | UNKNOWN |
| Correct account verified | UNKNOWN |
| Stripe mode reviewed | UNKNOWN |
| Relevant live subscription counts by status | UNKNOWN |
| Scheduled cancellations | UNKNOWN |
| Open invoices, refunds, disputes, or credits | UNKNOWN |
| Required support window end | UNKNOWN |
| Owner decision | UNKNOWN |
