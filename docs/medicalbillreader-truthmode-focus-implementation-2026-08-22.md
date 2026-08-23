# Medical Bill Reader Truthmode focus implementation

Implementation branch date: 2026-08-23
Specification date: 2026-08-22
Release status: **local branch and draft-review candidate only; not deployed**

This record contains aggregate architecture and fabricated-test information only. No bill, health, payment, customer, credential, secret, or analytics-identifier data was inspected or copied into the work.

## 1. Executive decision

Keep Medical Bill Reader as a direct-to-consumer plain-language document explainer with a privacy-preserving local bill/EOB worksheet. Keep one free browser allowance and the server-authoritative $4.99 single analysis. Stop offering new monthly subscriptions. Keep management and safely verified use for any legitimate existing subscriber until the owner verifies aggregate Stripe status and decides the support period. Keep the future $9.99 two-document comparison unavailable until all release gates are complete.

The highest-value release unit is the local worksheet plus the two-path offer: it gives search visitors useful value before they share a document or pay, and it creates a qualified path to the analyzer without claiming a billing audit, error determination, savings, or outcome.

## 2. Business model retained

- Free local bill/EOB arithmetic with no upload, account, payment, network request, or persistence.
- One AI-assisted single-document analysis per browser per UTC calendar month, subject to server abuse controls.
- One additional analysis for $4.99 through a fixed server-side Stripe Price mapping.
- Existing-subscriber portal and verified paid-period analysis support while legacy obligations are assessed.
- Source-backed educational pages, a fully fabricated sample report, and primary-source links.

## 3. Business model removed

- New $49 monthly subscription marketing and checkout creation.
- “Best value,” routine-family-use, 44-analysis, and other new-subscription recommendations.
- Any implication of a certified audit, coding determination, coverage determination, legal responsibility, price fairness, fraud, upcoding, unbundling, medical necessity, savings, or dispute service.
- Exact code/descriptor education and automated descriptor lookup where rights are unresolved.

## 4. Public pricing changes

The public offer is Free, $4.99 single analysis, and “$9.99 comparison coming later.” The comparison has no checkout. The pricing page retains a separately labeled management path for a person who already has a verified legacy subscription. Browser code sends only a categorical purchase type; the server owns the Stripe Price mapping.

## 5. Subscription changes

`ENABLE_NEW_SUBSCRIPTIONS` defaults false. Checkout rejects subscription creation before it creates a nonce, reads a monthly Price, or calls Stripe. Confirmation remains able to finish a legitimate pre-release Checkout return, and existing entitlement/refund/payment verification remains in place. See `docs/subscription-retirement-runbook.md`.

## 6. Existing-subscriber safeguards

The branch is based on the payment-authority work from draft PR #51. Subscription status alone is not analysis authority. The current invoice/payment/charge/refund/credit-note matrix must authorize the paid period; unsupported or unavailable states fail closed. Billing-portal access remains separate and never renews analysis entitlement.

## 7. Homepage changes

The homepage presents two honest paths:

1. Compare labeled dollar fields locally, without uploading.
2. Choose a supported document for a structured AI report after the privacy notice and affirmative processing acknowledgement.

The pre-upload disclosure remains next to the analyzer. Copy avoids unsupported prevalence, demand, savings, and outcome language.

## 8. Local worksheet

`/bill-eob-comparison-worksheet` is server-rendered for discovery and education; its interactive values live only in React component state. Integer-cent parsing supports currency separators, negative values, zero, and decimal rounding without floating-point arithmetic. Outputs cover both billed-charge figures, calculated EOB responsibility, shown-vs-calculated responsibility, EOB-vs-provider balance, difference after entered patient payments, missing fields, and neutral questions.

Reset, browser print/save-as-PDF, and local clipboard copy are provided. No server PDF exists. Tests block fetch, XHR, beacons, sockets, storage, cookies, URL/query/hash/history state, and API calls from the component.

## 9. Structured report schema

