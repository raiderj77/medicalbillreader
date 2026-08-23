# Annual privacy and processor review checklist

Last reviewed: 2026-08-23

Run annually and before any processor, model, feature, pricing, analytics,
advertising, log, region, or retention change. Use synthetic fixtures and
aggregate, non-identifying evidence only.

## Preparation

- [ ] Name an owner, privacy reviewer, security reviewer, and counsel contact.
- [ ] Freeze the reviewed route/data map and current production version.
- [ ] Confirm that no real bill, EOB, report, customer record, payment detail,
      credential, or provider identifier will enter review artifacts.
- [ ] List active processors from code, DNS/hosting architecture, environment
      variable names, network allowlists, and owner-verified account inventory.
- [ ] Treat missing provider access as unknown, not as no processing.

## Every processor

- [ ] Verify legal entity, service, account owner, plan, region, and active
      product features without recording confidential identifiers.
- [ ] Verify the data categories sent, purpose, source routes, return data, and
      whether the flow is necessary.
- [ ] Review current contract/DPA, processing instructions, confidentiality,
      security, incident notification, assistance with rights, deletion/return,
      audit, subprocessor, and international-transfer terms.
- [ ] Review public privacy, retention, law-enforcement, security, and subprocessor
      documents and record source URL plus review date.
- [ ] Verify account-specific retention, logs, traces, analytics, feedback,
      training, backups, support access, and deletion settings.
- [ ] Verify owner/admin membership, least privilege, MFA, recovery, audit logs,
      API key rotation process, incident contact, and offboarding.
- [ ] Test with fabricated non-health data that application logs, provider logs,
      error tools, and analytics do not contain request bodies, filenames,
      reports, codes, charges, or identifiers.
- [ ] Record status only as `verified`, `not applicable`, `unknown`, or `blocked`.

## Anthropic-specific

- [ ] Review the current commercial API retention source.
- [ ] Verify the exact API organization, model, features, feedback settings, and
      whether any customer-controlled longer-retention service is used.
- [ ] Verify ZDR and BAA status from the account/contract; never infer them from
      public availability.
- [ ] If PHI use is proposed, stop until owner, counsel, BAA, HIPAA-ready
      activation, eligible services/models, and all downstream processors are
      verified. This public service currently makes no such claim.

## Vercel-specific

- [ ] Verify plan and BAA/add-on status without changing it.
- [ ] Review runtime logs, traces, drains, request-body handling, retention,
      regions, deployment protection, team access, and incident contacts.
- [ ] Confirm that a Vercel BAA alone would not make the application compliant;
      document the customer's shared-responsibility controls.

## Upstash-specific

- [ ] Verify database region, transport/storage security, logs, backups,
      retention, subprocessors, access, deletion, incident terms, and any health
      data restrictions.
- [ ] Confirm keys remain pseudonymous and contain no document/report, filename,
      provider, code, charge, customer, payment, or health data.

## Stripe-specific

- [ ] Verify that hosted Checkout receives card details directly and that the
      application sends no health or document details in metadata.
- [ ] Review customer/payment retention, privacy requests, refunds, disputes,
      fraud prevention, logs, webhook destinations, account access, and incident
      terms.
- [ ] Use authoritative Stripe state for retained-revenue claims. Exclude test,
      owner, and refunded verification payments.

## Email and privacy requests

- [ ] Verify mailbox provider, access, MFA, forwarding, retention, backups,
      deletion, incident response, and secure request capability.
- [ ] Confirm public intake never asks for a bill, health detail, card/bank
      detail, or sensitive locator. A minimal Stripe reference appears only for
      a payment/refund record request when needed.
- [ ] Confirm the form has no site endpoint, analytics, attachment control,
      browser persistence, page-URL state, or automatic send and clears local
      React state before opening the requester-controlled email draft.
- [ ] Test the SOP without sending email or using a real identity.

## Closeout

- [ ] Update the data map, retention schedule, processor contract register,
      public notices, incident runbook, and tests.
- [ ] Record unresolved items with an owner and review date.
- [ ] Block the affected feature when a required processor contract, setting,
      rights mechanism, or security control remains unknown.
- [ ] Obtain owner/legal approval before public policy claims, BAAs, account
      changes, processor changes, outreach, or production release.
