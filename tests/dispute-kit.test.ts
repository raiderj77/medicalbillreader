import { describe, expect, it } from "vitest";
import { extractVerifyItems, extractProviderName, buildDisputeLetter, buildPhoneScript, buildDisputeChecklist } from "@/lib/dispute-kit";

const items = ["Please confirm the repeated synthetic line.", "Please explain the unclear adjustment."];
const analysis = `## What This Document Appears To Be
A bill from Mercy General Hospital for services described below.
## Visible Charges and Insurance Fields
- Synthetic line
## Amounts Shown
- Synthetic amount
## Items To Verify
${items.map((item) => `- ${item}`).join("\n")}
## Questions and Next Steps
- Contact the billing office.
`;
const noItems = analysis.replace(items.map((item) => `- ${item}`).join("\n"), "No document-supported discrepancy was identified.");
const disclaimer = "This letter was prepared with an educational tool and is not billing, medical, or legal advice. Verify every detail against your bill before sending.";

describe("dispute kit", () => {
  it("extracts only bullets in the verification section", () => {
    expect(extractVerifyItems(analysis)).toEqual(items);
    expect(extractVerifyItems("Missing section")).toEqual([]);
    expect(extractVerifyItems(noItems)).toEqual([]);
    expect(extractVerifyItems(noItems.toUpperCase().replace("## ITEMS TO VERIFY", "## Items To Verify"))).toEqual([]);
  });
  it("extracts provider decoration only from the document description", () => {
    expect(extractProviderName(analysis)).toBe("Mercy General Hospital");
    expect(extractProviderName("## Items To Verify\nA bill from Mercy General Hospital for services.")).toBeNull();
    expect(extractProviderName("No provider shown")).toBeNull();
    expect(extractProviderName("## What This Document Appears To Be\nA statement issued by Mercy General Hospital")).toBe("Mercy General Hospital");
    expect(extractProviderName("## What This Document Appears To Be\nA bill from Mercy\nHospital for services.")).toBeNull();
  });
  it("builds a letter with blanks, verbatim items, and qualified requests", () => {
    const letter = buildDisputeLetter(analysis);
    for (const blank of ["[Your full name]", "[Your street address]", "[City, State ZIP]", "[Your phone number]", "[Date]", "[Provider billing address]", "[account number from your bill]", "[dates from your bill]", "[Your signature and printed name]"]) expect(letter).toContain(blank);
    for (const item of items) expect(letter).toContain(item);
    expect(letter).toContain("To: Billing Department, Mercy General Hospital");
    expect(letter).toContain("send an itemized statement");
    expect(letter).toContain("send a corrected bill if anything changes");
    expect(letter).toContain("I request that my account not be sent to collections while this review is open.");
    expect(letter.endsWith(disclaimer)).toBe(true);
  });
  it("keeps the no-items letter useful without inventing findings", () => {
    const letter = buildDisputeLetter(noItems);
    expect(letter).toContain("did not identify a specific document-supported discrepancy");
    expect(letter).toContain("Please send an itemized statement");
    expect(letter).not.toContain(items[0]);
    expect(letter.endsWith(disclaimer)).toBe(true);
  });
  it("builds a phone script with items or a general request and disclaimer", () => {
    const script = buildPhoneScript(analysis);
    for (const item of items) expect(script).toContain(item);
    expect(script).toContain("[your name]");
    expect(script).toContain("[account number]");
    expect(script).toContain("educational purposes");
    expect(script).toContain("not billing, medical, or legal advice");
    expect(buildPhoneScript(noItems)).toContain("Please send an itemized statement and explain");
  });
  it("provides ten short follow-up steps", () => {
    const checklist = buildDisputeChecklist();
    expect(checklist).toHaveLength(10);
    for (const phrase of ["original bill and EOB", "bracketed blank", "dated copy", "mailing date", "30 days", "reference number", "correction in writing", "corrected bill line by line", "appeal instructions", "financial assistance", "attorney"]) expect(checklist.join("\n")).toContain(phrase);
  });
});
