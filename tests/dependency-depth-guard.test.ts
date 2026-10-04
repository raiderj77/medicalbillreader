import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const consumer = createRequire(require.resolve("micromatch/package.json"));
const braces = consumer("braces");

describe("reviewed build dependency depth guard", () => {
  it("pins every installed braces artifact to the reviewed source", () => {
    const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
    const entries = Object.entries(lock.packages).filter(([path]) => path.endsWith("/braces"));
    expect(entries).toHaveLength(1);
    for (const [, entry] of entries) {
      expect(entry).toMatchObject({
        name: "@dieub/braces-depth-guard", version: "3.0.3-pn.3",
        integrity: "sha512-QY+Uq4s42STyIMPoRkBuUZfYyvz0uZuwuUburLwMx5N+lWqnHHaBxcKPtgKVKjTyFnS1q4ivKu9Wxi4VG7FE9Q==",
      });
    }
  });

  it("preserves ordinary source globs and ranges", () => {
    expect(braces.expand("src/**/*.{ts,tsx}")).toEqual(["src/**/*.ts", "src/**/*.tsx"]);
    expect(braces.expand("{a,b{1..2}}")).toEqual(["a", "b1", "b2"]);
    expect(braces.compile("a/{b,c}/d")).toBe("a/(b|c)/d");
  });

  it("rejects deeply nested strings before stack exhaustion", () => {
    for (const [open, close] of [["{", "}"], ["(", ")"], ["{(", ")}"]]) {
      for (const method of ["parse", "compile", "expand", "stringify"]) {
        expect(() => braces[method](open.repeat(2000) + "x" + close.repeat(2000))).toThrow(/exceeds max depth/);
      }
    }
  });

  it("prevents options and direct AST inputs bypassing the depth bound", () => {
    let ast: object = { type: "text", value: "x" };
    for (let i = 0; i < 1000; i++) ast = { type: "brace", open: true, close: true, commas: 1, nodes: [ast] };
    for (const method of ["compile", "expand", "stringify"]) {
      expect(() => braces[method]({ type: "root", nodes: [ast] })).toThrow(/exceeds max depth/);
    }
    for (const maxDepth of [Infinity, NaN, 10000, "10000", false]) {
      expect(() => braces.compile("{".repeat(101) + "x" + "}".repeat(101), { maxDepth })).toThrow(/exceeds max depth/);
    }
  });
});
