# Washington My Health My Data action register

Last reviewed: 2026-08-23

Primary source: <https://app.leg.wa.gov/RCW/default.aspx?cite=19.373&full=true>

This register is an implementation checklist, not legal advice or a conclusion
that Chapter 19.373 RCW applies. Applicability, exemptions, controller/processor
roles, and the appropriate consent or requested-service basis remain for privacy
counsel.

| Requirement area | Repository evidence | Status | Required decision or action |
| --- | --- | --- | --- |
| Applicability and role | Direct-to-consumer service intentionally processes a selected bill or EOB that may contain linkable health information | **Legal review required** | Counsel determines Washington nexus, regulated-entity/small-business status, exemptions, and processor roles |
| Prominent consumer-health-data policy | Homepage has a pre-upload link and footer link to `/consumer-health-data-privacy` | **Implemented; legal sufficiency unverified** | Counsel reviews prominence and policy content after final data flow is complete |
| Categories, sources, purposes | Current notice lists upload/report, request/security, and payment categories with purposes | **Partial** | Reconcile against final route/data map and name any additional category before collection |
| Categories shared and recipients | Current notice identifies Anthropic, Vercel, Upstash, and Stripe processing | **Partial** | Counsel determines statutory processor, third-party, affiliate, “share,” and requested-service classifications |
| Collection/sharing basis | Analyzer asks for an acknowledgement/consent before upload | **Legal design unresolved** | Counsel chooses the necessary-to-requested-service basis or consent design and verifies required disclosures and withdrawal method |
| No sale | Public policy and code state no sale or advertising use; analytics and ads are disabled | **Implemented in code; monitor** | Preserve regression tests and require new review before any analytics, ads, affiliate, or data-transfer change |
| Consumer access/confirmation | Client-only `/privacy-request` form prepares a user-controlled email draft with only name, email, type, conditional optional Stripe reference, and general non-health explanation; no endpoint, persistence, analytics, or automatic send | **Entry page implemented; operation unverified** | Owner selects secure/reliable mailbox, authentication, provider search, case log, and response procedure |
| Correction | Request category documented | **Operation unverified** | Define what controllable records can be corrected and processor propagation procedure |
| Deletion and propagation | Application intentionally stores no document/report; provider records may exist | **Operation unverified** | Verify processor deletion mechanisms, exceptions, backup handling, and evidence of completion |
| Withdrawal for future processing | Request category documented; user can stop uploading | **Partial** | Counsel verifies whether withdrawal needs another mechanism and how it affects future requests |
| Appeal | Appeal category documented in SOP | **Operation unverified** | Approve reviewer, response process, and current Attorney General complaint mechanism |
| Request timing | SOP requires counsel-set due-date status | **Legal review required** | At action time, calculate current statutory timing from authenticated receipt; do not rely on model memory |
| Processor contracts | No account contract or binding-instruction review performed | **Blocked** | Owner and counsel verify binding instructions, limits, assistance, subprocessors, deletion, security, and incident terms for every processor |
| Access minimization | Application design uses server routes and no analytics; vendor-account permissions were not reviewed | **Partial** | Review least privilege, MFA, team access, logs, and incident contacts in each account |
| Reasonable security | HTTPS, upload validation, no-store headers, category-only logs, entitlements, and abuse controls exist | **Technical controls present; legal standard unverified** | Security/privacy specialist reviews final architecture and provider configuration |
| Geofencing | No location or health-care-location geofencing feature is intended | **Prohibited by product policy** | Add/retain regression checks; review any future location, advertising, or notification feature before implementation |

## Release gate

Do not claim Washington My Health My Data compliance until counsel signs off on
the final data map, public notice, legal basis, processor contracts, request and
appeal workflow, deletion propagation, security review, and incident procedure.
Unknown vendor settings or contracts are blockers, not evidence of compliance.
