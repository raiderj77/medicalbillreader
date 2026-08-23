# Annual health data review

Last reviewed: 2026-08-23

Status: required annual and material-change review plan; first owner-led review
pending. This is not legal advice or a compliance certification. Use aggregate
evidence and synthetic non-health fixtures only. Never inspect or copy real
bills, reports, customer/payment rows, credentials, secrets, account IDs, or
analytics identifiers into review artifacts.

## When to run

Run at least annually and before any material change to a processor, model or
model feature, route, upload type/limit, report schema, pricing/entitlement,
privacy request, log/trace/error tool, region, retention, analytics, advertising,
feedback, email/support channel, contract, BAA/ZDR claim, or public privacy text.

## Review team and authority

- [ ] Product owner named.
- [ ] Security reviewer named.
- [ ] Privacy counsel named.
- [ ] Medical billing/coding reviewer named for product-output scope, if one is
      actually engaged and verified.
- [ ] External actions, account/settings changes, spending, contact, policy
      publication, and deployment remain separately owner approved.

## 1. Product and route inventory

- [ ] Reconcile every public, API, checkout, privacy, support, redirect, and
      disabled/future route against the route-and-data register.
- [ ] Confirm the local worksheet remains no-network/no-storage and the AI route
      remains explicit, bounded, and server-authorized.
- [ ] Confirm disabled comparison, redaction, aggregate, feedback, analytics,
      advertising, and new-subscription flags remain in their approved state.
- [ ] Verify no new SDK, script, endpoint, environment-variable name, DNS target,
      integration, log drain, or support widget introduced a processor.

## 2. Data minimization and technical verification

- [ ] Reconcile all 18 stages in `docs/consumer-health-data-data-map.md`.
- [ ] Test with synthetic non-health files that bodies, filenames, reports,
      medical-looking values, payment IDs, and secrets do not enter logs,
      analytics, URLs, cookies, storage, feedback, CI, or error attachments.
- [ ] Verify upload/page/dimension/encryption/type/origin/host/response/cost
      limits and no-store behavior.
- [ ] Verify schema validation, output scrubbing, entitlement/refund authority,
      replay/concurrency controls, and failed-provider credit release.
- [ ] Verify privacy-request form fields, exact warning, no endpoint/analytics/
      persistence/page-URL state, conditional minimal Stripe reference, and
      explicit user-controlled mail send.

## 3. Provider and contract review

- [ ] Reconcile `docs/processor-register.md` to owner-verified production
      accounts without placing IDs or contracts in the repository.
- [ ] Complete `docs/vendor-contract-review-checklist.md` for Anthropic, Vercel,
      Upstash, Stripe, domain/DNS, email, GitHub, and any monitoring/support
      provider.
- [ ] Record agreement/DPA/BAA/ZDR, retention, subprocessors, security, incident,
      deletion, request assistance, plan/region, and owner review date only as
      categorical evidence.
- [ ] Block the affected feature when a required contract, provider setting,
      retention/deletion mechanism, or security control is unknown or inadequate.

## 4. Rights, retention, and incidents

- [ ] Reconcile `docs/data-retention-matrix.md`, including provider logs,
      backups, payment/legal exceptions, mailbox, GitHub, and case records.
- [ ] Run a tabletop of `docs/privacy-request-runbook.md` without sending email
      or using a real identity.
- [ ] Run a tabletop of `docs/health-data-incident-response-plan.md` and
      `docs/health-breach-notification-assessment.md` with a fictional event.
- [ ] Counsel reviews Washington and every applicable jurisdiction; do not reuse
      a stale deadline or assume one law resolves another.
- [ ] Review the aggregate count/category of privacy incidents and requests, if
      an approved source exists; missing access is `unknown`, not zero.

## 5. Public claims and professional review

- [ ] Verify every privacy, retention, security, processor, payment, rights,
      code-set, model, and professional-review claim against current evidence.
- [ ] Do not claim HIPAA compliance, a BAA, ZDR, certified audit, coding audit,
      legal amount owed, error/fraud/upcoding/unbundling finding, medical
      necessity, savings, or outcome.
- [ ] Confirm public review dates and official source links are current.
- [ ] Publish a reviewer name/credential only with verified identity, scope,
      written approval, permission, review date, and conflict disclosure.

## 6. Closeout evidence

Record only:

- reviewed release/commit;
- review date and role names authorized for publication;
- provider categories and categorical status;
- tests/commands and pass/fail counts;
- aggregate incident/request status (`unknown` if unavailable);
- unresolved risks, owner, and next review trigger; and
- owner/counsel/security/professional approval categories.

Update the data map, processor register, retention matrix, privacy-request
runbook, incident/HBNR/Washington records, public policies, tests, owner action
checklist, and 90-day scoreboard. Do not mark the review complete while a
required provider/account check, counsel decision, security test, or production
verification is unknown.
