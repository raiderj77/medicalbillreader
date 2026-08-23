# Health data incident response plan

Last reviewed: 2026-08-23

Status: draft technical and operational plan pending owner, security, privacy-
counsel, and provider review. It is not legal advice and does not determine that
HIPAA, the FTC Health Breach Notification Rule, Washington law, or another law
does or does not apply. No legal notification deadline is stated here; counsel
must verify current law and facts at incident time.

## Start this plan when

There is suspected or confirmed unauthorized access, acquisition, disclosure,
transmission, storage, alteration, loss, or provider notice involving a bill,
EOB, report, filename, health information, medical code, charge, provider,
insurer, patient detail, account/member/claim number, payment detail/reference,
or linkable identifier. Also start it when such data appears in a URL, cookie,
log, trace, analytics/advertising tool, email intake, ticket, screenshot,
repository, cache, backup, or unapproved vendor.

## 1. Detection and triage

1. Record only a random incident number, discovery date/time, reporter role,
   affected system category, source category, and initial severity.
2. Do not copy content, identifiers, request bodies, screenshots, customer rows,
   account IDs, or secrets into the incident stub or repository.
3. Treat absence of logs, a successful HTTP response, provider acceptance, or a
   status page as incomplete evidence.
4. Escalate privately to the owner, security lead, and counsel placeholders
   below.

## 2. Immediate containment

- Stop or isolate the unsafe route, log drain, integration, key, deployment, or
  account access when authorized and when evidence can be preserved.
- Prefer reversible feature flags and route denial. Do not delete records,
  rotate live secrets, change a vendor, contact users, refund, or deploy without
  the required action-time owner authority.
- Block new sensitive intake if containment cannot reliably protect it.

## 3. Access revocation

- Inventory affected human accounts, service accounts, tokens, deploy keys,
  webhooks, integrations, and support access by category only.
- Owner revokes unauthorized or unnecessary access and confirms least privilege,
  MFA, offboarding, and recovery controls in the relevant provider.
- Do not publish usernames, account IDs, credentials, or audit-log contents.

## 4. Secret rotation

- Identify potentially exposed secrets by environment-variable/configuration
  name, never by value.
- Owner coordinates rotation in dependency order, invalidates old material,
  verifies service recovery with synthetic fixtures, and records categorical
  completion.
- Review HMAC bindings, Anthropic, Stripe/webhook, Upstash, Vercel, GitHub,
  domain/DNS, and email credentials as applicable.

## 5. Vendor notification

- Use the contract-approved confidential security/privacy channel.
- Share only minimum necessary information approved by counsel; do not attach a
  real document/report or paste source data into ordinary support.
- Record received/accepted/investigating/completed categories, not provider
  ticket IDs or record contents in the repository.

## 6. Data-flow investigation

Reconstruct the affected version, route, feature flag, processor path, sink,
date range, and aggregate affected-record range using non-sensitive technical
evidence. Reconcile against `docs/consumer-health-data-data-map.md`, including
browser, Vercel, Anthropic, Upstash, Stripe, email, GitHub, logs, caches, and
backups. Do not reproduce data to prove exposure.

## 7. Legal and contractual assessment

Counsel determines applicable entity roles, contracts, authorization, data type,
security status, acquisition/disclosure evidence, jurisdictions, affected
people, exceptions, and legal hold. Engineering must label missing evidence
`unknown` and must not decide that a breach is reportable or exempt.

## 8. FTC Health Breach Notification Rule assessment

Use `docs/health-breach-notification-assessment.md` and current official sources:

- <https://www.ftc.gov/legal-library/browse/rules/health-breach-notification-rule>
- <https://www.ftc.gov/business-guidance/resources/health-breach-notification-rule-basics-business>

Counsel decides whether the product/entity/data/event is within scope and what
notice, content, recipients, media/regulator steps, and timing apply. No
automated notice is authorized.

## 9. State breach-law assessment

Counsel identifies affected jurisdictions and separately evaluates general
breach statutes, consumer-health-data laws, contractual requirements, and any
other sector law. Use `docs/washington-my-health-my-data-checklist.md` for
Washington issues; do not extrapolate it to another state.

## 10. Consumer-notification assessment

- Counsel/owner approve whether notice is required, recipients, content,
  delivery, language/accessibility, regulator/media steps, timing, support, and
  phishing controls.
- Do not blame a provider or claim scope until evidence supports it.
- Do not send email, publish, contact anyone, or issue a refund from this plan.

## 11. Evidence preservation

- Preserve code version, configuration names, event categories, approved audit
  exports, access-control changes, and chain of custody in a restricted system.
- Do not preserve unnecessary copies of sensitive content; counsel directs legal
  holds and redaction/minimization.
- Never use a public issue, ordinary chat, repository, analytics tool, or model
  prompt as the evidence store.

## 12. Remediation and verification

1. Fix the verified cause with the smallest reversible control.
2. Test with synthetic non-health fixtures and verify the affected sink plus
   adjacent shared routes.
3. Re-run privacy, security, entitlement, logging, build, and release gates.
4. Obtain owner/counsel approval before restoration, external settings, notices,
   provider changes, or deployment.

## 13. Post-incident review

Record root-cause category, control gap, aggregate scope band, categorical
notices/actions, responsible roles, dated remediation, tests, and follow-ups.
Update the data map, processor register, retention matrix, request runbook,
public notice, vendor checklist, and annual review. Do not add sensitive facts.

## 14. Contacts and authority placeholders

| Role | Named person/channel | Authority/status |
| --- | --- | --- |
| Product owner | `[OWNER TO COMPLETE]` | Provider/account/deployment/contact authority |
| Security lead | `[OWNER TO COMPLETE]` | Technical containment and evidence lead |
| Privacy counsel | `[OWNER TO COMPLETE]` | Applicability, notification, timing, and content |
| Insurance contact | `[OWNER TO COMPLETE]` | Policy notification if applicable |
| Processor incident contacts | `[OWNER TO COMPLETE PER PROVIDER]` | Contract-approved channels only |

If required authority or counsel is unavailable, keep the unsafe flow contained
and status `unknown`; do not improvise a legal conclusion or external notice.
