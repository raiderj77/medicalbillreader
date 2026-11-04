## 2026-11-03 addendum: price and dispute kit

The offer was reworked from $19 to $16.99, with a dispute kit added: a ready-to-send dispute letter, a billing-office phone script, and a dispute checklist at no extra charge. Fill in the letter blanks and verify every detail before sending.

The $16.99 one-time Stripe price (price_1UXxNYD6Nip7FMaN4gfXu5tW) and STRIPE_PRICE_FULL_ANALYSIS production environment setting are already configured. The historical "Create the $19.00 one-time live Stripe price" deployment step below is superseded. Fail-closed price validation now requires 1699 cents. No production configuration was changed in this worktree.

Historical report follows unchanged.

# MBR free scan → $19 full analysis

Completed within this worktree. No git commands, pushes, PRs, merges, deployments, Stripe account actions, or real environment changes were performed. Subscription configuration and src/lib/entitlement.ts were not changed.

## Files changed

- src/lib/bill-analysis-prompt.ts — added limited scan instructions and prompt with privacy, uncertainty, and output restrictions.
- src/lib/analysis-cost.ts — added the 600-token scan output cap.
- src/app/api/analyze/route.ts — selected prompt and cap by reservation kind and returned the delivered tier.
- src/lib/analyze-access.ts — typed the optional tier response.
- src/components/BillAnalyzer.tsx — captured tier and displayed the real purchase component after scan results only.
- src/components/SingleAnalysisPurchase.tsx — labeled the purchase CTA “Unlock Full Analysis”; checkout request and handling unchanged.
- src/lib/stripe.ts — set per-use price to 1900 cents and preferred STRIPE_PRICE_FULL_ANALYSIS with the legacy fallback.
- .env.example — documented the new price variable and legacy alias using placeholders only.
- src/components/PricingClient.tsx — distinguished Free Scan from the $19 full analysis, including feature lists, selection guidance, FAQs, and CTAs.
- src/components/ArticleCTA.tsx — described free scan access and $19 full itemized analysis.
- src/app/pricing/layout.tsx — updated both pricing descriptions.
- src/app/terms/page.tsx — updated the pay-per-bill amount.
- CLAUDE.md — updated free and single-analysis access lines; subscription line unchanged.
- tests/analyze-route.test.ts — verified free, paid, and subscription tiers, exact prompts and caps, and commit/accounting behavior.
- tests/bill-analyzer-tier.test.ts — added rendered scan/full result checks using synthetic non-health content.
- tests/bill-analyzer-entitlement.test.ts — verified tier propagation and component wiring.
- tests/stripe-config.test.ts — verified $19 mapping, new-variable precedence, legacy fallback, and existing fail-closed validations.
- tests/checkout-route.test.ts — updated the expected price-model description.
- tests/stripe-webhook-route.test.ts — updated synthetic per-use refund amounts.
- tests/entitlement.test.ts — updated synthetic per-use configuration and payment/refund fixtures to $19.
- tests/project-instructions.test.ts — updated the documented price assertion.
- tests/seo-phase-one.test.ts — updated acquisition-copy assertions.
- tests/qualified-funnel-navigation.test.ts — updated the free-scan copy assertion.
- tests/browser/pricing-policy.spec.ts — updated the purchase-button accessible name assertion.
- REPORT.md — recorded completion, validation, and coordinator TODOs.

## Free/paid gate

The authoritative server reservation kind selects the output: free uses BILL_SCAN_INSTRUCTIONS, buildBillScanPrompt(), and 600 output tokens, returning tier “scan”. Paid per-use and subscription reservations use the existing full instructions, prompt, and 2000-token cap, returning tier “full”. Reservation, commit, release, rate limits, and paid-attempt accounting retain their existing semantics. Each successfully completed response commits once. The scan is restricted to supported potential-issue status, approximate counts, and broad categories; it must not disclose itemized details or dispute instructions. These restrictions are model instructions, not a separate deterministic output validator.

The client shows scan results with a separated $19 one-time full-analysis panel and the existing checkout component. Full results retain their existing presentation. ENABLE_SINGLE_ANALYSIS remains enforced server-side without changes.

## Validation

- ./node_modules/.bin/vitest run — 43 files passed, 337 tests passed.
- ./node_modules/.bin/tsc --noEmit --incremental false — passed.
- Reviewed edited React components for hook ordering, conditional result display, accessible panel labeling, and use of the existing checkout path.
- Updated the browser policy assertion; the Playwright suite was not run.
- Vitest emitted its existing configuration-loader compatibility warning; all tests completed successfully.

Checklist: [CTA + claims-honesty items applied to pricing copy] / [checklist items dropped + why] / proof sources: none — no proof claims made

Pricing includes a CTA to run the free scan and a CTA to unlock the full analysis when purchases are enabled. Copy uses qualified findings and does not invent savings, results, testimonials, user counts, or urgency. No applicable CTA or claims-honesty checklist items were dropped.

## TODO for coordinator

- Create the $19.00 one-time live Stripe price.
- Set STRIPE_PRICE_FULL_ANALYSIS in the production environment to that price ID.
- Keep ENABLE_SINGLE_ANALYSIS handling unchanged.
- Until the configured environment price matches $19, verifiedStripePriceId will reject checkout by design. The legacy STRIPE_PRICE_PER_USE alias remains a fallback and is subject to the same validation.
