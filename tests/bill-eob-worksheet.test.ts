import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  calculateWorksheet,
  EMPTY_WORKSHEET_VALUES,
  parseMoney,
  worksheetSummary,
  type WorksheetValues,
} from "@/lib/bill-eob-worksheet";

function values(overrides: Partial<WorksheetValues> = {}): WorksheetValues {
  return { ...EMPTY_WORKSHEET_VALUES, ...overrides };
}

describe("local bill and EOB worksheet", () => {
  it("parses currency, distinguishes zero from blank, rounds decimals, and supports negatives", () => {
    expect(parseMoney("$1,234.56")).toEqual({ status: "valid", cents: 123456 });
    expect(parseMoney("0")).toEqual({ status: "valid", cents: 0 });
    expect(parseMoney(" ")).toEqual({ status: "missing" });
    expect(parseMoney("1.005")).toEqual({ status: "valid", cents: 101 });
    expect(parseMoney("-25.50")).toEqual({ status: "valid", cents: -2550 });
    expect(parseMoney("(25.50)")).toEqual({ status: "valid", cents: -2550 });
    expect(parseMoney("twelve")).toEqual({ status: "invalid" });
  });

  it("calculates the requested provider and EOB differences in integer cents", () => {
    const result = calculateWorksheet(values({
      providerCharge: "300.00",
      patientPaymentCredited: "20.00",
      providerBalanceShown: "40.00",
      eobAmountBilled: "300.00",
      deductible: "20.00",
      copay: "10.00",
      coinsurance: "30.00",
      nonCoveredAmount: "0",
      otherPatientResponsibility: "0",
      eobPatientResponsibilityShown: "60.00",
    }));

    expect(result.chargeDifference).toBe(0);
    expect(result.calculatedEobResponsibility).toBe(6000);
    expect(result.calculatedVsShownDifference).toBe(0);
    expect(result.eobVsProviderBalanceDifference).toBe(2000);
    expect(result.differenceAfterPatientPayments).toBe(0);
  });

  it("reports missing and invalid fields instead of inventing calculations", () => {
    const result = calculateWorksheet(values({ providerCharge: "not money", eobAmountBilled: "0" }));
    expect(result.invalidFields).toContain("providerCharge");
    expect(result.missingFields).toContain("providerBalanceShown");
    expect(result.chargeDifference).toBeNull();
    expect(worksheetSummary(values())).toContain("Not available from the entered fields");
  });

  it("resets to a fresh all-blank state", () => {
    const changed = values({ providerCharge: "1", providerNote: "local note" });
    const reset = { ...EMPTY_WORKSHEET_VALUES };
    expect(changed).not.toEqual(reset);
    expect(Object.values(reset).every((value) => value === "")).toBe(true);
  });

  it("contains no worksheet network, persistence, URL, or server-PDF path", () => {
    const component = readFileSync("src/components/BillEobWorksheet.tsx", "utf8");
    const page = readFileSync("src/app/bill-eob-comparison-worksheet/page.tsx", "utf8");
    for (const prohibited of [
      "fetch(", "XMLHttpRequest", "sendBeacon", "WebSocket", "localStorage",
      "sessionStorage", "document.cookie", "URLSearchParams", "location.hash",
      "history.pushState", "form action=", "/api/",
    ]) {
      expect(component, prohibited).not.toContain(prohibited);
    }
    expect(component).toContain("window.print()");
    expect(component).toContain("navigator.clipboard.writeText");
    expect(page).toContain("Calculations happen in your browser and disappear when you leave");
  });
});
