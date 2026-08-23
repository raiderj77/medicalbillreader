# Consumer health data incident and HBNR decision runbook

Last reviewed: 2026-08-23

Status: decision aid pending privacy-counsel approval. It is not a conclusion that
the FTC Health Breach Notification Rule (HBNR), HIPAA, Washington law, or another
law does or does not apply.

Primary sources reviewed:

- FTC HBNR rule page: <https://www.ftc.gov/legal-library/browse/rules/health-breach-notification-rule>
- FTC HBNR business guidance: <https://www.ftc.gov/business-guidance/resources/health-breach-notification-rule-basics-business>
- Washington Chapter 19.373 RCW: <https://app.leg.wa.gov/RCW/default.aspx?cite=19.373&full=true>

The FTC guidance says a covered breach can include unauthorized disclosure, not
only a system intrusion. The 2024 amendments emphasize application to many
health apps and similar technologies. Whether this product is a vendor of
personal health records, PHR-related entity, or third-party service provider is
unresolved and requires counsel.

## Incident triggers

Start this runbook for suspected or confirmed:

- document, report, filename, code, charge, provider, insurer, patient,
  member/account/claim, payment, or health information in logs, analytics,
  advertising, tickets, screenshots, repository artifacts, URLs, cookies, or
  browser persistence;
- unauthorized access, acquisition, transmission, disclosure, or retention of
  identifying health information;
- provider notice involving data processed for this service;
- public exposure of a document/report endpoint or storage object;
- privacy-request email containing sensitive material; or
- an unexplained change to a processor, retention setting, log drain, analytics,
  or advertising integration.

## First response

1. Record only discovery time, reporter role, affected system category, and a
   random incident number. Do not copy content or identifiers.
2. Stop the unsafe flow or isolate the affected component when that can be done
   without destroying evidence. External settings, deployments, account changes,
   and notices require owner authorization.
3. Preserve non-sensitive technical evidence such as version, route, event
   category, aggregate count range, configuration name, and timestamps. Do not
   take screenshots containing records.
4. Restrict access to the minimum authorized owner, security specialist, and
   counsel. Do not discuss the incident in public issues or ordinary chat.
5. Contact the relevant processor only through an owner-approved confidential
   channel. Do not send source data unless counsel determines it is necessary
   and the channel is approved.

## Counsel decision tree

Counsel should determine and document categorical answers without placing health
or identity data in the repository:

1. Was consumer health or PHR-identifiable health information involved?
2. Was it secured using the technology required by the applicable rule?
3. Was there unauthorized access, acquisition, or disclosure?
4. Can reliable evidence rebut acquisition where a rule presumes it?
5. Is Medical Bill Reader a covered HBNR entity for this data flow, a service
   provider to one, subject to another breach law, or outside that rule?
6. Which people and jurisdictions are affected, expressed only as counsel-held
   records and aggregate counts in engineering reports?
7. Which processors, contracts, and incident-notice duties apply?
8. What notices, regulator filings, media notices, content, delivery methods,
   translation/accessibility support, and timing are required?

The current rule and guidance contain timing provisions that depend on the
incident facts and affected population. This runbook deliberately does not
restate or calculate a legal deadline. Counsel must verify the current rule,
discovery facts, applicability, and timing at incident time.

## Notification controls

- No automated notice, bulk email, public statement, regulator form, refund,
  account action, or customer contact is authorized by this runbook.
- Notices must be reviewed by counsel and the owner and must use the minimum
  necessary information.
- Do not identify Anthropic, Vercel, Upstash, Stripe, or another provider as the
  cause until evidence supports that conclusion.
- An HTTP response, webhook acceptance, provider status page, or absence of logs
  does not close an incident.

## Recovery and closure

1. Fix the verified cause with a small reversible change and synthetic fixtures.
2. Verify that sensitive values cannot reach the affected sink.
3. Review other routes sharing the same component or provider.
4. Record categorical notices completed, dates, owner/counsel approval, and
   follow-up controls without identifiers.
5. Reopen the data map, retention schedule, processor register, public notice,
   and tests before restoring a paused flow.
6. Complete a no-sensitive-data retrospective and assign a dated owner.
