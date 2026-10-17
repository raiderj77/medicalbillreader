# Single-analysis launch controls review

Base: b27498a11253a9172440dab2704c055a8dc01416, fresh origin/main checkout. Draft source change only; no merge, deployment, provider calls, payments or environment edits.

Responsibility: application security/privacy and product/reliability engineering self-review. Scope: Medical Bill Reader checkout, existing subscriber continuity, local input validation, usage accounting and educational disclaimers. No qualified professional sign-off claimed; formal review is backlog per owner direction.

## Cost controls

Bounded: existing 10 MB upload check; at most 10 PDF pages and 120,000 locally extracted characters; photos resized to fit 1024 x 1024, no enlargement, metadata removed; 2,000 output tokens and no extended thinking. The current product accepts one photo, which is below the 10-image limit. An over-limit array is rejected; this change does not introduce multi-photo support. PDF extraction is local and never logged. Oversized documents receive a split-document message before any Anthropic request. The page stream is drained before cleanup to avoid PDF.js cancellation races.

Estimated, not guaranteed: roughly $0.02-0.05 for short documents and $0.10-0.15 or more for heavy documents at Sonnet 4.6 list prices ($3/M input, $15/M output). Anthropic describes typical PDF text at 1,500-3,000 tokens per page PLUS image tokens. Ten pages at 3,000 text tokens and maximum output already cost $0.12 before images and prompts. Characters/4 is only a heuristic. Current vision documentation describes 28-pixel patches: a 1024-square photo is estimated at 37 x 37 = 1,369 visual tokens. Downsizing can reduce small-text legibility; real-document quality was not tested. No hard cost ceiling or margin guarantee.

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
