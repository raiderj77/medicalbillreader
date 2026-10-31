import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const state = vi.hoisted(() => ({ tier: "scan" as "scan" | "full", index: 0 }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn() }) }));
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return { ...actual, useState: (initial: unknown) => {
    const index = state.index++;
    // Supply a delivered synthetic result to exercise the component's result branch.
    const value = index === 4 ? state.tier : index === 5 ? "Synthetic summary" : initial;
    return [value, vi.fn()];
  } };
});
import BillAnalyzer from "@/components/BillAnalyzer";

describe("BillAnalyzer delivered tier", () => {
  it.each(["scan", "full"] as const)("renders the purchase panel only for a scan: %s", (tier) => {
    state.index = 0;
    state.tier = tier;
    const html = renderToStaticMarkup(createElement(BillAnalyzer));
    expect(html).toContain("Synthetic summary");
    if (tier === "scan") {
      expect(html).toContain("$19 one time");
      expect(html).toContain("The free scan is a summary only");
      expect(html).toContain("Unlock Full Analysis</button>");
    } else {
      expect(html).not.toContain("Unlock Full Analysis");
      expect(html).not.toContain("$19 one time");
      expect(html).toContain("Your Medical Bill Explained Simply");
    }
  });
});
