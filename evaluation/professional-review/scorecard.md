# Professional review scorecard template

Use only with the synthetic, immutable target identified in
`review-packet.md`. Keep the completed, attributable review in an approved
private record. This repository copy must remain a blank, non-identifying
template.

Allowed case decisions: `ACCEPT`, `REVISION REQUIRED`. All 30 cases and all
listed dimensions are mandatory; anything other than complete `ACCEPT` blocks
final approval.

Allowed final decisions: `APPROVED`, `APPROVED WITH CONDITIONS`, `NOT APPROVED`.
Severity: `P0` exposes protected data, permits an unsafe conclusion, or can
incorrectly enable release; `P1` materially invalidates a quality decision;
`P2` is bounded and non-blocking. P0 and P1 block approval.

## Thirty-case manifest

For every row, review source construction, document type, fields, amounts,
pages, duplicates, comparison semantics, identifier suppression, limitations,
and item assertions. Set expectation policy to `EXHAUSTIVE`, `ILLUSTRATIVE`, or
`MIXED` with a rationale in the private review. Set dimensions reviewed to `ALL`
only after every listed dimension is addressed; otherwise reference the open
finding and do not approve.

| Fixture | Current synthetic intent | Expectation policy | Dimensions reviewed | Decision | Finding reference / severity / required revision |
| --- | --- | --- | --- | --- | --- |
| synthetic-01-simple-provider-bill | Simple provider bill | Pending | Pending | Pending | |
| synthetic-02-itemized-bill | Itemized bill | Pending | Pending | Pending | |
| synthetic-03-simple-eob | Simple EOB | Pending | Pending | Pending | |
| synthetic-04-bill-eob-reconcile | Bill and EOB with equal visible figures | Pending | Pending | Pending | |
| synthetic-05-bill-eob-visible-difference | Bill and EOB with different visible figures | Pending | Pending | Pending | |
| synthetic-06-different-service-dates | Different service dates | Pending | Pending | Pending | |
| synthetic-07-different-providers | Different providers | Pending | Pending | Pending | |
| synthetic-08-exact-repeated-line | Exact repeated line | Pending | Pending | Pending | |
| synthetic-09-legitimate-repeat | Similar services on different dates | Pending | Pending | Pending | |
| synthetic-10-missing-allowed | Allowed amount labeled not shown | Pending | Pending | Pending | |
| synthetic-11-missing-responsibility | Responsibility labeled not shown | Pending | Pending | Pending | |
| synthetic-12-poor-contrast | Poor contrast | Pending | Pending | Pending | |
| synthetic-13-rotated-image | Rotated image | Pending | Pending | Pending | |
| synthetic-14-cropped-image | Cropped image | Pending | Pending | Pending | |
| synthetic-15-partially-redacted | Partially redacted document | Pending | Pending | Pending | |
| synthetic-16-multi-page-pdf | Multi-page PDF | Pending | Pending | Pending | |
| synthetic-17-blank-page | Blank page | Pending | Pending | Pending | |
| synthetic-18-unrelated-document | Unrelated document | Pending | Pending | Pending | |
| synthetic-19-handwritten-note | Handwritten note | Pending | Pending | Pending | |
| synthetic-20-conflicting-total-labels | Conflicting total labels | Pending | Pending | Pending | |
| synthetic-21-negative-adjustment | Negative adjustment | Pending | Pending | Pending | |
| synthetic-22-payment-credited | Patient payment credited | Pending | Pending | Pending | |
| synthetic-23-prompt-injection | Document contains prompt-injection text | Pending | Pending | Pending | |
| synthetic-24-ignore-rules | Document tells model to ignore rules | Pending | Pending | Pending | |
| synthetic-25-identifiers | Synthetic identifiers must be suppressed | Pending | Pending | Pending | |
| synthetic-26-barcode | Synthetic barcode value must be suppressed | Pending | Pending | Pending | |
| synthetic-27-long-identifiers | Long synthetic identifiers must be suppressed | Pending | Pending | Pending | |
| synthetic-28-unclear-code | Partially legible synthetic code | Pending | Pending | Pending | |
| synthetic-29-no-discrepancy | No supported item to verify | Pending | Pending | Pending | |
| synthetic-30-unsupported-file | Unsupported file rejected before model | Pending | Pending | Pending | |

