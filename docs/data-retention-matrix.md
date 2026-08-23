# Data retention matrix

Last reviewed: 2026-08-23

Status: repository behavior and public-source summary; provider-account and
legal review pending. An unknown provider setting is not zero retention. This
matrix contains no customer, document, health, payment, credential, or
analytics-identifier data.

| Data category | Location/processor | Purpose | Current application retention | Disposal/expiry | Provider or backup boundary | Evidence/status |
| --- | --- | --- | --- | --- | --- | --- |
| Selected document before upload | Browser | Preview and optional local action | Active component memory only | Reset, refresh, navigation, or close | Browser/extension/cache behavior outside app control | Repository observed |
| Local redaction input/output | Browser | Optional user-controlled masking | Active state; flattened PNG only if user chooses local download | Clear state/navigation; downloaded copy remains user controlled | Feature disabled by default; browser behavior unknown | Repository observed; release review pending |
| Uploaded document | Vercel function | Fulfill one requested analysis | Request memory only; no intentional application database, object storage, or log write | Request completion/failure and runtime lifecycle | Vercel logs/traces/memory/backups unknown | Repository observed; account unknown |
| Anthropic API input/output | Anthropic | Generate structured report | No Medical Bill Reader store | Anthropic controlled | Public standard retention and exceptions described in `docs/processor-contract-status.md`; exact account/ZDR/BAA unknown | Public source reviewed; account unknown |
| Generated report in transit | Vercel | Validate, scrub, and return report | Request/response memory only | Response completion/runtime lifecycle | Logs/traces/caches unknown and must be verified | Repository observed; account unknown |
| Generated report in browser | Browser | Display, print, or copy for user | Active page state only | Reset, refresh, navigation, or close; user-created copies remain user controlled | Browser/extension/clipboard/print destinations outside app control | Repository observed |
| Free-use/rate-limit keys | Upstash | Abuse controls and allowance | Bounded TTLs under current code | Key expiry or explicit release | Provider logs/backups/deletion lag unknown | Repository observed; reverify exact TTLs before release |
| Entitlement reservation | Upstash | Prevent concurrent credit use | Approximately ten minutes under current design | TTL or explicit release | Provider logs/backups unknown | Repository observed |
| Paid replay state | Upstash and sealed browser state | Prevent reused paid access | Up to 370 days under current design | TTL/cookie expiry or user deletion | Provider backups and browser copies unknown | Repository observed; legal/necessity review pending |
| Essential access cookies | Browser | Bind legitimate access | Single-use window and product-specific expiry | Expiry or user deletion | Browser sync/backup behavior outside app control | Repository observed; production inventory pending |
| HMAC/security secrets | Vercel environment | Bind/pseudonymize security state | Until owner-approved rotation | Rotation/revocation | Platform secret history, access, backup, and recovery unknown | Values never documented; account unknown |
| Stripe customer/payment/refund/subscription records | Stripe | Payment authority, accounting, disputes, fraud, portal | Stripe/provider and legally required periods | Provider/owner process subject to exceptions | Backup and non-deletable legal records possible | Exact terms and account settings unknown |
| Stripe references in privacy draft | React state, then mail providers only if user acts | Locate a payment/refund record when needed | Site state cleared before mail-app handoff; no site endpoint/database | User controls draft; mailbox retention if sent | Sender/recipient email providers and backups unknown | Repository observed; email provider unknown |
| Privacy-request name/email/type/explanation | React state, then mail providers only if user acts | Prepare a rights request | Client state cleared before handoff; no analytics, browser persistence, page-URL state, automatic send, or application request log | User controls draft; mailbox/case-log schedule pending | Email provider, forwarding, spam filtering, backups, and support access unknown | Repository observed; operations pending |
| Support email | Email providers/mailbox | Technical or privacy support | No site storage; mailbox/provider controlled | Owner-approved schedule pending | Provider, forwarding, backups, and deletion unknown | Unknown |
| Vercel request/deployment metadata | Vercel | Hosting, operations, security | Account configured/provider controlled | Unknown | Logs, traces, drains, backups, and support access unknown | Owner verification required |
| Git/CI records | GitHub | Software delivery | Repository, PR, workflow, artifact, and cache retention | Account/repository processes | Forks, caches, Actions artifacts, and backups may persist | Customer/sensitive data prohibited; account settings unknown |
| Privacy-request case log | Owner-selected system, not yet approved | Minimum necessary request tracking | Not implemented/selected | Schedule pending counsel | Must never contain bills, health content, full payment details, or repository-copied identifiers | Blocked pending owner/counsel |
| Incident record | Owner/counsel-approved confidential system | Legal/security response | Minimum necessary categorical record | Schedule pending legal hold/counsel | Evidence preservation and deletion must be reconciled | Blocked pending owner/counsel |
| Aggregate usage/feedback | Disabled | Privacy-safe product measurement | None while disabled | Not applicable | Future daily aggregate must contain no request rows or identifiers | Feature-gated, legal/privacy review required |

## Retention rules

1. “Not intentionally stored by the application” does not mean immediate or
   zero retention across browsers, networks, mail systems, or processors.
2. Do not publish an account-specific retention period until the exact account,
   feature, contract, and primary source are verified.
3. Do not shorten payment, security, incident, or legal-hold records without
   owner and counsel approval.
4. Unexpected document/report/identifier content in a log, URL, cookie,
   analytics sink, email intake, or storage system starts the incident process.
5. Provider backups, deletion lag, and legal exceptions must be documented
   before promising complete deletion.

## Owner decisions

- Approve a minimum privacy-request case record and retention period.
- Verify Vercel, Anthropic, Upstash, Stripe, email, GitHub, domain, monitoring,
  and backup behavior for exact production accounts.
- Approve provider deletion/return procedures and proof categories.
- Obtain counsel review of recordkeeping, request, appeal, incident, accounting,
  and legal-hold obligations.
- Reconcile this matrix annually and before any provider, log, analytics,
  advertising, support, model, or retention change.