The AI contract is a strict typed JSON report. Anthropic's current `output_config.format` JSON-schema mechanism is used with a generic schema that contains no person- or document-specific values. The server bounds the provider response, requires a complete end-turn response from the exact configured model, parses and validates the schema, applies semantic limits and identifier scrubbing, then revalidates. Entitlement is committed only after a safe report is ready and the reported usage remains within the reviewed per-analysis cost ceiling.

The renderer has seven fixed sections and renders values as React text. It does not parse model Markdown or HTML and does not create model-generated links.

## 10. Bill-and-EOB comparison

`/bill-eob-comparison` exists as a noindex release-status page. It exposes no file input, analysis endpoint, or purchase. A strict, pure comparison schema, validator, deterministic renderer, two-slot input contract, and separate credit-domain contract are present for review, but no comparison upload/provider/payment runtime exists. The product flag defaults false and five additional gates remain false: implementation, synthetic evaluation, privacy approval, professional review, and Stripe Price verification. Even setting the feature flag true cannot bypass those gates.

Planned limits are two slots only, 10 MiB per file, 18 MiB combined decoded bytes, 12 pages per PDF, and 20 PDF pages combined, with no silent truncation. The future purchase category is distinct from single analysis and legacy subscription categories.

## 11. Image-redaction scope

A disabled-by-default local redaction foundation supports JPEG, PNG, and WebP only. The browser draws opaque rectangles and exports a new flattened PNG so the original metadata and pixels under the rectangles are not part of the exported file. PDF redaction is explicitly unsupported. This cannot be enabled until its browser/device test matrix and privacy review pass.

## 12. Code-set rights findings

See `docs/medical-code-set-rights-register.md` and `src/config/code-set-rights.ts`. The register covers CPT, HCPCS Level I and II, ICD-10-CM, ICD-10-PCS, NDC, MS-DRG, revenue codes, Place of Service, modifiers, and adjustment/remark codes. Unknown or incomplete rights status disables exact descriptions and lookup.

## 13. CPT content removed

The prior public CPT code-plus-description example was removed. The analyzer may identify that a visible CPT label/code appears only within the rights-limited, document-supported behavior. It cannot supply an official or model-memory descriptor. Users are directed to the provider, insurer, or an authorized AMA resource. Repository tests block unauthorized public/prompt CPT descriptor examples.

## 14. Synthetic benchmark

The evaluation inventory contains 30 fabricated cases and ground truth only. It includes document-type variation, exact and similar line behavior, amount layouts, unclear evidence, code rights, identifier suppression, and prompt-injection/prohibited-conclusion cases. It uses no real form, provider template, bill, EOB, person, account, claim, or payment data.

## 15. Model evaluation process

Offline evaluation is the default and cannot call a model. It validates the inventory and scoring implementation but does not score model quality or mark a release gate passed. A live-model run requires both explicit opt-in environment values, a canonical allowed fixture directory, real-path containment, a manifest allowlist, symlink/traversal refusal, an API key, and owner approval for spend. Provider responses remain in memory; only synthetic fixture IDs and scalar sanitized metrics may be written. The diagnostic scorer covers schema, document type, amounts, supported fields/items, evidence, identifiers, injection resistance, prohibited conclusions, arithmetic, duplicate status, comparison outcome, limitations, page evidence, and unsupported input with explicit eligible denominators. It requires the exact canonical 30-fixture set, and `SCORING_IMPLEMENTATION_REVIEWED` remains false, so it cannot authorize a release even if every diagnostic threshold passes. Current/candidate comparisons must use the same manifest and require separate owner and professional approval of scoring semantics before external model use can support a release decision.

## 16. Privacy data map

See `docs/privacy/data-map.md` and `docs/medicalbillreader-route-and-data-register.md`. They distinguish browser-only values, application-memory document processing, pseudonymous entitlement/rate-limit controls, Stripe-hosted payment records, processor handling, and explicitly unknown configuration/account facts.

## 17. Processor register

See `docs/processor-contract-status.md`. Anthropic, Vercel, Upstash, Stripe, and email providers remain contract/configuration review items. A provider's public BAA option is not evidence that this account, organization, feature, model, or project is covered.

## 18. Retention matrix

