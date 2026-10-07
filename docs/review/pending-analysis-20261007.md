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
