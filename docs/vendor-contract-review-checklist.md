# Vendor contract review checklist

Last reviewed: 2026-08-23

Status: owner/privacy-counsel/security review template. It does not authorize a
purchase, BAA, DPA, account or provider setting change, outreach, or production
change. Use the exact production account and current agreement, but store only
categorical outcomes and dates in the repository—never account IDs, screenshots,
confidential terms, records, credentials, or sensitive data.

## Scope and identity

- [ ] Legal entity, service, exact account owner, plan, region, and enabled
      product/features verified.
- [ ] Purpose, source routes, data categories, return data, and necessity mapped.
- [ ] Document content, report content, payment data, identity data, request
      metadata, logs, support access, and telemetry marked `yes`, `no`, or
      `unknown`.
- [ ] Controller/processor/service-provider/business-associate or other role
      reviewed by counsel without assuming the contract label controls law.

## Agreement and processing terms

- [ ] Current service agreement and DPA applicability/effective date verified.
- [ ] Processing instructions, purpose limits, confidentiality, disclosure,
      sale/advertising/training/secondary-use restrictions reviewed.
- [ ] BAA need, eligibility, exact covered services/models, execution, and
      activation recorded as `verified`, `not applicable`, `unknown`, or
      `blocked`; public availability is not coverage.
- [ ] ZDR/retention configuration and feature-specific exclusions verified from
      account evidence; do not infer ZDR from marketing or standard retention.
- [ ] International transfers, location/regions, government requests, and legal
      conflicts reviewed.

## Retention, deletion, and requests

- [ ] Primary storage, logs, traces, analytics, feedback, support copies,
      caches, backups, and legal/security exceptions inventoried.
- [ ] Retention durations and owner-configurable settings verified.
- [ ] Access, correction, deletion/return, backup propagation, and proof process
      tested with synthetic non-health data.
- [ ] Provider assistance and response channels for consumer requests reviewed.

## Security and incident terms

- [ ] Current security documentation, independent assessment/certifications,
      encryption, isolation, key management, least privilege, MFA, audit logging,
      vulnerability handling, and recovery reviewed for applicability.
- [ ] Subprocessor list, locations, change notice, objection/termination path,
      and flow-down duties reviewed.
- [ ] Incident definition, notification trigger/timing, content, cooperation,
      forensics, regulator/consumer support, and contact channel reviewed by
      counsel. Do not place an unverified deadline in public docs.
- [ ] Deletion/return and transition support at termination reviewed.

## Account implementation

- [ ] Owner/admin roster, least privilege, MFA, recovery, API/service keys,
      rotation, audit logs, support impersonation, integrations, webhooks, log
      drains, and offboarding reviewed.
- [ ] Synthetic test proves no request bodies, filenames, documents, reports,
      codes, charges, provider/insurer values, payment IDs, or secrets enter
      logs/analytics/error tools.
- [ ] Data map, processor register, retention matrix, privacy notice, incident
      plan, tests, and owner checklist updated.
- [ ] Material unknown or unacceptable term has an owner, date, compensating
      control, and fail-closed release decision.

## Provider-specific additions

- **Anthropic:** exact organization, model, structured-output feature,
  standard/exception retention, ZDR eligibility and activation, BAA eligibility
  and activation, feature exclusions, training/feedback settings, subprocessors,
  deletion, and incident path. Files API, batches, web search, prompt caching,
  and beta features remain prohibited absent a separate covered-feature review.
- **Vercel:** plan, project coverage, BAA/add-on availability/cost (review only),
  function/edge/log/trace/drain behavior, regions, deployment protection,
  environment access, support access, retention, and backups.
- **Upstash:** database region, key design, logs, backups, TTL/deletion, access,
  Enterprise/BAA need if any health data could be processed, and incident terms.
- **Stripe:** hosted payment boundary, metadata, customer/payment/refund/
  subscription retention, fraud/accounting exceptions, requests, disputes,
  webhook destinations, access, and incident terms.
- **Email:** provider/forwarders/spam filters, mailbox access/MFA, sensitive
  sender-error handling, retention/backups/deletion, secure intake, and incident
  path.
- **Domain/DNS, GitHub, monitoring/support:** account access, recovery, logs,
  integrations, artifacts/caches, retention, contracts, and incident contacts;
  verify whether any provider exists beyond the repository-observed inventory.

## Approval record

| Item | Status | Review date | Owner role | Next review/trigger |
| --- | --- | --- | --- | --- |
| Agreement/DPA | UNKNOWN | Pending | Owner/counsel | Before release or change |
| BAA/ZDR if relevant | UNKNOWN | Pending | Owner/counsel | Before any claim or covered use |
| Retention/deletion | UNKNOWN | Pending | Owner/privacy | Before request-process reliance |
| Security/account controls | UNKNOWN | Pending | Owner/security | Before release and annually |
| Incident terms/contact | UNKNOWN | Pending | Owner/counsel | Before release and annually |
