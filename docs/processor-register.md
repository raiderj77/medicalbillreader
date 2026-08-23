# Processor register

Last reviewed: 2026-08-23

Status: account, contract, and configuration verification pending. This
repository record uses code behavior and public information only; it does not
prove that a provider is a statutory processor, business associate, or covered
service. Do not state that an agreement, DPA, BAA, zero-data-retention term, or
security setting exists without owner-held evidence for the exact production
account.

Permitted statuses: `repository observed`, `public source reviewed`, `unknown`,
`blocked`, and `owner verified`. No entry below is `owner verified`.

## Anthropic

- **Service/purpose:** Commercial Messages API; generate one requested
  structured bill explanation.
- **Data categories:** Complete selected document, bounded prompt instructions,
  generated report, ordinary API metadata, and token usage.
- **Document content received:** Yes.
- **Report content received:** Yes; Anthropic generates it.
- **Payment data received:** No payment/card data is intentionally sent.
- **Current agreement:** Unknown; no contract or account was inspected.
- **DPA status:** Unknown.
- **BAA status:** Unknown and blocked for public claim or PHI-use reliance.
- **ZDR status:** Unknown and blocked for public claim.
- **Retention terms:** Public standard commercial retention and exceptions are
  summarized in `docs/processor-contract-status.md`; account applicability is
  unknown.
- **Subprocessors:** Unknown; owner must review the current account-applicable
  list and change-notice mechanism.
- **Security documentation:** Public documentation exists; account controls and
  implementation have not been verified.
- **Breach-notification terms:** Unknown; contract review required.
- **Deletion process:** Account/API/provider mechanism and exception handling
  unknown.
- **Owner review date:** Pending.

## Vercel

- **Service/purpose:** DNS-targeted application hosting, edge routing, builds,
  and server-function execution for this repository.
- **Data categories:** Document request bytes, generated responses, entitlement
  cookies, ordinary request/deployment metadata, environment secrets, and
  possible logs/traces.
- **Document content received:** Yes, in transit and function memory.
- **Report content received:** Yes, in transit and function memory.
- **Payment data received:** Opaque Stripe references and checkout/entitlement
  state may transit; full card data is not intentionally received.
- **Current agreement:** Unknown; no account or contract was inspected.
- **DPA status:** Unknown.
- **BAA status:** Unknown; public availability does not establish project
  coverage. No BAA/HIPAA claim is authorized.
- **ZDR status:** Not established and not claimed.
- **Retention terms:** Runtime/deployment/log/trace/backup retention under the
  production account is unknown.
- **Subprocessors:** Unknown; owner must review the current applicable list.
- **Security documentation:** Public HIPAA/security material was reviewed only
  as availability evidence, not account proof.
- **Breach-notification terms:** Unknown; agreement review required.
- **Deletion process:** Project/log/deployment/support deletion paths and backup
  propagation unknown.
- **Owner review date:** Pending.

## Upstash

- **Service/purpose:** Redis-backed rate limits, entitlement reservations,
  replay prevention, and usage controls.
- **Data categories:** Pseudonymous HMAC/binding keys, counters, state, and TTLs;
  document/report/free text is prohibited.
- **Document content received:** No by application design.
- **Report content received:** No by application design.
- **Payment data received:** Raw payment/customer IDs are prohibited in keys;
  verify final key construction.
- **Current agreement:** Unknown.
- **DPA status:** Unknown.
- **BAA status:** Unknown; need and availability require owner/counsel review.
- **ZDR status:** Not applicable as a claim; data is intentionally held for
  bounded control periods.
- **Retention terms:** Application TTLs are documented; provider logs, backups,
  and deletion lag are unknown.
- **Subprocessors:** Unknown.
- **Security documentation:** Not reviewed for the active account in this run.
- **Breach-notification terms:** Unknown.
- **Deletion process:** Key expiry/explicit deletion exists in application
  design; account, logs, and backups are unknown.
- **Owner review date:** Pending.

## Stripe

- **Service/purpose:** Hosted Checkout, payment/refund authority, existing
  subscription verification, and billing portal.
