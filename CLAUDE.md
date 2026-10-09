# CLAUDE.md - medicalbillreader.com

## Identity

Medical Bill Reader is a U.S.-focused medical-bill and Explanation of Benefits (EOB) explainer. A visitor uploads a supported image or PDF and receives an AI-generated summary of visible charges, fields, codes, and items to verify. The service does not determine what someone legally owes, prove a billing error, or provide medical, financial, insurance, coding, or legal advice.

Current access model:

- Free: up to one analysis per browser per UTC calendar month, subject to abuse controls.
- Single analysis: the published price remains $4.99, but new paid checkout is temporarily unavailable while payment setup is verified.
- Preserve server-verified paid access, refund handling, and Stripe-hosted management or cancellation for any real existing subscriber until retirement is approved.

## Before changing the product

1. Read this file and `EMPIRE_BUILD_STANDARDS.md`.
2. Inspect the current worktree, tests, public policy pages, and production configuration relevant to the change.
3. Execute routine, authorized repository remediation and verify it. Stop for owner decisions involving payments, accounts, domains, secrets, external outreach, or a material change to the business model.
4. Never inspect, upload, log, or report real medical bills or sensitive user data during testing. Use synthetic, non-health test data only.

## Stack and deployment

- Next.js App Router, TypeScript, React, and Tailwind CSS.
- Anthropic commercial API for document explanation.
- Stripe Checkout, subscriptions, refunds, and customer portal.
- Upstash Redis for privacy-minimized security, rate-limit, entitlement, and replay-prevention state.
- Vercel production hosting at `medicalbillreader.com`.

## Non-negotiable product rules

- Treat all health and billing content as strict YMYL content. Use current primary sources, visible review dates, qualified language, and claim-level restraint.
- Uploaded documents must not be intentionally written to the application database or included in analytics or logs.
- Clearly disclose Anthropic processing and published retention exceptions. Do not claim HIPAA coverage, a BAA, or zero-data retention unless current account terms have been independently verified.
- Do not reproduce unlicensed CPT descriptors, publish unsupported typical-price claims, or generate scaled thin code pages.
- Advertising and third-party analytics remain disabled unless a later, separately verified privacy and policy review authorizes them.
- Keep legal, privacy, editorial, accessibility, contact, and methodology pages accurate and linked.

## Public attribution

Jason Ramirez may remain publicly identified as founder and author. Describe him accurately as a web professional and product founder. He is not a clinician, attorney, insurer, certified medical coder, or billing specialist. Do not attach CADC-II or any unrelated credential to this product.

## Current status

- Production deployment, legal pages, technical SEO, schema, and source-backed editorial pages are implemented. Current production Stripe account and price mapping are not verified.
- The current remediation branch tightens entitlement security, privacy boundaries, YMYL wording, accessibility, and release tests.
- Revenue claims require Stripe or other authoritative evidence. Search or analytics access gaps are unknowns, not proof of zero traffic.

## Workflow

Audit -> implement -> test -> independent review -> commit -> push -> review checks -> deploy -> production verification.
