import { describe, expect, it } from "vitest";
import { isMarketingAnalyticsPath } from "@/lib/marketing-analytics";

describe("marketing-only analytics boundary", () => {
  it.each([
    "/about",
    "/blog",
    "/blog/how-to-dispute-a-medical-bill",
    "/codes-explained",
    "/editorial-policy",
    "/methodology",
  ])("disables analytics on former marketing path %s", (path) => {
    expect(isMarketingAnalyticsPath(path)).toBe(false);
  });

  it.each([
    "/",
    "/pricing",
    "/contact",
    "/privacy",
    "/consumer-health-data-privacy",
    "/do-not-sell",
    "/stats",
    "/api/analyze",
  ])("blocks sensitive or transactional path %s", (path) => {
    expect(isMarketingAnalyticsPath(path)).toBe(false);
  });
});
