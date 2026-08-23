# Privacy request operating procedure

Last reviewed: 2026-08-23

Status: draft operating procedure pending privacy-counsel and provider review.
It does not authorize access to customer, health, payment, or provider records by
repository automation.

## Public intake

The public entry point is `/privacy-request`. Its client-only form requests only
name, email, request type, an optional Stripe payment reference shown when a
payment/refund record request needs one, and an optional general non-health
explanation. It has no application endpoint, analytics, attachment control,
automatic send, browser persistence, or page-URL field state. An explicit
button clears the React state and opens a prefilled draft in the requester's own
mail application; the requester must review and send it.

The page states: “Do not attach a medical bill, EOB, diagnosis, treatment
information, insurance identifier, or other health information.” It also warns
against a report, code, charge, provider/insurer, member/account/claim number,
card/bank detail, address, date of birth, government ID, or other sensitive
locator. A minimal Stripe receipt/payment reference is allowed only when needed
to locate the payment record; full payment details are prohibited.

Supported categories:

- access or confirmation;
- correction;
- deletion;
- withdrawal for future processing; and
- appeal of a prior privacy decision.

## Operator workflow

1. **Open only the request message.** Do not open attachments or links. If the
   message visibly includes sensitive details, stop reading, do not copy them,
   and move to the incident/minimization path.
2. **Create a non-sensitive case record.** In an owner/counsel-approved system,
   record only a random case number,
   received date, request category, applicable-jurisdiction status
   (`unknown`, `counsel-reviewed`, or `not-applicable`), due-date status, owner,
   and final outcome category. Do not record sender identifiers in repository
   documents or tickets.
3. **Acknowledge without over-collecting.** Confirm receipt and restate that no
   health, bill, card/bank, or identity information should be sent. A minimal
   Stripe reference may be used only for an in-scope payment record. Sending any
   response is an owner-authorized external action.
4. **Determine law and scope with counsel.** Confirm applicable law, identity
   authentication level, exceptions, timing, appeal rights, and whether the
   request reaches a processor. Do not make state-law conclusions from model
   memory.
5. **Use proportionate authentication.** Do not ask for a full bill, government
   ID, card detail, diagnosis, account/member/claim number, or a full Stripe
   object. Use a minimal Stripe reference only when necessary for a payment
   record.
   If the service has no record that can be safely linked, say so without
   inventing a match. Authentication method remains an owner/legal decision.
6. **Search only authorized systems.** A human owner uses the minimum provider
   interface necessary. Repository automation must not inspect live customer,
   payment, email, upload, or health records.
7. **Minimize provider requests.** If deletion or access propagation is legally
   required, use each provider's approved request mechanism. Do not paste source
   data into email, tickets, or the repository. Record only categorical status.
8. **Review before response.** Owner and counsel verify completeness, exceptions,
   delivery method, and required appeal or regulator information.
9. **Close minimally.** Record outcome category and close date. Delete temporary
   working notes according to the approved schedule.

## Appeals

- Use a new reviewer where practicable.
- Apply the same no-sensitive-data intake and authentication rules.
- If an appeal is denied and applicable law requires a regulator complaint
  path, counsel supplies the current official mechanism at action time.

## Deletion limitations

- The application is designed not to intentionally store documents or reports,
  but this does not prove that every provider holds no record.
- Payment, security, fraud-prevention, backup, and legal records may have
  exceptions or delayed deletion.
- Never promise complete or immediate deletion until every in-scope provider and
  applicable exception is verified.

## Incident handoff

If a request discloses a bill, health information, payment detail, or other
sensitive identifier, do not reproduce it. Follow
`docs/privacy/consumer-health-data-incident-response.md` and obtain owner/privacy
counsel direction.

## Required owner/legal decisions before production reliance

- secure and reliable request channel;
- authentication method by request category;
- authorized provider-access personnel;
- processor deletion and access mechanisms;
- case-record location and retention;
- response templates and appeal process; and
- current jurisdiction-specific deadlines and exceptions.
