# Qualified medical-billing review packet

Status date: 2026-08-23

Status: **owner authorized; reviewer identity/engagement evidence is not available in this workspace; review not complete**

Machine-readable gate mirror: `evaluation/professional-review/approval.json`

## Purpose and strict boundary

The owner authorized a qualified medical-billing professional to review exactly:

1. the 30-case synthetic manifest and its provisional expected outputs;
2. the bill-analysis output schema; and
3. the evaluation scoring semantics.

Authorization is not a professional decision, release approval, live-model-run
approval, spending approval, public attribution permission, or permission to
contact an unnamed person. The review must use only repository-generated
synthetic material. Do not provide or request a real bill, EOB, medical record,
patient or customer record, payment record, credential copy, secret, or
analytics identifier through this repository or ordinary email.

This narrow review does **not** approve the analyzer prompt, renderer, worksheet,
methodology or editorial pages, comparison runtime, privacy or legal compliance,
code-set licensing, pricing, checkout, refunds, deployment, model quality, or a
public accuracy claim. Those gates remain separate and disabled.

## Reviewer qualification and independence

The preferred reviewer has an active Certified Professional Biller (CPB)
credential plus at least two recent years of direct U.S. experience with
provider bills, EOBs, patient responsibility, adjustments, payment posting,
denials, and provider-versus-plan follow-up. AAPC describes CPB as validating
medical-billing, reimbursement, denial, and revenue-cycle knowledge, but its
current pathway can also serve people entering the field; direct experience
must therefore be checked separately.

A demonstrably equivalent billing/revenue-cycle professional may qualify when
the owner documents the reason privately. A coding credential or patient-
advocacy credential alone is not enough unless recent bill/EOB experience is
also verified. Credential status should be checked with the issuing body. Store
only verification booleans in this repository—never a credential number, copy,
personal contact detail, or identity evidence.

Qualification references:

