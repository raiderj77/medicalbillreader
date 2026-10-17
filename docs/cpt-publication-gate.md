# CPT exemplar publication gate

Status: **OPEN — blocks marking the SEO Phase 1 pull request ready or merging it**

Last checked: October 16, 2026

## Scope

This gate applies to the single independently written CPT 99213 explainer at
`/codes/cpt/99213`. It also applies before creating additional CPT pages,
copying an official descriptor, or building an automated CPT library.

The page does not reproduce the full AMA descriptor and does not claim a
universal price. That editorial restraint does not establish that publication
is licensed or legally cleared.

## Why the gate is open

The American Medical Association's current licensing FAQ says organizations
that use, reference, display, or create derivative works from CPT content are
expected to obtain an appropriate license. Repository evidence does not verify
an applicable license or a qualified legal determination for this use. Missing
evidence is unknown, not approval.

Primary source:
[AMA CPT licensing frequently asked questions](https://www.ama-assn.org/practice-management/cpt/cpt-licensing-frequently-asked-questions-faqs)

## Close the gate before publication

The owner must choose and document one of these outcomes without placing
license credentials, contracts, or private legal communications in the
repository:

1. Confirm that an appropriate AMA license covers this use.
2. Obtain qualified legal review that clears the proposed single-page use.
3. Remove the CPT 99213 page and its sitemap, internal-link, and LLM-index
   references from the pull request.

Until one outcome is documented as a simple pass/fail decision, keep the pull
request in draft and do not merge or deploy it.
