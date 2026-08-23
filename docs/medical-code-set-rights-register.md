# Medical code-set rights register

Last reviewed: 2026-08-23

Status: fail closed. This register is not legal advice and does not grant a
license. Exact code descriptions and automated descriptor lookup remain disabled
unless a product-specific primary-source and contract review records permission.

Implementation authority: `src/config/code-set-rights.ts`.

## Verified CPT finding

Primary source reviewed:
<https://www.ama-assn.org/practice-management/cpt/cpt-licensing-frequently-asked-questions-faqs>

The AMA FAQ, updated July 14, 2026, says entities that use, reference, or
display CPT content in electronic products need an appropriate license for the
use case. It specifically includes product development/testing and AI use in its
licensing discussion. No product-specific Medical Bill Reader CPT license or
authorized-distributor agreement was verified.

Decision:

- Remove exact CPT code-plus-description examples from public content.
- Do not provide official CPT descriptors, an automated CPT lookup, a coding
  audit, or a coding-correctness conclusion.
- Allow only system-level education and a link to the official AMA source.
- Treat any future model output containing an exact descriptor as rights-limited
  until a deterministic server-side policy and license review permit it.

## Registry

| System | Maintainer/source | Rights status | Allowed public treatment | Prohibited until resolved |
| --- | --- | --- | --- | --- |
| CPT | AMA CPT licensing FAQ | **Verified restricted for this unlicensed implementation** | Name and general system purpose; official source link; explain that a visible code is not a correctness or payment determination | Exact official descriptions, code-description pairs, lookup database, bulk reuse, derivative descriptions, coding determination |
| HCPCS Level I (CPT) | AMA CPT licensing FAQ | **Verified restricted for this unlicensed implementation** | State that Level I is CPT and link to the official licensing source | Exact examples, official or AI-generated descriptions, derivative individual-code explanations, or lookup |
| HCPCS Level II | CMS HCPCS overview | **Rights review pending** | General system purpose and official-source link | Exact descriptions and automated lookup |
| ICD-10-CM | CMS ICD-10 overview | **Rights review pending** | General system purpose and official-source link | Exact descriptions and automated lookup |
| ICD-10-PCS | CMS ICD-10 overview | **Rights review pending** | General system purpose and official-source link | Exact descriptions and automated lookup |
| NDC | FDA NDC format source | **Rights review pending** | General format education and a neutral all-zero format illustration that is not an actual product | Exact drug/product descriptions and automated product lookup |
| DRG/MS-DRG | CMS MS-DRG resources | **Rights review pending** | General classification purpose and official-source link | Exact group-description pairs and automated lookup |
| Revenue codes | NUBC overview | **Rights review pending** | General category purpose and publisher link | Exact category-description pairs and lookup |
| Modifiers | CMS NCCI resources plus underlying code-set maintainers | **Rights review pending** | General modifier purpose and official-source link | Exact modifier descriptions, appropriateness determination, or lookup |
| Place of Service | CMS code-set source | **Rights review pending** | General setting purpose and official-source link | Exact code-description pairs and automated lookup |
| Claim adjustment and remittance remark codes (CARCs/RARCs) | X12 official code lists | **Rights review pending** | General adjustment/remark communication purpose and official-source link | Exact descriptions, bulk reproduction, AI-generated descriptions, or automated lookup |

“Rights review pending” is not permission. The code registry makes exact
descriptions and automated lookup false for every current system and for unknown
systems.

## Public-copy rules

- Do not use “code decoder,” “coding review,” “certified audit,” “upcoding
  detector,” “unbundling detector,” or any claim that the service determines
  medical necessity, coverage, correct coding, fraud, legality, or what is owed.
- Do not pair an exact code with an official or near-official description when
  rights are unresolved.
- Do not paraphrase an official descriptor closely enough to substitute for the
  licensed content.
- A user-visible code may be identified only as evidence copied from the user's
  own source document under the final approved structured-output policy. It must
  be marked rights-limited and must not trigger an automatic descriptor lookup.
- Questions should direct the user to the provider, insurer, or an appropriately
  licensed official source.

## Future permission gate

Before changing any registry entry to `verified-permitted`, the owner must
record:

1. verified licensor or authorized distributor;
2. exact product and entity covered;
3. permitted code systems, fields, versions, display, AI, retrieval, testing,
   caching, and distribution uses;
4. user and geography limits;
5. update, attribution, copyright, audit, reporting, and royalty obligations;
6. executed-agreement date and legal reviewer;
7. deterministic enforcement and regression tests; and
8. owner approval for cost and production release.

Do not place the agreement, account identifiers, pricing, or confidential terms
in this repository. Record categorical authorization only.
