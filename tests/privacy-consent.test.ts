import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
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

  it("gates Google Analytics behind consent and env configuration", () => {
    const layout = readFileSync(join(process.cwd(), "src/app/layout.tsx"), "utf8");
    const control = readFileSync(
      join(process.cwd(), "src/components/PrivacyConsent.tsx"),
      "utf8",
    );
    for (const tracker of [
      "consent.cookiebot.com",
      "googlesyndication.com",
      "googletagmanager.com",
      "clarity.ms",
      "dataLayer",
      "window.gtag",
    ]) {
      expect(layout).not.toContain(tracker);
    }
    expect(control).toContain("NEXT_PUBLIC_GA_ID");
    const consentRead = control.indexOf("parsePrivacyConsent(document.cookie)");
    expect(consentRead).toBeGreaterThanOrEqual(0);
    expect(consentRead).toBeLessThan(
      control.indexOf("googletagmanager.com/gtag/js"),
    );
    expect(control).toContain('createPrivacyConsentCookie("analytics")');
    expect(control).toContain('createPrivacyConsentCookie("essential")');
    for (const tracker of ["consent.cookiebot.com", "googlesyndication.com", "clarity.ms"]) {
      expect(control).not.toContain(tracker);
    }
  });

  it("sends analytics a query-free page location", () => {
    const control = readFileSync(
      join(process.cwd(), "src/components/PrivacyConsent.tsx"),
      "utf8",
    );
    // Post-checkout landings carry ?payment=success and inbound campaign
    // links carry utm_* params; GA4 must only ever receive origin + path.
    expect(control).toContain(
      "page_location: `${window.location.origin}${window.location.pathname}`",
    );
  });

  it("permits Google analytics origins only in the content security policy", () => {
    const nextConfig = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");
    const vercelText = readFileSync(join(process.cwd(), "vercel.json"), "utf8");
    const policies = `${nextConfig}\n${vercelText}`;
    expect(policies).toMatch(/script-src[^;]*googletagmanager\.com/);
    expect(policies).toMatch(/connect-src[^;]*google-analytics\.com/);
    const nextCsp = nextConfig.match(/key: "Content-Security-Policy",\s*value:\s*"([^"]+)"/)?.[1];
    const vercelConfig = JSON.parse(vercelText) as {
      headers: Array<{ headers: Array<{ key: string; value: string }> }>;
    };
    const vercelCsps = vercelConfig.headers.flatMap((rule) => rule.headers)
      .filter((header) => header.key === "Content-Security-Policy")
      .map((header) => header.value);
    expect(nextCsp).toBeDefined();
    expect(vercelCsps.length).toBeGreaterThan(0);
    let remainder = policies;
    for (const csp of [nextCsp!, ...vercelCsps]) {
      remainder = remainder.replaceAll(csp, "");
    }
    expect(vercelCsps.every((csp) => csp === nextCsp)).toBe(true);
    expect(remainder).not.toContain("googletagmanager.com");
    expect(remainder).not.toContain("google-analytics.com");
  });

  it("keeps the health referrer policy consistent in every deployment config", () => {
    const nextConfig = readFileSync(
      join(process.cwd(), "next.config.ts"),
      "utf8",
    );
    const vercelConfig = JSON.parse(
      readFileSync(join(process.cwd(), "vercel.json"), "utf8"),
    ) as {
      headers: Array<{
        headers: Array<{ key: string; value: string }>;
      }>;
    };
    const referrerPolicies = vercelConfig.headers
      .flatMap((rule) => rule.headers)
      .filter((header) => header.key === "Referrer-Policy")
      .map((header) => header.value);

    expect(nextConfig).toContain('value: "no-referrer"');
    expect(referrerPolicies.length).toBeGreaterThan(0);
    expect(referrerPolicies.every((value) => value === "no-referrer")).toBe(
      true,
    );
  });

  it("does not persist GPC when all optional tracking is already disabled", () => {
    const proxyPath = join(process.cwd(), "src/proxy.ts");
    const middlewarePath = join(process.cwd(), "src/middleware.ts");

    expect(existsSync(proxyPath)).toBe(false);
    expect(existsSync(middlewarePath)).toBe(false);
  });
});
