# Medical Bill Reader 90-Day Validation Scoreboard

Status: NOT STARTED
Last reviewed: 2026-08-23

Every value below begins as UNKNOWN. UNKNOWN means unavailable or not yet
reviewed; it never means zero. Populate this document only with privacy-safe
weekly aggregates. Never include a bill, report, filename, free text from a
user, name, email, IP address, cookie, device value, Stripe identifier, customer
record, payment detail, or analytics identifier.

The refunded $4.99 owner-verification payment is excluded from customer demand
and retained revenue. Owner purchases, refunded owner tests, and Stripe
test-mode activity remain excluded in every week.

## Sources of truth

| Evidence | Authoritative aggregate source | Current status |
| --- | --- | --- |
| Completed payments and retained revenue | Stripe completed live-mode payments, reconciled with refunds, disputes, and credits | UNKNOWN |
| Refund count, rate, and non-sensitive reason categories | Stripe live-mode aggregate reporting plus approved operational categories | UNKNOWN |
| Active subscriptions | Current Stripe provider objects, not webhook events alone | UNKNOWN |
| Model usage and estimated cost | Anthropic aggregate usage and the reviewed model-price snapshot | UNKNOWN |
| Organic clicks, impressions, queries, and pages | Search Console aggregate reporting | UNKNOWN |
| Fixed feedback | Privacy-safe fixed-choice aggregate only, and only when enabled | UNKNOWN |
| Production changes | Repository release records | UNKNOWN |
| Referring domains | Aggregate backlink report with no analytics identifiers | UNKNOWN |

## Weekly record

Week starting: UNKNOWN
Week ending: UNKNOWN
Release or experiment in scope: UNKNOWN

| # | Metric | Value | Source/check |
| ---: | --- | --- | --- |
| 1 | Non-owner single-document purchases | UNKNOWN | Stripe live-mode retained payments |
| 2 | Non-owner comparison purchases | UNKNOWN | Stripe live-mode retained payments |
| 3 | Retained revenue | UNKNOWN | Completed live payments minus refunds, disputes, and credits |
| 4 | Refund count | UNKNOWN | Stripe live-mode aggregate |
| 5 | Refund rate | UNKNOWN | Refund count divided by eligible retained purchases |
| 6 | Repeat purchasers | UNKNOWN | Aggregate Stripe reporting only |
| 7 | Free-analysis completions | UNKNOWN | Privacy-safe aggregate, only if enabled |
| 8 | Paid-analysis completions | UNKNOWN | Privacy-safe aggregate, only if enabled |
| 9 | Comparison completions | UNKNOWN | Privacy-safe aggregate, only if enabled |
| 10 | Input tokens | UNKNOWN | Anthropic aggregate usage |
| 11 | Output tokens | UNKNOWN | Anthropic aggregate usage |
| 12 | Estimated model cost | UNKNOWN | Token aggregates times reviewed model pricing |
| 13 | Stripe fees | UNKNOWN | Stripe aggregate reporting |
| 14 | Hosting and infrastructure cost | UNKNOWN | Provider aggregate billing |
| 15 | Gross margin | UNKNOWN | Retained revenue minus model, Stripe, hosting, and infrastructure costs |
| 16 | Helpful feedback | UNKNOWN | Fixed-choice aggregate only |
| 17 | Partly helpful feedback | UNKNOWN | Fixed-choice aggregate only |
| 18 | Not helpful feedback | UNKNOWN | Fixed-choice aggregate only |
| 19 | Incorrect or unsafe feedback | UNKNOWN | Fixed-choice aggregate only |
| 20 | Search clicks | UNKNOWN | Search Console aggregate |
| 21 | Search impressions | UNKNOWN | Search Console aggregate |
| 22 | Search queries | UNKNOWN | Search Console aggregate |
| 23 | Search pages | UNKNOWN | Search Console aggregate |
| 24 | Independent referring domains | UNKNOWN | Aggregate backlink report |
| 25 | Production errors | UNKNOWN | Privacy-safe operational aggregate |
| 26 | Privacy incidents | UNKNOWN | Approved incident count only |
| 27 | Refund reasons without health details | UNKNOWN | Approved fixed categories only |
| 28 | Current bottleneck | UNKNOWN | Evidence-backed weekly conclusion |
| 29 | Next single experiment | UNKNOWN | One reversible experiment |

## Revenue exclusions

Do not count any of the following as revenue or customer demand:

- Pageviews, search impressions, checkout starts, or button clicks.
- Free reports or worksheet uses.
- Owner purchases, including the refunded $4.99 owner-verification payment.
- Refunded owner tests or any test-mode Stripe transaction.
- Email opens or fixed feedback votes.

Do not count a comparison purchase until a live, non-owner payment is completed
and remains retained. Do not count a subscription from status alone. When
provider or measurement access is missing, keep the value UNKNOWN.

## Ninety-day commercial continuation gate

Continuation requires at least one of:

1. 20 non-owner $4.99 purchases.
2. 10 non-owner $9.99 comparisons.
3. 5 customers make a second purchase, demonstrated only through an approved
   aggregate report.
4. At least $150 retained non-owner revenue.
5. 20 fixed feedback votes with at least 70% marked helpful.

It also requires all of:

1. Refund rate no higher than 10%.
2. Positive gross margin.
3. No known consumer-health-data incident.
4. No known patient-identifier leakage.
5. No prohibited billing conclusion.
6. Synthetic quality gates remain satisfied.

If the gate fails, keep the local worksheet, useful source-backed guides, and
synthetic sample; pause new paid-product development; stop subscription work;
and do not build accounts or professional products. A missing metric cannot be
used to pass the gate.
