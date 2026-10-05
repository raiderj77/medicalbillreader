# MedicalBillReader selected-file integrity

- Objective: prevent a removed file's asynchronous read from replacing the next
  selection's preview and submitted bytes. Existing approved business; customer
  upload integrity is the bottleneck, not acquisition or a new offer.
- Responsibility: product/accessibility engineering with application privacy
  review. Inherit CLAUDE.md and EMPIRE_BUILD_STANDARDS.md at c88910a, plus the
  owner's Adler standing self-review and implementation authority.
- Scope: browser-local file selection, read cancellation and error feedback only.
  Synthetic blank files; no real health data, payments, provider calls, secrets,
  tracking, account changes or additional spend. Existing consent and free-use
  promises remain intact. This is not an article or a health-claim revision.
- Evidence: the previous handler did not cancel FileReader or check callback
  identity after Remove. The next selection could receive an earlier callback.
  Submission was also enabled before its bytes had finished loading.
- Repair: cancel loading readers on removal/replacement/unmount, ignore stale
  callbacks, clear preview before each new read, disable submission until ready,
  and explain local read errors without transmitting document data.
- Source checked October 4, 2026:
  https://developer.mozilla.org/en-US/docs/Web/API/FileReader/abort documents
  cancellation and the DONE state. Reader identity is checked independently of
  abort so a previously queued callback cannot restore stale bytes.
- Acceptance: credential-free unit/lint/type checks; browser regression with
  deliberately reordered local callbacks, Remove/reselect, successful current
  read, read error, disabled/enabled button state and zero outbound transport;
  existing mobile/accessibility/privacy checks; exact-head CI and production
  revision verification before calling the fix released.
- Review: implementer self-review, not independent or qualified clinical review.
  No claim of actual paid fulfillment, customer conversion or revenue follows
  from these synthetic tests. Release evidence belongs in the PR and receipt.

Local verification: 283 unit tests, lint and TypeScript passed in the isolated
namespace. The browser regression against c88910a failed both the readiness
assertion and the stale-preview assertion; four existing browser tests passed.
The corrected version reached the read-error check, where an ambiguous test
locator also matched Next's route announcer; the locator now targets the error
text. The namespace build uses a disposable system-font fixture because outbound
Google Fonts requests are denied. CI must build the unchanged production font.
