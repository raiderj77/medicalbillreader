# Consumer health data data map

Last reviewed: 2026-08-23

Status: repository-based operational map; privacy-counsel and account-level
provider review are pending. This is not legal advice or a compliance
certification. No real bill, EOB, report, customer record, payment detail,
provider account, credential, or analytics identifier was inspected to prepare
this document. An unknown provider setting is not proof of zero retention.

## Handling rule

Never add document content, report content, filenames, health information,
codes, charges, providers, insurers, account/member/claim identifiers, payment
references, IP addresses, cookie values, or other linkable identifiers to this
map, logs, analytics, tickets, screenshots, tests, or repository artifacts. Use
synthetic non-health fixtures and aggregate categories only.

## End-to-end flow inventory

| # | Stage | Data present | Recipient or location | Intended application persistence | Verified control | Unknown or owner action |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Browser file selection | Complete user-selected image or PDF; filename is visible to the browser file control | User's browser | Component memory only | Selection does not itself call the network | Browser/extension behavior outside application control is unknown |
| 2 | Browser preview | Selected image object URL or PDF selection state | User's browser | Page memory only | No application localStorage, sessionStorage, cookie, IndexedDB, or URL write is intended | Browser cache and extension behavior are outside application control |
| 3 | Redaction flow | A user-selected image and local masking coordinates | User's browser only | Page memory and user-initiated local download only | Local redaction is disabled by default; the original is not intentionally uploaded by that component | Production enablement and independent flattening/metadata review are pending |
| 4 | Request to Vercel | Supported file bytes, media type, processing acknowledgement, and required entitlement state; no filename field | HTTPS request to the application route on Vercel | Request memory only | Origin/host/type/size validation and no-store responses | Network-edge and account-specific request capture must be verified |
| 5 | Vercel function memory | Request bytes and decoded document data needed for the request | Vercel function runtime | No intentional application database/object-store write | Code uses request-scoped values and category-only security logs | Runtime logs, traces, memory lifecycle, regions, support access, and backups are unverified |
| 6 | Anthropic API processing | Complete selected document plus bounded instructions; generated structured response | Anthropic commercial Messages API | No Medical Bill Reader database write | Server-side API use; model output is schema-validated and scrubbed | Exact account, DPA, BAA, ZDR, features, retention, subprocessors, and deletion are unverified |
| 7 | Report return | Validated and scrubbed structured report | Anthropic to Vercel to the requesting browser | Response memory only | Arbitrary model HTML/Markdown/links are not rendered; response is no-store | Infrastructure metadata and network caches require account verification |
| 8 | Browser report display | Structured report and derived plain text | User's active page | React state only | Reset/navigation/refresh clears application state; no report telemetry | Browser/extension capture remains outside application control |
| 9 | Entitlement cookies | Sealed browser-binding and access state; no document/report content | Browser and application | Cookie until configured expiry | Secure, HttpOnly, server-verified state; no health fields | Current production cookie inventory and browser behavior require release verification |
| 10 | HMAC security keys | Server secrets used to pseudonymize/bind security state | Vercel environment and server functions | Environment configuration, not request content | Secrets are not shipped to client code | Owner, rotation, access, recovery, and environment scope are unverified; never record values here |
| 11 | Stripe payment records | Payment/customer/subscription/refund records held by Stripe; opaque provider references used where necessary | Stripe-hosted Checkout/API/portal | Stripe is source of truth; application uses sealed references and cookies | Browser never supplies an authoritative price; no bill/report content is intentionally sent | Contract, metadata, retention, deletion limits, account access, and incident terms are unverified |
| 12 | Upstash records | Pseudonymous rate-limit, reservation, replay, and usage keys | Upstash Redis | Bounded key TTL or explicit release | Keys must contain no document/report/free text or raw customer/payment identifiers | Account, region, logs, backups, deletion, DPA, subprocessors, and health-data terms are unverified |
| 13 | Vercel request metadata | Ordinary network/request/deployment metadata | Vercel edge/runtime/account tools | Provider controlled | Application code does not intentionally log request bodies, filenames, or provider responses | Exact fields, logs, drains, traces, retention, backup, and support access are unverified |
| 14 | Support email | Whatever the sender chooses to include despite warnings | Sender's and site's email providers | Mailbox/provider controlled | Contact page warns not to send bills or health/payment details | Email provider, forwarding, access, backups, retention, deletion, and incident terms are unverified |
| 15 | Privacy-request email | Name, email, request type, optional Stripe payment reference when needed, and optional general non-health explanation | Client-only form, then user's mail app and email providers after explicit action | React state is cleared before mail-app handoff; site has no form endpoint or request database | Exact health-data warning; no attachment control, analytics, browser persistence, automatic send, or page-URL state | Email provider and approved case-log system remain owner decisions |
| 16 | Existing logs | Categorical security/operational events may exist | Vercel or other owner-configured logging | Provider controlled | Code is intended to exclude body, filename, model output, identifiers, and secrets | Production logs and any historic exposure were not inspected and remain unknown |
| 17 | Backups | Possible provider-managed copies of metadata, keys, payment records, or mailbox content | Relevant provider | Provider controlled | No application-managed document backup exists in repository design | Provider backup content, duration, restoration access, and deletion propagation are unverified |
| 18 | External vendor retention | Data described above under each provider's terms/configuration | Anthropic, Vercel, Upstash, Stripe, email, domain, source-control, and any undiscovered provider | Provider controlled | Public-source boundaries are recorded without claiming account coverage | Owner must verify every active account, agreement, setting, subprocessor, region, retention period, and deletion mechanism |

## Data intentionally excluded from secondary systems

- No document, report, filename, code, charge, provider, insurer, patient detail,
  entitlement, payment reference, cookie value, or analysis event may enter
  analytics, advertising, feedback, search tooling, ordinary logs, or outreach.
- No privacy-request value is submitted to a site endpoint or stored in browser
  persistence or the page URL. The mail draft opens only after the requester
  selects the button; the site does not send it.
- No real document or customer record may be used for tests, review, or release
  evidence.

## Related operating records

- Detailed technical map: `docs/privacy/data-map.md`
- Processor inventory: `docs/processor-register.md`
- Retention: `docs/data-retention-matrix.md`
- Privacy requests: `docs/privacy-request-runbook.md`
- Incident response: `docs/health-data-incident-response-plan.md`

## Release gates

1. Reconcile this map against final routes, environment-variable names, and an
   owner-verified provider inventory without opening records or copying IDs.
2. Privacy counsel must determine applicable consumer-health-data roles,
   collection/sharing basis, request duties, and notices.
3. A security reviewer must verify that production logs, traces, error tools,
   caches, and vendor dashboards do not capture sensitive bodies or outputs,
   using synthetic non-health data only.
4. Stop the affected flow if an unknown provider or uncontrolled sensitive sink
   is discovered.
