import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("advertising readiness", () => {
  it("authorizes the direct seller without falsely naming an external manager", () => {
    for (const path of ["public/ads.txt", "src/app/ads.txt/route.ts"]) {
      const content = readFileSync(join(process.cwd(), path), "utf8");
      expect(content).toContain(
        "google.com, pub-7171402107622932, DIRECT, f08c47fec0942fa0",
      );
      expect(content).toContain("OWNERDOMAIN=medicalbillreader.com");
      expect(content).not.toContain("MANAGERDOMAIN=");
    }
  });

  it("does not load advertising code on sensitive or marketing pages yet", () => {
    const layout = readFileSync(
      join(process.cwd(), "src/app/layout.tsx"),
      "utf8",
    );
    const consent = readFileSync(
      join(process.cwd(), "src/components/PrivacyConsent.tsx"),
      "utf8",
    );
    expect(`${layout}\n${consent}`).not.toContain("googlesyndication.com");
    expect(`${layout}\n${consent}`).not.toContain("adsbygoogle");
  });
});
