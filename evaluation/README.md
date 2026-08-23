# Synthetic model evaluation

This internal benchmark contains 30 fabricated definitions and matching ground
truth. It contains no real bills, provider templates, patient information,
customer records, payment data, or production uploads.

`npm run evaluate:model` performs an offline inventory validation and makes zero
network calls. It reports 29 model-eligible fixtures and one unsupported-input
rejection fixture, but it does not score model quality or mark release gates as
passed. Release authority is also hard-disabled while
`SCORING_IMPLEMENTATION_REVIEWED` is false. That fail-closed review flag is
currently false, so no result from this harness can authorize a model or product
release.

Live evaluation is deliberately gated. It requires all of the following:

1. Owner approval for the API spend and model run.
2. `RUN_LIVE_MODEL_EVAL=1`.
3. `CONFIRM_SYNTHETIC_EVAL_COST=1`.
4. `ANTHROPIC_API_KEY` in the local process environment.
5. `--fixtures evaluation/fixtures` as an explicit path.

Example after approval:

```text
npm run evaluate:model -- --fixtures evaluation/fixtures
```

The live path generates the synthetic images and PDFs in memory, uses the
configured production model and structured schema, never prints or stores raw
provider responses, and writes only scalar pass/fail metrics under
`evaluation/results/`. Result JSON is ignored by Git. Internal release gates
must not be published as product accuracy claims, and a candidate model must be
compared against the current model on the same fixtures before any model change.

Live sanitized results include explicit numerators, eligible denominators, and
pass/fail values for all ten internal engineering gates. The unsupported-input
fixture verifies pre-model rejection and is excluded from schema, document-type,
and model-quality denominators. PDF page evidence is eligible only where page
numbers survive the application contract, and every expected page must appear;
an empty page-evidence set cannot pass. Identifier, prompt-injection, amount,
items-to-verify, material-evidence, and page gates also require their benchmark
denominators to be populated so an empty report cannot appear release-ready.
Overall release status additionally requires the exact canonical 30-fixture ID
set, exactly 29 model-eligible fixtures, the fixed unsupported-input fixture and
its successful pre-model rejection, all ten metric gates, and the separate
scoring-review flag. Partial result arrays fail coverage even when their ratios
look perfect.

The same result summary separately reports amount and field precision/recall,
arithmetic accuracy, duplicate-status accuracy, applicable comparison-outcome
accuracy, expected-limitation recall, identifier suppression, and unsupported
input rejection. Arithmetic assertions are scored only when the output states a
supported dollar equation; an incorrect equation or derived dollar value without
a supported equation is counted as unexplained arithmetic.

Expected items-to-verify now use explicit ground-truth type, exact evidence,
source-occurrence, and page assertions; a real but irrelevant excerpt does not
make an item supported. PDF page scoring checks each finding against the source
page containing its excerpt before page coverage can pass. Comparison and
limitation checks reject opposite-polarity phrases such as “no difference” or
“does decide.” Provider transport failures, output-validation failures, and
local scoring failures are recorded as separate scalar categories without
persisting or logging error or response content.
