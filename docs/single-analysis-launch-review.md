# Single-analysis launch controls review

Base: d5fd7273f665a9d232a9199c071c1034647cc272, fresh origin/main checkout. Draft source change only; no merge, deployment, provider calls, payments or environment edits.

Responsibility: application security/privacy and product/reliability engineering self-review. Scope: Medical Bill Reader checkout, existing subscriber continuity, local input validation, usage accounting and educational disclaimers. No qualified professional sign-off claimed; formal review is backlog per owner direction.

## Cost controls

Bounded behavior: existing 10 MB upload check; at most 10 PDF pages and 120,000 locally extracted characters; photos resized to fit 1024 x 1024, no enlargement, metadata removed; 2,000 output tokens and no extended thinking. The current product accepts one photo, which is below the 10-image limit. An over-limit array is rejected; this change does not introduce multi-photo support. PDF extraction is local and never logged. Oversized documents receive a split-document message before any Anthropic request. The page stream is drained before cleanup to avoid PDF.js cancellation races.

Each single-analysis paid credit permits at most three lifetime outbound analysis attempts. The counter is committed immediately before the application issues the Anthropic request, so every request that reaches the provider is counted; an ambiguous DNS or transport failure also counts conservatively because provider receipt cannot be proven. Local preflight rejections do not count, and the existing three-per-minute entitlement rate limit remains. Completed, truncated, refused, timed-out, and errored outbound requests all count because they may incur provider usage. A successful report consumes the credit immediately. If the third outbound attempt does not produce a complete report, the credit is consumed and the visitor is directed to `/contact` for manual review or to request a refund. The counter is stored per credit. The anomaly log records only its ordinal and limit, without document content, model output, payment identifiers, customer identifiers, credit identifiers, or IP addresses.

Estimated, not guaranteed: a conservative heavy-PDF planning case is 30,000 text tokens (10 pages x 3,000), 13,690 visual tokens (10 pages x 1,369), and approximately 1,571 prompt tokens (6,282 characters / 4), or 45,261 estimated input tokens. At the pinned planning assumptions of $3 per million input tokens and $15 per million output tokens, plus the enforced 2,000-output-token maximum, that is an estimated $0.165783 per attempt. Applying a 3x safety factor to the entire model-cost estimate gives $0.497349 per attempt. Three outbound attempts therefore estimate to $1.492047, leaving $3.057953 of the audit's $4.55 domestic net before Vercel, Redis, bandwidth, or other operating costs.

This is not a hard input-token ceiling or a guaranteed margin. Characters per token, PDF visual-token usage, provider geography, provider pricing, and infrastructure cost are estimates or may change. Downsizing can reduce small-text legibility; real-document quality was not tested.

Measured: response usage is recorded through existing safeSecurityLog with numeric counts, fixed model ID and computed USD; no content or identifiers. Missing usage is UNKNOWN, not zero. Unexpected cache-write pricing is UNKNOWN. This is API list-price arithmetic, not invoices, transport, hosting or total cost.

Alert: computed cost above COST_ALERT_THRESHOLD_USD (default 1.00) emits a high-severity structured log. No automatic disable. External alert delivery is unverified. ENABLE_SINGLE_ANALYSIS stops new purchases only: free allowances, legacy subscribers and existing credits can still consume AI. Consequently cost does not always track new paid revenue.

Sources checked October 16, 2026:
- https://platform.claude.com/docs/en/about-claude/pricing
- https://platform.claude.com/docs/en/build-with-claude/pdf-support
- https://platform.claude.com/docs/en/build-with-claude/vision

## Evidence and limitations

Mocked Stripe rejection checks cover SDK access, price lookup and nonce creation. Production test-mode Price objects fail closed. Legacy entitlement, refund and portal tests are retained. Synthetic PDFs test page/text limits with zero network calls; a synthetic photo tests actual local resize. Route usage logging excludes a synthetic private-content marker. Pricing is server-selected with no flag prop exposed to clients. Browser checks cover both flag states, mobile layout and accessibility; previous document privacy and pending-analysis checks pass.

All tests use synthetic data or mocks. No live checkout, real bill, production credentials, professional review, deployed settings or delivered external alert was verified. New dependencies: pinned unpdf for local PDF.js extraction and direct sharp for local image processing. Audit results are a point-in-time advisory check, not proof of zero risk.

New subscriptions are permanently rejected even if ENABLE_NEW_SUBSCRIPTIONS is set true. Existing subscription verification and portal routes are unchanged. Professional review remains backlog. Ads and analytics remain disabled.
