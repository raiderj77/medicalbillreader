# Medical Bill Reader owner action checklist

Status date: 2026-08-23
Default status: **not verified / not approved**
Rule: Do not put customer, bill, health, payment, credential, or analytics-identifier data in this file, an issue, a pull request, or ordinary email.

## Before any production release

- [ ] Review the Truthmode pull request, production diff, and validation report.
- [ ] Approve the public Free, $4.99 single-analysis, and disabled $9.99-coming-later presentation.
- [ ] Approve the public privacy text after specialist review.
- [ ] Approve a specific production release commit and release window.
- [ ] Record the production release date only after the deployment is independently observed.

## Existing subscribers and Stripe

- [ ] In the correct Stripe account, check the aggregate count of active, trialing, past-due, paused, unpaid, cancelled, and otherwise ineligible subscriptions. Do not export or record customer rows here.
- [ ] Decide the support period for any verified existing subscribers before removing legacy price configuration or portal access.
- [ ] Verify the current $4.99 price object and refund policy mapping without creating a live charge.
- [ ] Create and verify a distinct $9.99 comparison Price only after every comparison release gate is approved. Do not reuse a single-analysis or subscription Price.

## Processor and privacy readiness

- [ ] Confirm the exact Anthropic organization used by production.
- [ ] Review Anthropic zero-data-retention eligibility and covered-model limitations.
- [ ] Review and, if appropriate, complete Anthropic BAA eligibility and first-party API activation for that exact organization. Public availability is not account coverage.
- [ ] Review Vercel BAA eligibility, pricing, project coverage, log fields, and retention for the exact production project.
- [ ] Review Upstash service terms, region, access controls, key retention, and consumer-health-data requirements.
- [ ] Review Stripe's role and agreements for payment, refund, customer, and subscription records.
- [ ] Obtain or document necessary processor instructions, data-protection terms, and deletion-assistance terms.
- [ ] Approve a secure, proportionate identity-verification path for privacy requests; ordinary email must not receive bills or health data.

## Specialist decisions

- [ ] Obtain a U.S. consumer-health-data privacy attorney's written review of the product-specific FTC Health Breach Notification Rule and Washington My Health My Data applicability, notice, consent/legal-basis, request, deletion-propagation, appeal, incident, and processor requirements.
- [ ] Obtain a qualified medical billing professional's written review of the analyzer schema, renderer, worksheet formulas/labels, methodology, synthetic benchmark, and prohibited-conclusion boundaries.
- [ ] Verify any reviewer identity, relevant credential, exact scope, written approval, publication permission, review date, and conflict disclosure before publishing attribution.
- [ ] Resolve AMA CPT licensing for this exact public product and AI use. Until written authorization is on file, keep exact descriptors, descriptor lookup, and individual-code explanations disabled.
- [ ] Review reuse rights for HCPCS Level II, ICD-10-CM, ICD-10-PCS, NDC, MS-DRG, revenue, modifier, Place of Service, and adjustment/remark-code content before enabling exact descriptions or lookup.

## Ninety-day validation

- [ ] Approve the aggregate-only measurement design before enabling it.
- [ ] Confirm the aggregate store cannot accept request rows, exact timestamps, IPs, cookies, filenames, document/report text, provider/insurer values, payment references, or analytics identifiers.
- [ ] Start the 90-day scoreboard only after an approved production release.
- [ ] Exclude owner tests, the refunded $4.99 owner-verification payment, test-mode payments, failed/cancelled checkout, refunds, and chargebacks from demand and retained revenue.
- [ ] Make the day-90 continue/pivot/stop decision from retained revenue, qualified use, privacy/safety results, and synthetic quality gates—not checkout-session counts alone.

## Comparison-specific release gate

- [ ] Complete the two-document implementation and strict credit separation.
- [ ] Pass same-manifest synthetic evaluation for both documents and matching logic.
- [ ] Approve file, page, request, provider-response, latency, and cost ceilings.
- [ ] Approve comparison privacy language and five-part consent.
- [ ] Complete professional review.
- [ ] Verify the dedicated Stripe Price and current refund behavior.
- [ ] Change the feature flag only in an owner-approved release after all prior boxes are complete.
