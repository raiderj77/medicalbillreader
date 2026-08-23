# Processor and contract status

Last reviewed: 2026-08-23

Status: account and contract verification incomplete. This register uses only
repository evidence and current public primary sources. No vendor account,
customer record, health data, payment data, credential, confidential contract,
or external setting was inspected.

Status values:

- **Public source verified**: the cited public vendor/regulator statement was
  reviewed.
- **Account unverified**: no conclusion about the active account, plan, contract,
  or configuration.
- **Blocked**: do not make the associated compliance claim or enable the feature.

## Processor matrix

| Provider | Purpose/data boundary | Public evidence | Account/contract status | Current public claim | Owner/legal action |
| --- | --- | --- | --- | --- | --- |
| Anthropic | Receives the complete selected file and returns generated output through the commercial Messages API | [Commercial retention](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data) and [BAA information](https://support.anthropic.com/en/articles/8114513-business-associate-agreements-baa-for-commercial-customers) reviewed 2026-08-23 | **Account unverified; BAA/ZDR/HIPAA-ready status blocked** | Standard retention within 30 days with published exceptions; no claim of ZDR, BAA, or HIPAA coverage | Verify organization, model/features, DPA, retention, ZDR, BAA, activation, subprocessors, deletion, incident, and support terms before any broader claim |
| Vercel | Hosts, routes, and executes requests; may process document bytes, request metadata, and operational logs | [Vercel HIPAA guide](https://vercel.com/kb/guide/hipaa-compliance-guide-vercel) reviewed 2026-08-23 | **Plan, BAA/add-on, logs, regions, retention, and configuration unverified** | Application code is designed not to intentionally log or store document/report content; no Vercel BAA or HIPAA claim | Verify account and shared-responsibility controls; a publicly available BAA path does not prove this project is covered or compliant |
| Upstash | Stores privacy-minimized rate-limit, reservation, replay, and usage keys | No Upstash primary-source contract review in this run | **Contract, region, retention, backup, deletion, subprocessor, and health-data terms unverified** | Application sends pseudonymous keys, not document/report content | Review account and contract; stop if keys or logs contain sensitive/linkable content |
| Stripe | Hosted Checkout, payment, refund, subscription, and billing-portal state | Repository payment verification only; no provider privacy/contract review in this run | **Contract, retention, privacy-request, incident, and health-data-product implications unverified** | Stripe is payment source of truth; full card numbers do not enter the application; no bill/report content is intentionally sent | Verify account configuration and metadata, access, logs, webhooks, privacy requests, retention, and incident terms without inspecting customer records in repository work |
| Email provider | Receives support/privacy email after explicit user send | Provider not identified or reviewed | **Blocked for compliance claims** | Client-only intake requests name, email, type, optional Stripe reference only when needed, and general non-health explanation; it warns against sensitive content and has no automatic send | Identify provider; verify secure request, access, MFA, forwarding, retention, backup, deletion, incident, and contract controls |

## Anthropic retention facts

The reviewed primary source, dated July 1, 2026, says standard API inputs and
outputs are deleted from Anthropic's backend within 30 days, except for a service
with longer customer-controlled retention, different agreed terms, Usage Policy
enforcement, or law. It says Usage Policy-flagged inputs/outputs may be kept up
to two years and classification scores up to seven years. Account-specific terms
may differ. Do not call the service zero-retention.

The listed retention page does not support the separate public claim that API
data is not used for model training by default. That sentence should be removed
or separately sourced before publication.

## BAA and HIPAA facts

Anthropic's current page says a BAA requires action for the particular
HIPAA-ready organization and that first-party API use with PHI requires further
activation. Coverage is feature-, model-, configuration-, and organization-
specific. Vercel's guide says eligible BAAs support HIPAA workloads but
compliance remains shared responsibility.

These public offerings do not prove eligibility, execution, activation, or
compliance for Medical Bill Reader. The narrowly truthful boundary is:

> This public direct-to-consumer service is not represented as HIPAA compliant,
> does not offer a Business Associate Agreement, and must not be used on behalf
> of a covered entity when a BAA is required.

## Release blockers

- Do not claim HIPAA compliance, a BAA, ZDR, verified deletion, or provider
  contract sufficiency.
- Do not enable health-data analytics, advertising, free-text feedback, new
  document processors, external logs, or provider integrations.
- Do not rely on privacy-request deletion propagation until every in-scope
  provider mechanism and contract is verified.
- Do not paste account screenshots, IDs, contract terms, records, or secrets into
  this register. Record categorical decisions only.
