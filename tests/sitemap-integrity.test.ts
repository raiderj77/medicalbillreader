import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";

describe("sitemap integrity", () => {
  it("includes the reviewed editorial and consumer-health pages once", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain(
      "https://medicalbillreader.com/blog/how-to-dispute-a-medical-bill",
    );
    expect(urls).toContain(
      "https://medicalbillreader.com/sample-medical-bill-report",
    );
    expect(urls).toContain(
      "https://medicalbillreader.com/consumer-health-data-privacy",
    );
    expect(urls).toContain("https://medicalbillreader.com/editorial-policy");
    expect(urls).not.toContain("https://medicalbillreader.com/stats");
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("uses the shared review dates for acquisition resources", () => {
    const entries = sitemap();
    const disputeGuide = entries.find((entry) =>
      entry.url.endsWith("/blog/how-to-dispute-a-medical-bill"),
    );
    const sampleReport = entries.find((entry) =>
      entry.url.endsWith("/sample-medical-bill-report"),
    );

    expect(disputeGuide?.lastModified).toEqual(new Date("2026-08-02"));
    expect(sampleReport?.lastModified).toEqual(new Date("2026-08-18"));
  });

  it("keeps policy sitemap dates aligned with visible review dates", () => {
    const entries = sitemap();
    const privacy = entries.find((entry) => entry.url.endsWith("/privacy"));
    const consumerHealth = entries.find((entry) =>
      entry.url.endsWith("/consumer-health-data-privacy"),
    );

    expect(privacy?.lastModified).toEqual(new Date("2026-08-17"));
    expect(consumerHealth?.lastModified).toEqual(new Date("2026-08-17"));
  });

  it("does not manufacture a new legal-page modification date per request", () => {
    const disclaimer = sitemap().find((entry) =>
      entry.url.endsWith("/disclaimer"),
    );
    expect(disclaimer?.lastModified).toEqual(new Date("2026-08-02"));
  });
});
