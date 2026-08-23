# Washington My Health My Data checklist

Last reviewed: 2026-08-23

Primary source: <https://app.leg.wa.gov/RCW/default.aspx?cite=19.373&full=true>

Status: legal and operational checklist only. It is not legal advice and does
not conclude that Chapter 19.373 RCW applies, that an exemption applies, or that
Medical Bill Reader complies. Counsel must review the final product, people,
jurisdictions, data flow, entity roles, contracts, and current law.

| Area | Repository evidence | Status | Owner/counsel action |
| --- | --- | --- | --- |
| Applicability, exemptions, and role | Direct-to-consumer product intentionally processes a selected bill/EOB that may contain linkable health information | Legal review required | Determine Washington nexus, regulated entity/small-business status, exemptions, controller/processor roles, and other applicable laws |
| Consumer-health-data categories and sources | Data map covers browser document selection, report, security state, payments, email, logs, and providers | Technical inventory drafted | Counsel maps statutory categories/sources and verifies completeness |
| Purposes and necessity | Document processing provides requested explanation; security/payment state supports access and fraud controls | Partial | Validate each purpose, necessity, proportionality, and collection/sharing basis |
| Prominent policy | `/consumer-health-data-privacy` is linked near upload and in public navigation/footer | Implemented in branch/production status must be verified | Counsel reviews placement, readability, statutory content, and consistency with final map |
| Categories shared/recipients | Anthropic, Vercel, Upstash, Stripe, and email roles are documented; domain/GitHub/log providers tracked | Partial | Determine processor/third-party/affiliate/share classifications and name required recipients/categories |
| Consent or requested-service basis | Analyzer has affirmative processing acknowledgement | Legal design unresolved | Counsel decides when separate consent is needed, exact disclosure, evidence, withdrawal, and whether downstream uses are necessary |
| Sale/targeted advertising | Code/policies state no sale and no advertising/analytics use of health data | Technical control present | Maintain tests; re-review before any ads, analytics, affiliate, feedback, session recording, or new transfer |
| Access/confirmation | `/privacy-request` offers client-only draft intake | Entry implemented; operations pending | Approve secure/reliable mailbox, verification, searches, response, exceptions, and records |
| Correction | Form request type and runbook include correction | Operations pending | Define correctable records and processor propagation |
| Deletion | App intentionally stores no document/report, but providers and payment/security/email records may exist | Operations pending | Verify each processor mechanism, backup treatment, exceptions, proof, and propagation |
| Withdrawal | Form supports withdrawal for future processing | Partial | Counsel determines effect on future processing and whether another mechanism is required |
| Appeal | Form and runbook support appeal | Operations pending | Approve independent reviewer, response, and current regulator complaint path |
| Authentication/minimization | Initial form requests only name/email/type, conditional minimal Stripe reference, and general non-health explanation | Technical control present | Approve proportionate verification without bills, IDs, or health details |
| Response timing | No repository deadline is asserted | Counsel required | Determine current timing/extension rules at authenticated receipt and track in approved case system |
| Processor contracts | Exact agreements, DPAs, instructions, assistance, deletion, subprocessors, security, and incident terms unverified | Blocked | Owner/counsel verify every exact production processor before reliance |
| Data security | Same-origin controls, bounded uploads, no-store, structured output, privacy-minimized entitlements/logs are implemented or under final validation | Technical review pending | Complete independent security review and production configuration verification |
| Geofencing | No consumer-health-care-location geofencing feature is intended | Prohibited by product policy | Preserve prohibition and review any location/advertising/mobile-notification proposal before work |
| Incident/notification | Health-data incident and HBNR plans exist | Counsel approval pending | Integrate Washington and general breach analysis without assuming one rule satisfies another |

## Release gate

Do not claim Washington My Health My Data compliance until counsel signs the
applicability/role analysis, final notice, purpose and consent design, processor
contracts, request/appeal/deletion operations, security review, retention, and
incident process. Missing account/provider evidence is `unknown` and blocks the
claim.
