import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";
import { describe, expect, it } from "vitest";

const TEXT_EXTENSIONS = new Set([
  ".json",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);

function collectTextFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = join(directory, entry.name);
    if (entry.isDirectory()) return collectTextFiles(filePath);
    return TEXT_EXTENSIONS.has(extname(entry.name)) ? [filePath] : [];
  });
}

describe("CPT per-code publication decision", () => {
  it("ships no route, registry, or reference for the removed exemplar", () => {
    const removedCode = ["99", "213"].join("");
    const removedPath = ["", "codes", "cpt", removedCode].join("/");
    const sourceRoots = [
      "src",
      "content",
      "context",
      "docs",
      "public",
      "scripts",
      "tests",
    ];

    expect(existsSync("src/app/codes/cpt/[code]/page.tsx")).toBe(false);
    expect(existsSync("src/lib/cpt-codes.ts")).toBe(false);

    for (const filePath of sourceRoots.flatMap(collectTextFiles)) {
      const contents = readFileSync(filePath, "utf8");
      expect(contents, `${filePath} references the removed page`).not.toContain(
        removedPath,
      );
      expect(contents, `${filePath} references the removed slug`).not.toContain(
        removedCode,
      );
    }
  });
});