- [AAPC Certified Professional Biller](https://www.aapc.com/certifications/cpb)
- [AAPC credential verification](https://www.aapc.com/certification/credential-verification.aspx)
- [Patient Advocate Certification Board BCPA](https://www.pacboard.org/what-does-bcpa-mean/)

Before work begins, obtain a written conflict disclosure covering provider,
payer, billing-vendor, collections, advocacy, code-set, referral, and product
relationships. Use fixed or hourly compensation, not compensation contingent on
an approval, error finding, referral, dispute, or savings claim. The reviewer
must not approve their own implementation work. An unresolved material conflict
means no approval.

## Exact review target

Review an immutable commit, not a moving branch. Run:

```text
npm run review:targets -- --assert-ready
```

The command fails unless Git identifies the exact commit and the worktree is
clean. Attach its repository-only output to the private review record. The
written decision must repeat the exact commit SHA, every target version, and
every SHA-256 fingerprint. The machine gate verifies that the reviewed commit
exists in the current history and that each reviewed file at that commit matches
both the recorded and current target fingerprint. The private written evidence
and reviewer qualification still require separate owner verification. Any
change to a reviewed target invalidates its prior approval.

Professionally reviewed semantic targets:

| Target | Repository file |
| --- | --- |
| Synthetic definitions | `evaluation/fixtures/definitions.json` |
| Provisional ground truth | `evaluation/ground-truth/ground-truth.json` |
| Output schema | `src/lib/bill-analysis-schema.ts` |
| Scoring implementation | `evaluation/harness.ts` |

Machine-integrity dependencies are fingerprinted but are not being presented as
medical-billing content for the professional to approve:

| Dependency | Repository file |
| --- | --- |
| Output parser/runtime contract | `src/lib/bill-analysis-output.ts` |
| Output scrubber | `src/lib/bill-analysis-scrubber.ts` |
| Code-rights configuration | `src/config/code-set-rights.ts` |
| Approval-gate implementation | `evaluation/professional-review.ts` |

The blank `evaluation/professional-review/scorecard.md` is a supporting template,
not a fingerprinted approval target. An engineering or owner change to any
fingerprinted semantic target or machine-integrity dependency invalidates the
recorded approval; editing only the blank template does not.

The prompt version may be recorded as context but is outside this authorized
scope. The runtime parser, scrubber, renderer, prompt, and code-rights
enforcement are also outside the professional semantic decision even where
their files are fingerprinted for machine integrity. No live provider call is
necessary or authorized for this semantic review. `npm run evaluate:model` must
remain in its default offline mode.

## Required review method

### A. Review every synthetic case

Complete every row in the scorecard. For each case, decide whether the source
construction and every expected type, field, amount, page, duplicate status,
comparison outcome, identifier rule, limitation, and item assertion are safe
and realistic. Mark each expectation as exhaustive or illustrative. An empty or
missing assertion must never be silently treated as a professionally approved
negative case.

All 30 cases are mandatory within the authorized scope. Final approval requires
every case decision to be `ACCEPT`, every dimension to be reviewed, and every
expectation policy to be explicitly classified as exhaustive, illustrative, or
mixed with a rationale. A `Pending`, `REVISION REQUIRED`, `OUT OF SCOPE`, or
unreviewed value blocks `APPROVED`. Any revision creates a new immutable target
set and requires re-review.

### B. Review the output schema

Every output-schema scorecard row is mandatory. Final approval requires
`ACCEPT` for every row; `Pending`, `REVISION REQUIRED`, `OUT OF SCOPE`, or an
unreviewed row blocks `APPROVED` and requires a revised immutable target and
re-review.

Decide whether document types are mutually understandable; whether mixed bill
and EOB input has a safe policy; whether amount labels, signs, and semantic
kinds are sufficient; whether every material finding needs source evidence;
whether missing versus unclear information is defined; whether duplicate and
amount-mismatch questions are neutral; whether code transcription is safe; and
which limitations must be mandatory.

The schema must not imply coding correctness, coverage, medical necessity,
fraud, illegality, legal responsibility, price fairness, savings, or what a
person should pay. CMS distinguishes an EOB from a bill and describes provider
charges, allowed charges, insurer payment, and patient balance as separate
concepts; the review should preserve those distinctions rather than infer a
legal obligation from a visible figure. See [CMS on reading an
EOB](https://www.cms.gov/medical-bill-rights/help/guides/explanation-of-benefits)
and [CMS on checking a bill](https://www.cms.gov/medical-bill-rights/help/guides/bill-errors).

### C. Review every scoring semantic

Every scoring-semantics scorecard row is mandatory under the same accept-only
rule. A missing or non-`ACCEPT` decision blocks `APPROVED`.

For each metric and release gate, review its numerator, denominator,
eligibility rule, zero-denominator behavior, threshold, false-positive cases,
false-negative cases, and failure handling. Explicitly decide whether amount
recall, field recall, unsupported-field rate, duplicate accuracy, comparison
accuracy, and limitation recall must be release gates rather than diagnostics.

Review arithmetic only against explicit labeled, page-aware ground-truth
equations. Review prohibited-conclusion negation, comparison polarity,
source-backed evidence, page mapping, unsupported items, duplicate criteria,
and schema/provider/scoring failure treatment. Do not accept a semantic merely
because its current test passes.

## Internal pre-review findings requiring disposition

This is an engineering pre-review, not professional signoff. Each item requires
`ACCEPT`, `REVISION REQUIRED`, or `OUT OF SCOPE` in the written decision:

1. No fixture has expected code, next-question, or explicit arithmetic
   assertions; only four fixtures have explicit items-to-verify assertions.
2. Expected fields mix field names, values, headings, and conclusions, so field
   precision and recall do not currently measure one defined concept.
3. Expected amounts are deduplicated values without label, page, or occurrence,
   so repeated equal figures cannot be attributed to the correct document.
4. Mixed bill/EOB cases are scored through a single-document schema. The term
   “reconciles” overstates what two equal visible figures alone establish.
5. Missing-field cases contain the phrase `NOT SHOWN`; they do not test a truly
   absent field.
6. Poor-contrast, cropped, redacted, partial-code, and unsupported-input
   acceptance behavior is not decision-complete.
7. `provider_bill`, `itemized_bill`, `other`, and mixed-document behavior
   overlap or lack a clear policy.
8. Amounts have free-text labels rather than typed semantic kinds or an approved
   sign/display rule for adjustments, credits, payments, and balances.
9. Item evidence is nullable even though the prompt requires evidence;
   `unfamiliar_service` depends on user context the model does not have.
10. Mandatory report limitations and neutral provider-versus-plan next
    questions are not comprehensively asserted.
11. Code-rights behavior and clear/unclear code transcription are not
    meaningfully tested; licensing remains a separate legal review.
12. The ten provisional release gates omit several reported diagnostics, and
    arithmetic/comparison logic relies on text heuristics rather than explicit
    structured truth.
13. Important denial, pending, corrected-EOB, timing, credit, modifier,
    split-line, repeated-line, multi-claim, and OCR-confusion cases are absent.

Severity meanings for this review are: `P0`—a defect that can expose protected
data, enable an unsafe prohibited conclusion, or incorrectly enable release;
`P1`—a material benchmark, schema, safety, or scoring defect that makes a quality
decision unreliable; `P2`—a bounded improvement that does not invalidate the
decision. P0 and P1 findings block approval.

Any open P0 or P1 finding blocks approval. A conditional decision also leaves
release authority disabled until every condition is closed and confirmed in
writing against a new immutable target set.

## Required written decision

The reviewer must return one of `APPROVED`, `APPROVED WITH CONDITIONS`, or `NOT
APPROVED` and include:

- the exact approved scope, commit, versions, and fingerprints;
- the completed 30-case, schema, and scoring scorecards;
- a dated finding log with severity, rationale, and any authoritative sources;
- an explicit decision on every internal pre-review finding;
- the conflict decision and any recusals;
- all conditions and unresolved questions; and
- separate permission or refusal for public attribution.

After private identity, qualification, experience, scope, conflict, and written-
decision evidence is verified, the owner may update only the non-sensitive
booleans and target fingerprints in `approval.json`. `SCORING_IMPLEMENTATION_REVIEWED`
is derived from that record and remains false unless the decision is fully
approved, zero blocking findings remain, every target matches, and the owner
accepts the decision. Never add reviewer identity evidence to Git.
