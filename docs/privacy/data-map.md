# Medical Bill Reader data map

Last reviewed: 2026-08-23

Status: operational inventory, not a legal-compliance certification. This map is
based on repository behavior and public primary sources. No customer records,
real documents, provider dashboards, credentials, or vendor-account settings
were inspected.

## Prohibited handling

- Never copy a real bill, EOB, report, filename, medical code, charge, provider,
  patient detail, member or account number, claim number, payment identifier, IP
  address, or free-text health information into logs, analytics, tests, tickets,
  screenshots, or operational documents.
- Use fabricated fixtures and aggregate counts only.
- Do not intentionally persist uploads or reports.
- Do not send sensitive events to analytics, advertising, feedback, or outreach
  systems.

## Current data flows

| Flow | Data accepted | Processing and recipients | Intended application storage | Current boundary | Main control |
| --- | --- | --- | --- | --- | --- |
| Public pages | Ordinary request metadata | Vercel routes the request | None by application code | Vercel account logging and retention are unverified | No third-party analytics or advertising |
| Local browser state | User-selected file preview and returned report | User's browser | Current page memory only | Ends when the page state is cleared, refreshed, navigated away, or closed | No localStorage, sessionStorage, cookie, or URL storage for document/report content |
| Single-document AI request | Complete supported image or PDF, processing acknowledgement, entitlement token | Vercel function sends the file and instructions to Anthropic's Messages API; response returns through Vercel | Request memory only; no intentional database or object-store write | Anthropic and Vercel provider-side processing applies | HTTPS, type/size validation, timeout, no-store responses, category-only logs |
| Free access | Browser-bound authorization, privacy-minimized abuse-control state | Application and Upstash | Pseudonymous keys with bounded expiry | Network metadata exists at infrastructure providers | HMAC protection and no document/report fields in keys |
| Paid single analysis | Browser-bound entitlement, server-side Stripe payment state | Stripe hosted Checkout and server verification; Upstash reservation/replay controls | Authenticated cookies and pseudonymous keys, not full card numbers | Stripe/provider records follow their terms and legal obligations | Server-authoritative price/payment/refund verification |
| Existing subscription support | Browser binding, sealed subscription token, current Stripe subscription/payment state | Stripe verification and billing portal; Upstash usage controls | Browser token and pseudonymous usage keys | New public subscription sales are a separate product decision | Portal access is management-only and payment state is reverified |
| Privacy/support email | Privacy form: name, email, request type, conditional optional Stripe reference, and general non-health explanation; support email content is sender controlled | Client-only form, user's mail app, email provider, and authorized operator after explicit user send | The form has no site endpoint or persistence; mailbox retention is unverified | Users are warned not to include health, bill, identity, card/bank, or insurance details | Client-only draft; no attachment field, analytics, browser persistence, page-URL state, or automatic send |
| Fixed feedback | Disabled | None while the feature remains disabled | None | Future aggregate-only implementation requires privacy review | No free text, identifiers, linkage, or sensitive event content |

## Processors and roles to verify

| Provider | Repository-observed purpose | Consumer-health-data exposure | Contract/status evidence |
| --- | --- | --- | --- |
| Anthropic | Generate the requested report | Complete selected file and generated output | Commercial retention source reviewed; BAA, ZDR, HIPAA-ready activation, DPA, and exact account terms unverified |
| Vercel | Host, route, and execute the application | Request bytes, metadata, and possible operational logs | Public HIPAA guide reviewed; plan, BAA, add-on, logs, and account configuration unverified |
| Upstash | Rate limiting, reservations, replay prevention, and usage controls | Application design sends pseudonymous keys, not document/report content | Contract, retention configuration, subprocessors, and consumer-health-data obligations unverified |
| Stripe | Checkout, payment, refund, subscription, and portal state | Payment/customer data; application design does not send bill/report content | Payment authority is tested locally; contract, retention, privacy-request, and health-data-product implications unverified |
| Email provider | Receive support and privacy requests | Whatever a sender includes, despite warnings | Provider identity, contract, access, and retention unverified |

## No-flow assertions requiring regression tests

- No upload, report, filename, provider, code, charge, entitlement, Stripe ID,
  or analysis event reaches analytics or advertising.
- No document/report value is written to browser persistence, a URL, a cookie,
  Redis, application logs, or repository artifacts.
- The privacy-request form has no server endpoint, analytics, automatic send,
  attachment control, browser persistence, or page-URL state. It opens a mail
  draft only after explicit user action and clears its React state.
- No real document is used in test or release verification.

## Owner verification gates

1. Verify each active provider, account owner, plan, region, contract, subprocessor
   list, retention setting, log configuration, and incident contact without
   copying identifiers into the repository.
2. Obtain privacy counsel review of applicable consumer-health-data law,
   processor classification, consent/legal basis, request handling, and incident
   duties.
3. Record only categorical results and review dates in the contract register.
4. Stop document processing if an active provider cannot support the documented
   flow or if application logs contain sensitive content.
