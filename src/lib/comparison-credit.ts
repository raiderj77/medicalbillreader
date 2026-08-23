/**
 * Pure future-facing credit-domain contract. It is intentionally not wired to
 * Stripe, cookies, checkout, or the current entitlement implementation.
 */
export const SINGLE_DOCUMENT_CREDIT_DISCRIMINATOR = "per_use" as const;
export const COMPARISON_CREDIT_DISCRIMINATOR =
  "bill_eob_comparison_per_use" as const;

export const CREDIT_PROTECTED_OPERATIONS = [
  "single_document_analysis",
  "bill_eob_comparison",
] as const;

export type OneTimeCreditDiscriminator =
  | typeof SINGLE_DOCUMENT_CREDIT_DISCRIMINATOR
  | typeof COMPARISON_CREDIT_DISCRIMINATOR;

export type CreditProtectedOperation =
  (typeof CREDIT_PROTECTED_OPERATIONS)[number];

export function oneTimeCreditAuthorizes(
  discriminator: unknown,
  operation: CreditProtectedOperation,
): boolean {
  if (operation === "single_document_analysis")
    return discriminator === SINGLE_DOCUMENT_CREDIT_DISCRIMINATOR;
  return discriminator === COMPARISON_CREDIT_DISCRIMINATOR;
}
