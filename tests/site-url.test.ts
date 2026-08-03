import { afterEach, describe, expect, it } from "vitest";
import { trustedSiteOrigin } from "@/lib/site-url";

const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const originalVercelUrl = process.env.VERCEL_URL;
const originalVercelBranchUrl = process.env.VERCEL_BRANCH_URL;
const originalVercelProjectProductionUrl =
  process.env.VERCEL_PROJECT_PRODUCTION_URL;

function restoreEnvironment(name: string, value: string | undefined) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

afterEach(() => {
  restoreEnvironment("NEXT_PUBLIC_SITE_URL", originalSiteUrl);
  restoreEnvironment("VERCEL_URL", originalVercelUrl);
  restoreEnvironment("VERCEL_BRANCH_URL", originalVercelBranchUrl);
  restoreEnvironment(
    "VERCEL_PROJECT_PRODUCTION_URL",
    originalVercelProjectProductionUrl,
  );
});

describe("trusted site origin", () => {
  it("accepts a clean HTTPS origin and strips a trailing slash", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://medicalbillreader.com/";
    expect(trustedSiteOrigin()).toBe("https://medicalbillreader.com");
  });

  it.each([
    "http://localhost:3000/",
    "https://localhost:3000",
    "http://127.0.0.1:3000",
    "http://[::1]:3000",
  ])("accepts a local development origin %s", (configured) => {
    process.env.NEXT_PUBLIC_SITE_URL = configured;
    expect(trustedSiteOrigin()).toBe(new URL(configured).origin);
  });

  it("accepts the known Vercel project alias", () => {
    process.env.NEXT_PUBLIC_SITE_URL =
      "https://medicalbillreader.vercel.app/";
    expect(trustedSiteOrigin()).toBe(
      "https://medicalbillreader.vercel.app",
    );
  });

  it("accepts only the current project's platform-supplied preview host", () => {
    const previewHost =
      "medicalbillreader-git-security-raiderj77.vercel.app";
    process.env.VERCEL_BRANCH_URL = previewHost;
    process.env.NEXT_PUBLIC_SITE_URL = `https://${previewHost}`;

    expect(trustedSiteOrigin()).toBe(`https://${previewHost}`);
  });

  it.each([
    "javascript:alert(1)",
    "https://example.com/path",
    "https://user:password@example.com",
    "https://example.com/?next=attacker",
    "https://example.com",
    "https://other-project.vercel.app",
    "https://medicalbillreader.evil.vercel.app",
    "https://medicalbillreader-unverified-preview.vercel.app",
    "https://medicalbillreader.com:444",
  ])("rejects unsafe redirect configuration %s", (configured) => {
    process.env.NEXT_PUBLIC_SITE_URL = configured;
    expect(trustedSiteOrigin()).toBe("https://medicalbillreader.com");
  });
});
