# CLAUDE.md - medicalbillreader.com
# Claude Code reads this automatically.

## IDENTITY
Medical Bill Reader. Micro-SaaS product.
Users upload medical bills or EOBs, Claude vision reads them, provides plain-English explanation, flags potential errors, suggests next steps.
Revenue model: free MVP now, paid later ($9.99/bill or $14.99/month unlimited).

## BEFORE DOING ANYTHING
1. Read this file and EMPIRE_BUILD_STANDARDS.md first
2. Show Jason a plan. Wait for approval.
3. Explain step-by-step like Jason is 5.

## TIER 1: CLAUDE.md, EMPIRE_BUILD_STANDARDS.md, src/app/layout.tsx, src/app/page.tsx
## TIER 2: src/app/api/ (Claude vision pipeline), src/app/components/, public/
## TIER 3 (Never): node_modules/, .next/, .git/, .env files

## TECH STACK
- Next.js App Router, TypeScript, Tailwind CSS
- Claude API (vision) for bill reading
- Stripe (future payment integration)
- Vercel hosting (deploy pending)

## IMPORTANT RULES
- No personal name on any public page
- This is NOT medical advice — always disclaim
- CADC-II credentials do NOT apply here — pure AI product, no healthcare authority claimed
- All bill processing must be secure
- Never store uploaded bills longer than needed for analysis
- Privacy policy must clearly explain data handling

## WORKFLOW: AUDIT > PLAN > EXECUTE > REVIEW > STANDARDS > DEPLOY > VERIFY

## STATUS
- Scaffolded locally with working MVP
- Domain purchased (medicalbillreader.com)
- NOT yet deployed to Vercel
- Needs: Vercel deployment, SEO content, schema markup, legal pages

## DO NOT: Push without approval. Ignore standards. Claim this provides medical advice. Use CADC-II credentials for this product.
