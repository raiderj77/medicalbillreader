# Health Breach Notification assessment

Last reviewed: 2026-08-23

Status: counsel worksheet, not legal advice and not an applicability or breach
conclusion. Complete only in an owner/counsel-approved confidential system. The
repository may record categorical status and aggregate counts, never health,
identity, payment, customer, credential, or analytics-identifier data.

## Current official sources to verify at action time

- FTC rule page: <https://www.ftc.gov/legal-library/browse/rules/health-breach-notification-rule>
- FTC business guidance: <https://www.ftc.gov/business-guidance/resources/health-breach-notification-rule-basics-business>

The guidance describes unauthorized disclosure as potentially relevant, not
only an intrusion. Whether Medical Bill Reader, a processor, particular data, or
an event is covered remains unresolved and requires counsel. Do not calculate a
deadline from this repository; current rule text, event facts, discovery, and
legal review control.

## Assessment record

| Question | Allowed repository status | Counsel-held evidence needed |
| --- | --- | --- |
| What service/version/flow was involved? | Category and commit/release only | Confidential technical record |
| Did the data relate to an identifiable person and health? | `yes`, `no`, `unknown` | Counsel-defined factual evidence |
| Was there unauthorized acquisition, access, or disclosure? | `yes`, `no`, `unknown` | Logs, contracts, forensic evidence |
| Was the data secured under the rule's current standard? | `yes`, `no`, `unknown` | Technical and legal analysis |
| Is reliable non-acquisition evidence available? | `yes`, `no`, `unknown` | Counsel-approved forensic record |
| Is Medical Bill Reader a vendor of personal health records, PHR-related entity, third-party service provider, or outside scope? | `counsel pending` or counsel conclusion | Product/data/relationship analysis |
| Which processors and contracts apply? | Provider categories only | Exact agreements and incident notices |
| How many people may be affected? | Aggregate range only | Restricted person-level record |
| Which jurisdictions are implicated? | State/country categories only | Restricted address/jurisdiction evidence |
| Are exceptions or other laws relevant? | `counsel pending` | Current legal research |

## Notification decision

Counsel/owner determines and records outside the repository:

1. whether HBNR notice is required;
2. required consumers, FTC, media, processors, or other recipients;
3. content and prohibited/necessary details;
4. delivery method, accessibility, language, and identity-theft/phishing safety;
5. verified current timing based on discovery and rule text;
6. whether another federal/state/contractual notice applies;
7. evidence of approved completion; and
8. support, remediation, and follow-up.

No automated notice, email, public statement, regulator filing, provider
accusation, account action, deployment, price action, or refund is authorized by
this assessment.

## Engineering handoff

- Preserve non-sensitive evidence and containment under
  `docs/health-data-incident-response-plan.md`.
- Update the data map, processor register, retention matrix, and tests after the
  verified cause is corrected.
- Record status as `unknown` when provider access or facts are missing; absence
  of observed data is not proof that no exposure occurred.
