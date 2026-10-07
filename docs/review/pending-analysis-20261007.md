# Keep a pending analysis attached to its selected document

- Responsibility: product/accessibility engineering with application privacy and
  paid-delivery review. Inherit CLAUDE.md, EMPIRE_BUILD_STANDARDS.md at d57a2b8,
  and the owner's standing implementation/release authority. Independent AI
  review supplements implementer review; neither is qualified clinical review.
- Evidence: Remove clears selection while the analysis request is still running.
  A replacement file can then be selected before the original response replaces
  the screen. The server commits entitlement before returning a valid result;
  discarding that response could lose an already-paid result.
- Scope: keep selection and consent stable until the existing request finishes;
  block duplicate synchronous submits, then restore controls on failure and
  normal Analyze Another Bill behavior on success. No backend, payment, policy,
  processor, telemetry, storage, or price changes.
- Sources checked October 7, 2026: React's useRef documentation
  (https://react.dev/reference/react/useRef) supports an event-handler ref for
  immediate state between renders. MDN's disabled attribute documentation
  (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/disabled)
  describes native interaction prevention. React state still renders UI state.
- Acceptance: two held-response browser regressions using an owned blank image,
  synthetic readable access hint and fully mocked analysis responses; success,
  failure, duplicate clicks, stable selection, consent and next-file recovery at
  320px. Credential-free WSL build/browser and unit/lint/type checks, exact-diff
  review, exact-head CI, ordinary PR merge, canonical deployment verification.
- No real medical data or payment/provider request is authorized by these tests.
  Browser mocks do not prove actual paid fulfillment or revenue. New purchases,
  ads and analytics remain outside this repair. No new spend is introduced.

Validation: both held-response regressions failed against d57a2b8, including
selection replacement and two requests from synchronous clicks. The fixed tree
8f28e813ca4a6aeebeaea75967fd9de3d870bfba passed all seven browser cases and
283 unit tests, lint, TypeScript and production build in the credential-free WSL
namespace. Independent AI and implementer exact-diff review passed on that tree;
only this evidence paragraph changed afterward. The disposable build stage used
a local font fixture because network access is denied; its unused-parameter lint
warning does not occur in source. CI must build the unchanged production font.
Actual PR/production verification is recorded in the release receipt after it runs.

## Dependency release gate

The first exact-head CI passed build and browser checks but OSV blocked release
on sharp 0.35.4, source-map-js 1.2.1 and sprintf-js 1.0.3. Primary advisories
checked October 7 identify sharp 0.35.5 and source-map-js 1.2.2 as fixes:
https://github.com/advisories/GHSA-wq5f-xc86-pv6w and
https://github.com/advisories/GHSA-68fv-2mgg-jv7q.
https://github.com/advisories/GHSA-hp3w-g68c-fv3c has no sprintf-js fix.

The lock now uses the two official patched releases and pins official argparse
2.0.1, removing the sole sprintf-js chain from gray-matter -> js-yaml 3 ->
argparse 1. This is dependency replacement, not an upstream sprintf-js patch.
Argparse 3 is deliberately excluded because it removes the legacy APIs used by
js-yaml 3. Argparse 2 preserves the parser, help and invalid-option interfaces;
the actual library consumer and native Next.js sharp binary have dedicated tests.

Known compatibility limit: js-yaml 3's legacy --version option exits 0 with no
version text under argparse 2. Official argparse 2.0.1 source passes an unset
parser.version field to the version action. This was observed and investigated,
not treated as a passing stdout-parity test. The site invokes gray-matter's
library parser and never this CLI/version option, so the difference does not
affect the supported application path. CLI parsing/help/error paths remain
covered; no compatibility claim is made for the legacy version option.
Sources: https://github.com/nodeca/argparse/blob/2.0.1/argparse.js and
https://github.com/nodeca/argparse/blob/master/CHANGELOG.md.

Two scoped-override lock updates retained the old dependency; a selective
lock-resolution experiment was rejected by npm ci before copying to source.
Those failed logs/caches remain preserved. The exact unconditional argparse 2
override resolved correctly and clean installation passed with zero npm audit
advisories. The initial compatibility run also exposed an error-message casing
assumption and the documented version-option difference. No scanner exception,
force install, dependency downgrade, vendor patch or security-gate waiver was used.

Final dependency tests: 286 unit tests, seven browser cases, predeploy/content
checks, lint, TypeScript and the offline-font production build passed on tree
e2175156a191e8d61850f44e27dc8844c2cf91bb. Independent review then identified a
stale dev-only lock flag on shared argparse 2; only that incorrect flag was
removed, preserving its official version, URL and integrity. A fresh
`npm ci --omit=dev --ignore-scripts` succeeded and file-level resolution verified
argparse 2 is installed for production gray-matter/js-yaml, with no sprintf-js
or nested argparse 1 remaining. No dependency code ran with host credentials.
The updated lock and this evidence paragraph still require exact-head CI.
