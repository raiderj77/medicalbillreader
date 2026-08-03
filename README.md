# Medical Bill Reader

Medical Bill Reader is a privacy-conscious, U.S.-focused web application that turns a supported medical-bill or EOB image/PDF into a plain-language, AI-generated summary of visible fields, charges, codes, and items to verify.

It is informational only. It does not determine what someone owes, prove a billing error, or provide medical, financial, insurance, coding, or legal advice. Use synthetic, non-health files for development and testing.

## Local development

Requirements: Node.js 20.9 or newer.

```bash
npm ci
npm run dev
```

Do not copy example secrets into a deployed environment. Configure required values through the hosting provider and never print secret values during validation.

## Release checks

```bash
npm test
npm run lint
npx tsc --noEmit --incremental false
npm run test:indexnow
npm run build
npm audit --omit=dev
git diff --check
```

Before release, read `CLAUDE.md`, `EMPIRE_BUILD_STANDARDS.md`, the public privacy and consumer-health-data notices, and `docs/revenue-verification.md`. Do not enable advertising or third-party analytics without a separate privacy, policy, and account-readiness review.

## Production

The production site is hosted on Vercel at `https://medicalbillreader.com`. Stripe handles payment data, Anthropic processes uploaded documents for the requested report, and Upstash supports privacy-minimized security and entitlement state. See the public policy pages for current disclosures and retention limits.