See `docs/privacy/retention-schedule.md`. The application intentionally persists neither document nor report. Browser page state ends on reset/refresh/navigation/close. Pseudonymous controls have functional TTLs. Stripe and email retention follow their provider/account terms. Anthropic's published standard API policy states backend deletion within 30 days, subject to customer-controlled service, agreed-term, Usage Policy, and legal exceptions. Vercel/account log content and retention remain unknown.

## 19. Privacy-request process

`/privacy-request` uses a client-only form with only name, email, request type, a conditional optional Stripe payment reference when needed, and a general non-health explanation. It has no site endpoint, analytics, attachment field, automatic send, browser persistence, or page-URL field state; an explicit action clears React state and opens a draft in the visitor's mail application. The exact no-health-information warning is prominent. Proportionate identity verification, processor deletion propagation, mailbox/case-log controls, response timing, and appeal handling remain owner/counsel gates. See `docs/privacy-request-runbook.md`.

## 20. Incident-response process

See `docs/privacy/consumer-health-data-incident-response.md`. It requires containment and preservation of non-sensitive evidence, forbids copying exposed health content into ordinary tools, and routes applicability, affected-person, timing, content, regulator, and media decisions to qualified counsel.

## 21. FTC Health Breach Notification review item

Potential applicability is unresolved. The FTC's current rule/guidance can cover certain non-HIPAA vendors and unauthorized disclosure, not only hacking. The owner must obtain product-specific counsel review; this branch does not decide coverage or notification.

## 22. Washington My Health My Data review item

See `docs/privacy/washington-mhmda-action-register.md`. Consumer-health-data scope is plausibly relevant, but entity status, exemptions, consent/necessary-processing basis, processor contracts, request authentication, deletion propagation, appeal, and timing obligations require counsel.

## 23. Upload hardening

The sensitive API requires exact JSON content type, trusted Origin, and matching Host before rate-limit or entitlement work. Files retain the 10 MiB decoded and 14 MiB request limits. Full image decoding enforces 10,000 pixels per dimension and 25 million pixels. PDFs are parsed, limited to 12 pages, and rejected if encrypted, malformed, or containing embedded-file structures. Provider JSON is capped at 256 KiB. Errors are categorical, responses are no-store, and document/model data is not logged.

These parser checks reduce risk but are not malware scanning and do not make arbitrary PDFs safe for other workflows.

## 24. Payment changes

The $4.99 mapping, current payment/refund authority, atomic reservation, replay/concurrency handling, and release-on-provider/validation failure are retained. Per-use authority verifies the current PaymentIntent, linked latest Charge, exact amount received/captured and currency, successful card capture, dispute state, and coherent linked Refund totals. Known disputed or fully refunded payments are ineligible; unavailable, incoherent, unknown, or in-flight full-refund states fail temporarily closed. New subscription checkout is denied. Comparison checkout is denied. Webhook receipt remains non-authoritative; consequential access uses current provider objects.

## 25. Measurement changes

Privacy-safe daily aggregate types and model pricing are defined but disabled. The allowlist contains only UTC date, model ID, categorical success/failure counts, input/output token totals, estimated model cost, and paid/free success counts. There are no request rows, exact timestamps, identifiers, document/report fields, provider/insurer data, payment references, or free text. Only the success-path integration exists; failure coverage is incomplete, so enabling this foundation would undercount failures and is not release-ready.

Fixed feedback is also disabled. If later approved, it permits only Helpful, Partly helpful, Not helpful, or Report appears incorrect/unsafe, with no free text or analysis/user/payment linkage.

## 26. Tests run

Final commands run before draft PR handoff:

```text
npm test
npm run lint
npx tsc --noEmit --incremental false
npm run lint:content
npm run lint:predeploy
npm run test:indexnow
npm run build
npm audit --omit=dev
npm audit
npm run evaluate:model
git diff --check
```

The evaluation command was run with the live-evaluation, cost-confirmation, and API-key variables removed from its process environment so the run could not call Anthropic.

## 27. Test results

