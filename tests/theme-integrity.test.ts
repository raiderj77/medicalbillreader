import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("selected color theme", () => {
  it("drives body and markdown colors from the html dark class", () => {
    const layout = readFileSync(join(process.cwd(), "src/app/layout.tsx"), "utf8");
    const styles = readFileSync(
      join(process.cwd(), "src/app/globals.css"),
      "utf8",
    );

    expect(layout).toContain(
      'className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"',
    );
    expect(styles).toContain("html.dark body");
    expect(styles).toContain(".dark .prose-medical");
    expect(styles).not.toContain("@media (prefers-color-scheme: dark)");
  });
});
