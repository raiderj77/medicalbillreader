# Retention schedule

Last reviewed: 2026-08-23

This schedule records the currently implemented or publicly documented bounds.
It does not claim that unknown provider settings have been verified.

| Data category | Application purpose | Current retention statement | Disposal or expiry | Evidence status |
| --- | --- | --- | --- | --- |
| Uploaded document | Generate one requested report | Request memory only; not intentionally written to the application database, object storage, or logs | Released after request completion or failure | Verified from application design and tests; provider-side state remains separate |
| Generated report | Return report to active browser | Server request memory and active browser page state | Server response completes; browser state clears on reset, refresh, navigation, or close | Verified from application design |
| Anthropic API input/output | Generate report | Anthropic's standard policy says backend deletion within 30 days, subject to customer-controlled services, agreed terms, Usage Policy, and legal exceptions; Usage Policy-flagged inputs/outputs may remain up to two years and classification scores up to seven years | Anthropic-controlled | Public source reviewed 2026-08-23; account-specific terms, ZDR, and BAA unverified |
| Vercel request metadata and logs | Hosting, operations, security | Unknown under the active account configuration | Unknown | Owner must verify plan, log fields, drains, regions, and retention |
| Browser preview/report | Display selected image and returned report | Active component/page state only | Reset, refresh, navigation, or close | Verified from code; no persistence intended |
| Free-use and rate-limit keys | Abuse prevention and monthly allowance | Generally one minute to 40 days under current code/public notice | Key TTL | Revalidate after entitlement changes |
| Temporary entitlement reservations | Prevent concurrent use | About 10 minutes | Key TTL or explicit release | Verified in current entitlement design |
| Pay-per-use replay state | Prevent reusing a paid credit | Up to 370 days | Key TTL | Verified in current public notice; contains no document/report content |
| Essential access cookies | Bind authorized browser access | Single-analysis cookie up to 24 hours; other support cookies follow current product configuration | Cookie expiry or user deletion | Revalidate after subscription retirement work |
| Stripe records | Payment, accounting, refunds, disputes, fraud prevention | Provider and applicable legal/accounting retention | Provider/owner process | Exact retention and deletion limits unverified |
| Privacy-request form state | Prepare a requester-controlled email draft | React state only; no application endpoint, analytics, browser persistence, page-URL state, or automatic send | State clears before mail-app handoff; reset, refresh, navigation, or close also clears it | Verified from code; user's mail app/provider begins a separate flow only after explicit action |
| Privacy/support email | Handle request or support contact | Unknown mailbox/provider retention after the user sends; privacy intake is limited to name, email, request type, optional Stripe reference when needed, and general non-health explanation | Owner-defined deletion after operational/legal need | Provider, access, forwarding, backup, and deletion controls unverified |
| Aggregate quality or business counts | Product evaluation | Not currently enabled unless a documented aggregate-only feature is activated | Owner-defined daily/weekly aggregate schedule | Must contain no identifiers, linkable events, document/report details, or free text |

## Fail-closed rules

- “Not intentionally stored by the application” is not the same as zero data
  retention across all processors.
- Do not publish a provider retention number unless its primary source and the
  account-specific applicability were reviewed.
- Do not shorten a payment/accounting retention period without owner and legal
  review.
- If a provider setting is unknown, label it unknown; do not report zero.
- Any unexpected sensitive log or stored copy is an incident trigger, not an
  undocumented retention category.

## Annual review

Use `docs/privacy/vendor-annual-review-checklist.md`. Update this table only with
categorical evidence. Never paste account screenshots, identifiers, records, or
contract terms containing confidential information into the repository.
