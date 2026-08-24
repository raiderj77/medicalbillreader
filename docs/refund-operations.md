# Refund operations

Last reviewed: 2026-08-21

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
operations. Medical Bill Reader offers no trial through its Checkout flow and
does not treat Subscription status alone as payment authority. At Checkout
confirmation and before every subscription analysis, the application re-reads
the current Stripe Subscription and its current-period Invoice, paid
InvoicePayment, PaymentIntent, Charge, and Refund objects.

The automated verifier intentionally supports only the product's configured
fixed-card Checkout shape: one active $49 monthly item, one fully paid
current-period automatic-charge Invoice, and one default paid InvoicePayment
backed by a succeeded card PaymentIntent and Charge. Access also requires
Subscription status `active` with `pause_collection` unset. A void,
uncollectible, fully refunded, disputed, or otherwise known-ineligible current
payment does not authorize subscription analysis. Missing, unexpanded,
in-flight, or incoherent provider state is temporarily unavailable and does not
fall through to another entitlement or consume an analysis.

An exceptional successful partial current-period refund, any in-flight refund,
credits, discounts, tax, multiple payment allocations, plan changes, and
proration/update invoice shapes require owner review; the application freezes
subscription access rather than guessing. Failed or canceled refunds restore
eligibility only when the live Charge and Refund objects agree. A refund of an
older period does not override a coherent newly paid current period. Pausing
payment collection is not an access-management substitute: analysis access
remains unavailable while collection is paused, but the billing portal can
remain available from the same verified browser for account management.

For an approved full refund of a monthly subscription charge:

1. Use Stripe's single Cancel subscription flow with immediate cancellation and
   **refund last payment in full**. Do not issue a standalone refund, and do not
   use `cancel_at_period_end` for a fully refunded period.
2. The authorized owner must verify in Stripe that the Subscription status is
   `canceled` and that the Refund status is `succeeded` before treating the
   workflow as complete. Repository automation must not inspect customer or
   payment records to make this determination.
3. Do not leave a fully refunded Subscription `active`; although the current
   full refund independently revokes analysis access, an active Subscription can
   continue future billing. Do not leave it `trialing` either: trials are not
   eligible for site access, but they can still lead to future billing.

An end-of-period cancellation without a refund remains eligible only while
Stripe reports both an eligible Subscription and coherent current paid state;
once Stripe cancels it, access stops. Partial refunds, credits, prorations, and
legal exceptions require a separate owner decision. Historical refunds do not
change a separately verified current paid period.

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
must verify the current Stripe Subscription, Invoice payment, Charge, and Refund
statuses and then verify the application's entitlement result without copying
customer or payment data outside Stripe. Repository automation must not inspect
those live records. Do not perform a real payment or refund solely to test this
runbook.
