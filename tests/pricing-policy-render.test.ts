import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PricingClient from "@/components/PricingClient";

function renderPricing(policy: "enabled" | "disabled") {
  const purchaseAction = policy === "enabled"
    ? createElement("button", { type: "button" }, "Unlock Full Analysis")
    : createElement(
        "p",
        { role: "status" },
        "Single analysis purchases are not available yet. You can still use your free monthly allowance.",
      );

  return renderToStaticMarkup(
    createElement(PricingClient, {
      purchaseAction,
      payPerBillPolicy: policy,
    }),
  );
}

describe("pay-per-bill offer policy marker", () => {
  it("keeps the enabled marker and purchase CTA in agreement", () => {
    const html = renderPricing("enabled");

    expect(html).toContain('data-revenue-offer-id="pay-per-bill"');
    expect(html).toContain('data-revenue-offer-policy="enabled"');
    expect(html).toContain("Unlock Full Analysis");
    expect(html).not.toContain("Single analysis purchases are not available yet.");
  });

  it("keeps the disabled marker and unavailable message in agreement", () => {
    const html = renderPricing("disabled");

    expect(html).toContain('data-revenue-offer-id="pay-per-bill"');
    expect(html).toContain('data-revenue-offer-policy="disabled"');
    expect(html).toContain("Single analysis purchases are not available yet.");
    expect(html).not.toContain(">Unlock Full Analysis</button>");
  });
});
