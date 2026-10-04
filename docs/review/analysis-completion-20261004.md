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

## Release dependency repair

The first PR scan failed on eight advisories across four dependency installations:
Next 16.3.5, brace-expansion 1.1.18 and 5.0.9, and braces 3.0.3. Preserve that
failure; no advisory suppression was added. Next and its ESLint config move to
16.3.6; brace-expansion moves to patched 1.1.21 and 5.0.12.

Primary Next advisory checked October 4:
https://github.com/advisories/GHSA-vcvr-r3jv-pc5j. It affects attacker-controlled
SVG input to Node ImageResponse; a vulnerable package is not proof of exploitation
or that this application exposes the affected path.

For https://github.com/advisories/GHSA-vfj7-8cjw-p6xm, upstream braces has no fixed
published version. Use the exact MIT-licensed depth-guard artifact already source-
reviewed for MindCheckTools PR148 in this same session:
https://github.com/dieub/braces-depth-guard/tree/305a2e4bfe324bb53c336c1b03387ee1251c926f
The package is @dieub/braces-depth-guard 3.0.3-pn.3, aliased as braces. The committed
regression pins its integrity and tests this repository's actual micromatch
resolution, ordinary globs, deeply nested strings, ASTs and option bypasses.
This third-party derivative adds a maintainer dependency; no automatic future
fork update is authorized. The earlier review matched all ten published files
to source and reproduced the original stack exhaustion. Scanner naming alone
is not the remediation evidence. This guards recursive depth, not every possible
resource-exhaustion pattern. No new runtime provider or data access is introduced.

The initial Windows-generated lock lacked two Linux optional dependency records;
Linux npm ci rejected it before tests. Reconciled the lock with npm's Linux
resolver rather than omitting optional dependencies or weakening clean install.

After dependency repair: all 283 tests in 38 files, ESLint and TypeScript passed in the same isolated namespace. One initial regression exceeded the fork's separate input-length bound before reaching its depth guard; shortened the fixture below that bound and retained strict depth-error assertions. Original PR build/browser checks passed; final-head checks remain mandatory.
