import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  CONSENT_COOKIE_MAX_AGE,
  CONSENT_COOKIE_NAME,
  createPrivacyConsentCookie,
  parsePrivacyConsent,
} from "@/lib/privacy-consent";

describe("privacy consent", () => {
  it("reads only supported consent values", () => {
    expect(parsePrivacyConsent(`theme=dark; ${CONSENT_COOKIE_NAME}=analytics`)).toBe(
      "analytics",
    );
    expect(parsePrivacyConsent(`${CONSENT_COOKIE_NAME}=essential`)).toBe(
      "essential",
    );
    expect(parsePrivacyConsent(`${CONSENT_COOKIE_NAME}=forged`)).toBeNull();
    expect(parsePrivacyConsent("")).toBeNull();
  });

  it("creates a scoped, same-site preference cookie", () => {
    const cookie = createPrivacyConsentCookie("essential");
    expect(cookie).toContain(`${CONSENT_COOKIE_NAME}=essential`);
    expect(cookie).toContain("Path=/");
    expect(cookie).toContain(`Max-Age=${CONSENT_COOKIE_MAX_AGE}`);
    expect(cookie).toContain("SameSite=Lax");
  });

  it("does not restore the broken CMP, ad loader, or session recorder", () => {
    const layout = readFileSync(join(process.cwd(), "src/app/layout.tsx"), "utf8");
    const control = readFileSync(
      join(process.cwd(), "src/components/PrivacyConsent.tsx"),
      "utf8",
    );
    const trackingCode = `${layout}\n${control}`;

    expect(trackingCode).not.toContain("consent.cookiebot.com");
    expect(trackingCode).not.toContain("googlesyndication.com");
    expect(trackingCode).not.toContain("clarity.ms");
    expect(control).toContain("googletagmanager.com/gtag/js");
  });
});