- **Data categories:** Customer/payment/subscription/refund records, fraud and
  request metadata, server-selected product/price, and minimal return references.
- **Document content received:** No by application design.
- **Report content received:** No by application design.
- **Payment data received:** Yes; Stripe receives payment details directly.
- **Current agreement:** Unknown; ordinary service use is visible in code but
  agreement sufficiency was not verified.
- **DPA status:** Unknown.
- **BAA status:** Unknown and no BAA/HIPAA claim is authorized.
- **ZDR status:** Not applicable; payment/accounting/fraud records are retained.
- **Retention terms:** Provider and applicable legal/accounting retention;
  account-specific duration and exceptions unknown.
- **Subprocessors:** Unknown; current applicable list not reviewed.
- **Security documentation:** Public/account evidence not reviewed in this run.
- **Breach-notification terms:** Unknown.
- **Deletion process:** Privacy/account process and non-deletable exceptions
  unknown.
- **Owner review date:** Pending.

## Domain provider

- **Service/purpose:** Domain registration and/or authoritative DNS for
  `medicalbillreader.com`.
- **Data categories:** Domain/account/contact and DNS records; ordinary access
  metadata. No document/report/payment content should be sent.
- **Document content received:** No by intended architecture.
- **Report content received:** No.
- **Payment data received:** Possible owner billing data; no customer payment
  data should be sent.
- **Current agreement/DPA/BAA/ZDR:** Provider identity and all statuses unknown.
- **Retention/subprocessors/security/breach/deletion:** Unknown.
- **Owner review date:** Pending; identify registrar, DNS provider, account
  owner, access controls, recovery, logs, contract, and incident contact.

## Email provider

- **Service/purpose:** Receive support and privacy-request email after the user
  explicitly sends it.
- **Data categories:** Name, email, request type, optional Stripe payment
  reference when needed, general non-health explanation, and any extra content a
  sender adds despite warnings.
- **Document content received:** Prohibited, but possible if a sender disregards
  the warning; treat discovery as an incident/minimization event.
- **Report content received:** Prohibited, but possible sender error.
- **Payment data received:** Optional minimal Stripe reference may be received;
  card/bank details are prohibited.
- **Current agreement/DPA/BAA/ZDR:** Provider identity and all statuses unknown.
- **Retention/subprocessors/security/breach/deletion:** Unknown, including
  forwarding, mailbox backup, spam filtering, support access, and deletion.
- **Owner review date:** Pending; secure/reliable intake is a release decision.

## GitHub

- **Service/purpose:** Source control, pull requests, automated checks, and
  repository collaboration.
- **Data categories:** Source, synthetic fixtures, documentation, commit/PR
  metadata, and CI logs. Customer/health/payment/credential data is prohibited.
- **Document content received:** No; never upload real documents.
- **Report content received:** No real report; synthetic fixtures only.
- **Payment data received:** No customer/payment identifiers.
- **Current agreement/DPA/BAA/ZDR:** Account and agreement status unknown; no
  health-data use is authorized.
- **Retention/subprocessors/security/breach/deletion:** Account-specific settings,
  Actions retention, forks/caches/artifacts, access, and deletion are unknown.
- **Owner review date:** Pending.

## Monitoring and support providers

- **Service/purpose:** No third-party analytics, session recording, advertising,
  error-reporting SDK, or support widget was found in the reviewed repository
  configuration. Vercel platform logs may still provide monitoring.
- **Data categories/document/report/payment receipt:** None intentionally sent to
  a separate monitoring/support SDK.
- **Agreement/DPA/BAA/ZDR/retention/subprocessors/security/breach/deletion:**
  Production account integrations and external log drains were not inspected;
  therefore the active-provider list remains **unknown**, not “none.”
- **Owner review date:** Pending; reconcile Vercel project integrations, DNS,
  environment-variable names, and owner inventory without copying identifiers.

## Release gate

For every active provider, the owner and privacy counsel must record categorical
evidence for the exact legal entity, account, plan, purpose, data categories,
agreement/DPA, BAA or ZDR status if relevant, retention, subprocessors, security,
incident notice, deletion, and review date. Confidential agreements, account
screenshots, IDs, secrets, or customer records must not be committed.
