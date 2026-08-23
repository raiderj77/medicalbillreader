# Privacy request runbook

Last reviewed: 2026-08-23

Status: draft procedure pending owner, privacy-counsel, and provider review. It
does not authorize repository automation to inspect customer, health, payment,
email, or provider records and does not state a legal response deadline.

## 1. Intake

The public route is `/privacy-request`. Its form requests only:

1. name;
2. email;
3. request type;
4. an optional Stripe payment reference, shown only for a payment/refund record
   request; and
5. an optional general non-health explanation.

The form is client-only. It has no site endpoint, analytics call, automatic
send, browser persistence, attachment control, or page-URL field storage. An
explicit button opens a prefilled draft in the requester's mail application,
clears the site's React state, and leaves the requester responsible for review
and Send.

The page must prominently say:

> Do not attach a medical bill, EOB, diagnosis, treatment information, insurance identifier, or other health information.

It also prohibits reports, codes, charges, providers, insurers, member/account/
claim numbers, cards, bank details, government IDs, and other sensitive data.

## 2. Safe opening and acknowledgement

1. Open only the request message in the approved mailbox. Do not open an
   attachment or follow a link.
2. If sensitive material is visible, stop reading; do not copy, forward,
   summarize, or paste it into a ticket. Apply approved minimization and incident
   procedures.
3. Sending an acknowledgement is an owner-authorized external action. Restate
   the no-health-data warning and provide a random case number only after the
   approved case-log system exists.
4. Do not promise applicability, completion, deletion, or a deadline until
   counsel determines the governing rule and authenticated receipt date.

## 3. Identity verification

- Use the least intrusive method proportionate to the request and the data that
  may exist. The method is an owner/counsel decision.
- Never ask for a bill, EOB, report, diagnosis, treatment detail, government ID,
  card/bank detail, provider/insurer value, member/account/claim identifier, or
  full Stripe object.
- A minimal Stripe receipt/payment reference may be used only when necessary to
  locate a payment record and only through an approved confidential workflow.
- If the service cannot safely link the requester to a record, state that
  limitation; do not invent a match or over-collect identity evidence.

## 4. Determine scope

Counsel/owner records categorical decisions for jurisdiction, request type,
records and processors potentially in scope, authentication level, exceptions,
appeal path, and response status. Do not put identity or health facts in the
repository or an ordinary issue.

## 5. Minimum authorized data-location search

Only an authorized human uses the minimum provider interface necessary:

- **Application database/object storage:** current design intentionally has no
  document/report store; verify the deployed architecture rather than assuming.
- **Stripe:** search only when payment/refund/subscription data is in scope;
  preserve accounting, fraud, dispute, and legal exceptions.
- **Upstash:** determine whether a safely linkable security/entitlement key can
  be located; never broadly export Redis or copy keys into the case record.
- **Vercel:** use the approved privacy/support path for account logs or request
  metadata; do not search for or expose request bodies in ordinary dashboards.
- **Support/privacy email:** search the approved mailbox narrowly; do not copy
  health or payment content into working notes.
- **Anthropic and other processors:** use contract-approved access/deletion
  mechanisms only if counsel determines the request reaches that processor.
- **Backups/logs:** record only categorical availability, exception, deletion,
  or expiry status.

Missing provider access or a failed search is `unknown`, not proof that no record
exists.

## 6. Processor access, correction, or deletion request

1. Confirm the processor, contract, request mechanism, authentication, scope,
   and exception with owner/counsel.
2. Send only the minimum necessary provider reference through an approved
   confidential channel; never email the source bill or report.
3. Record categorical submitted/accepted/completed/exception/unknown status and
   date without copying records, provider IDs, or response bodies.
4. Do not promise immediate or complete deletion; providers, backups, payment
   records, security records, and legal holds may have different limits.

## 7. Response

Owner and counsel review the response for authentication, completeness,
exceptions, secure delivery, accessibility, appeal information, and current
jurisdiction requirements. Do not send a response from automation, this
repository, or a model-generated draft without human approval.

## 8. Appeal

- Assign a different authorized reviewer where practicable.
- Repeat the no-sensitive-data intake and proportionate authentication rules.
- Counsel supplies any regulator complaint path and timing required at action
  time from a current official source.

## 9. Minimum necessary request log

Pending approval, the maximum categorical case record is:

- random case number;
- received date (not an exact time unless legally needed);
- request type;
- jurisdiction status: `unknown`, `counsel reviewed`, or `not applicable`;
- authentication status, not evidence;
- systems searched as categories;
- processor request status;
- owner/reviewer role;
- response and appeal status; and
- close date/outcome category.

Do not record name, email, document/report content, free-text explanation,
medical values, provider/insurer, account/member/claim values, Stripe/customer/
payment IDs, IP, cookie, URL, analytics identifier, or copies of correspondence
in repository documents or ordinary tickets. The final secure case-record
location and retention period remain owner/counsel decisions.

## 10. Incident handoff and unresolved gates

Follow `docs/health-data-incident-response-plan.md` if the intake discloses
sensitive content, an attachment is received, or request data reaches an
unapproved system. Before relying on this process in production, approve the
mail provider, secure intake, MFA/access, verification method, case-log system,
retention, provider mechanisms, response templates, appeal workflow, counsel
contact, and authorized roles.
