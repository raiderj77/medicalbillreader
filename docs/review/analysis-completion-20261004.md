# Preserve credits when analysis is incomplete

Primary responsibility: software and product reliability, with privacy/security
self-review. Scope: MedicalBillReader's existing analysis delivery boundary; no
payment, pricing, account, model, token-limit, or retention changes.

The previous route consumed a credit for any truthy first text field, including
responses stopped by the output limit, refusals, whitespace, and non-string
values. It also discarded later text blocks. These are reproduced source defects,
not evidence that a particular customer experienced them.

The route now requires `end_turn` and nonempty text-only blocks before committing
the reservation. All returned text blocks are included. Invalid or unfinished
responses release the reservation and keep the existing paid-access cookie;
there is no automatic provider retry or continuation. A naturally completed
response is not proof of clinical accuracy or a comprehensive explanation.

Primary contract checked October 4, 2026:
https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons
(`end_turn` means natural completion; `max_tokens` and context exhaustion indicate
truncation; HTTP success alone does not establish completed output). This request
does not configure tools, thinking, or custom stop sequences.

Acceptance: nine new assertions failed against the original route. After repair,
279 tests across 37 files passed, together with ESLint and TypeScript. Tests ran
with staged source inside a credential-free WSL user/mount/network/PID namespace,
empty environment, no host home, read-only dependencies, and dropped capabilities.
All provider responses and documents were synthetic; no real payment, health
document, API generation, or new spending occurred. Build and protected PR checks
must pass before release. Review is exact-diff self-review under the owner's
routine implementation authority, not independent or qualified clinical review.

Remaining separate gap: actual test-mode payment-to-access-to-delivery integration
and real commercial/economic outcomes are not established by these route tests.

The isolated production build reached compilation but could not fetch the existing Google Inter font because network access is disabled. Predeploy/content checks passed. The unchanged font dependency requires the normal CI build to supply the release build result; no network restriction was relaxed for local tests.
