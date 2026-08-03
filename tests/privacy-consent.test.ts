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

  it("keeps all optional tracking disabled and renders no consent banner", () => {
    const layout = readFileSync(join(process.cwd(), "src/app/layout.tsx"), "utf8");
    const control = readFileSync(
      join(process.cwd(), "src/components/PrivacyConsent.tsx"),
      "utf8",
    );
    const trackingCode = `${layout}\n${control}`;

    for (const tracker of [
      "consent.cookiebot.com",
      "googlesyndication.com",
      "googletagmanager.com",
      "clarity.ms",
      "dataLayer",
      "window.gtag",
    ]) {
      expect(trackingCode).not.toContain(tracker);
    }
    expect(control).not.toContain("Allow analytics");
    expect(control).not.toContain("Privacy choices");
    expect(control).toContain("return null");
    expect(control).toContain('createPrivacyConsentCookie("essential")');
  });

  it("does not permit Google tracking origins in deployment policies", () => {
    const policies = ["next.config.ts", "vercel.json"]
      .map((path) => readFileSync(join(process.cwd(), path), "utf8"))
      .join("\n");

    expect(policies).not.toContain("googletagmanager.com");
    expect(policies).not.toContain("google-analytics.com");
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
