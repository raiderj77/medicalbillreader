export const CONSENT_COOKIE_NAME = "mbr_privacy_consent";
export const CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

export type PrivacyConsent = "analytics" | "essential";

export function parsePrivacyConsent(
  cookieHeader: string,
): PrivacyConsent | null {
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CONSENT_COOKIE_NAME}=`));

  const value = match?.slice(CONSENT_COOKIE_NAME.length + 1);
  return value === "analytics" || value === "essential" ? value : null;
}

export function createPrivacyConsentCookie(value: PrivacyConsent): string {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";

  return `${CONSENT_COOKIE_NAME}=${value}; Path=/; Max-Age=${CONSENT_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}