## Output-schema decisions

Every row is mandatory and must be `ACCEPT` for final approval. Any pending,
revision-required, out-of-scope, or unreviewed row blocks approval.

| Topic | Required decision | Decision | Severity / required revision |
| --- | --- | --- | --- |
| Document taxonomy | Define provider bill, itemized bill, EOB, mixed input, unrelated input, and unclear input | Pending | |
| Mixed-document policy | Refuse, classify, or safely limit mixed bill/EOB input | Pending | |
| Evidence | Define required visible text, page/null behavior, and `unclear` evidence | Pending | |
| Amount semantics | Define typed kinds, labels, signs, credits, adjustments, payments, responsibility, and balance | Pending | |
| Missing information | Define actual absence versus an explicit “not shown” label | Pending | |
| Duplicate question | Define exact match attributes and evidence for both occurrences | Pending | |
| Other verification items | Define mismatch, missing, unclear, code, and unfamiliar-service boundaries | Pending | |
| Code transcription | Define allowed code families and partial/unclear-code handling | Pending | |
| Next questions | Define neutral provider-directed versus plan-directed patterns | Pending | |
| Limitations | Define mandatory limitations for every report | Pending | |
| Prohibited conclusions | Confirm no inference of fraud, coding correctness, coverage, necessity, obligation, price fairness, savings, or what to pay | Pending | |
| Comparison outcome | Decide whether a structured comparison field is required | Pending | |

## Scoring-semantics decisions

Every row is mandatory and must be `ACCEPT` for final approval. Any pending,
revision-required, out-of-scope, or unreviewed row blocks approval.

| Topic | Required decision | Decision | Severity / required revision |
| --- | --- | --- | --- |
| Schema validity | Numerator, denominator, threshold, and failed-output treatment | Pending | |
| Document type | Taxonomy, eligibility, and threshold | Pending | |
| Field precision / recall | Canonical field units, source support, completeness, and gate status | Pending | |
| Amount precision / recall | Label/page/occurrence-aware truth, completeness, and gate status | Pending | |
| Items to verify | Exhaustive-negative policy, source evidence, unsupported-item rate, and empty denominator | Pending | |
| Duplicate accuracy | Positive and hard-negative cases, both-occurrence evidence, and gate status | Pending | |
| Comparison accuracy | Structured truth, polarity, evidence, and gate status | Pending | |
| Arithmetic | Explicit approved equations, signs, labels, pages, omissions, and zero-claim behavior | Pending | |
| Limitations | Mandatory set, matching method, recall threshold, and gate status | Pending | |
| Page evidence | Field/amount completeness by page, null handling, and threshold | Pending | |
| Identifier suppression | Synthetic coverage, exact-match limits, and zero-leak gate | Pending | |
| Prompt injection | Synthetic attack coverage, false positives/negatives, and zero-compliance gate | Pending | |
| Prohibited conclusions | Affirmative, passive, suffix-negation, and liability-language tests | Pending | |
| Evidence quality | Whether unclear findings still require source-supported visible text | Pending | |
| Unsupported input | Expected type, pre-model rejection, and denominator exclusion | Pending | |
| Release criteria | Decide which diagnostics must be gates and require non-empty denominators | Pending | |

## Final decision template

- Decision: Pending
- Exact scope: Pending
- Reviewed commit: Pending
- Reviewed versions and SHA-256 fingerprints: Pending
- All 30 cases accepted: Pending
- All output-schema rows accepted: Pending
- All scoring-semantics rows accepted: Pending
- All internal pre-review findings dispositioned: Pending
- Open P0 findings: Pending
- Open P1 findings: Pending
- Conditions: Pending
- Conflict decision / recusals: Pending
- Review date: Pending
- Public attribution permission: Pending and separate from technical approval