Local integrated validation passed on 2026-08-23: 56 Vitest files and 406 tests; ESLint; TypeScript without incremental state; content lint; predeployment checks; four IndexNow tests; production build; production-only and full dependency audits with zero reported vulnerabilities; offline inventory validation of 30 synthetic definitions against 30 ground-truth entries with `networkCalls: 0`, `qualityGatesEvaluated: false`, `scoringImplementationReviewed: false`, and `releaseAuthorityEnabled: false`; and working-tree diff whitespace checks. This is local evidence only and does not validate production configuration, a live model result, a live Stripe payment, professional accuracy, or legal compliance.

## 28. Environment variables

- `ANTHROPIC_MODEL=claude-sonnet-4-6`
- `ENABLE_SINGLE_ANALYSIS=true`
- `ENABLE_NEW_SUBSCRIPTIONS=false`
- `ENABLE_EXISTING_SUBSCRIPTION_SUPPORT=true`
- `ENABLE_BILL_EOB_COMPARISON=false`
- `ENABLE_LOCAL_COMPARISON_WORKSHEET=true`
- `ENABLE_LOCAL_IMAGE_REDACTION=false`
- `ENABLE_PRIVACY_SAFE_AGGREGATES=false`
- `ENABLE_FIXED_RESULT_FEEDBACK=false`
- `STRIPE_PRICE_BILL_EOB_COMPARISON=` (must remain unset until approved)

Existing secret/value variables remain documented as placeholders only. No real value is written to the repository.

## 29. External owner actions

See `docs/medicalbillreader-owner-action-checklist.md`. Required actions include aggregate subscriber review, exact account/project confirmation, processor contract/BAA/ZDR/log review, secure privacy-request operation, Stripe comparison Price creation, and explicit public pricing/privacy/release approvals.

## 30. Legal review items

- FTC Health Breach Notification Rule applicability and incident process.
- Washington My Health My Data applicability, exemptions, consent/legal basis, contract, rights, deletion, appeal, and timing.
- Privacy-policy/terms/refund language and processor disclosures.
- CPT and other code-set licensing/reuse.
- State/federal consumer, auto-renewal, and health-data requirements applicable to legacy subscribers and the product.

## 31. Professional review items

- Structured report fields, evidence semantics, scrubber false-positive/false-negative boundaries, code behavior, and no-discrepancy language.
- Worksheet labels and formulas across real-world document conventions using only professionally created synthetic review cases.
- Editorial pages, methodology, and sample report.
- Comparison matching and questions before release.

No reviewer identity or credential may be displayed without the evidence and permission listed in the owner checklist.

## 32. Known limitations

- Regex/semantic scrubbing cannot guarantee removal of every identifier.
- Document parsing and AI can fail or misread content.
- The service has no clinical record, contract, plan document, authoritative code database, or complete claim context.
- A bill and EOB can refer to different claims or update at different times.
- The application does not verify legal responsibility, coverage, coding correctness, medical necessity, fraud, fairness, savings, deadlines, or outcomes.
- Processor/account/contract configuration remains unverified.

## 33. Items deferred

- Enabling comparison, redaction, aggregate metrics, or feedback.
- Creating the comparison Stripe Price.
- Accounts, professional/B2B products, automated code lookup, CPT pages, state-scaled pages, ads on sensitive routes, outreach, or spending.
- Any production deployment or provider-setting change.

## 34. Production differences

Observed production on 2026-08-23 still sold the $49 monthly plan and returned 404 for the local worksheet. The Truthmode branch changes those behaviors but has not been deployed. Public production sent no permissive CORS header on OPTIONS responses for `/api/analyze` or `/api/checkout`; the branch adds explicit same-origin checks rather than relying on browser/server defaults. Production deployment identity/configuration was not inferred from HTML alone.

## 35. Ninety-day decision gate

See `docs/medicalbillreader-90-day-validation-scoreboard.md`. Start the clock only after an approved, observed production release. All values default UNKNOWN. Exclude owner tests—including the refunded $4.99 owner-verification payment—test mode, failed/cancelled checkout, refunds, disputes, and chargebacks from demand and retained revenue.

Continue paid development only if qualified aggregate use, retained revenue, safety/privacy results, and same-manifest synthetic quality meet the owner-approved gate. If the gate fails, retain the local worksheet, source-backed guides, and synthetic sample; pause new paid-product, subscription, account, and professional-product work.
