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
      "https://medicalbillreader.com/consumer-health-data-privacy",
    );
    expect(urls).toContain("https://medicalbillreader.com/editorial-policy");
    expect(urls).not.toContain("https://medicalbillreader.com/stats");
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("does not manufacture a new legal-page modification date per request", () => {
    const disclaimer = sitemap().find((entry) =>
      entry.url.endsWith("/disclaimer"),
    );
    expect(disclaimer?.lastModified).toEqual(new Date("2026-08-02"));
  });
});
