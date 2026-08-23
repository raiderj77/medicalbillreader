import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  ANALYSIS_CODE_SYSTEM_RIGHTS_IDS,
  CODE_RIGHTS_ENTRIES,
  CODE_RIGHTS_REGISTRY,
  CODE_RIGHTS_REVIEW_DATE,
  codeDescriptionRightsPermitRendering,
  getAnalysisCodeRights,
  getCodeRights,
  mayRenderExactCodeDescription,
  mayUseAutomatedDescriptorLookup,
} from "@/config/code-set-rights";

const codesPage = readFileSync("src/app/codes-explained/page.tsx", "utf8");
const rightsRegister = readFileSync(
  "docs/medical-code-set-rights-register.md",
  "utf8",
);

describe("medical code-set rights", () => {
  it("fails closed for every current and unknown code system", () => {
    expect(CODE_RIGHTS_REVIEW_DATE).toBe("2026-08-23");
    expect(CODE_RIGHTS_ENTRIES).toHaveLength(11);
    expect(new Set(CODE_RIGHTS_ENTRIES.map((entry) => entry.id)).size).toBe(11);

    for (const entry of CODE_RIGHTS_ENTRIES) {
      expect(entry.name, entry.id).not.toBe("");
      expect(entry.maintainer, entry.id).not.toBe("");
      expect(entry.officialSource, entry.id).toMatch(/^https:\/\//);
      expect(entry.officialSourceLabel, entry.id).not.toBe("");
      expect(entry.sourceReviewStatus, entry.id).toMatch(
        /^(reviewed-primary|primary-review-pending)$/,
      );
      expect(entry.rightsStatus, entry.id).toMatch(
        /^(verified-restricted|rights-review-pending|verified-permitted)$/,
      );
      expect(entry.rightsSummary, entry.id).not.toBe("");
      expect(entry.rightsOwner, entry.id).not.toBe("");
      expect(entry.publicExplanationAllowed, entry.id).toBe(true);
      expect(entry.exactCodeExampleAllowed, entry.id).toBe(false);
      expect(entry.exactDescriptionsAllowed, entry.id).toBe(false);
      expect(entry.descriptorReproductionAllowed, entry.id).toBe(false);
      expect(entry.aiGeneratedDescriptorAllowed, entry.id).toBe(false);
      expect(entry.automatedDescriptorLookupAllowed, entry.id).toBe(false);
      expect(entry.lookupIntegrationAllowed, entry.id).toBe(false);
      expect(entry.lastReviewedDate, entry.id).toBe("2026-08-23");
      expect(entry.requiredLegalOrLicensingAction, entry.id).not.toBe("");
      expect(mayRenderExactCodeDescription(entry.id), entry.id).toBe(false);
      expect(mayUseAutomatedDescriptorLookup(entry.id), entry.id).toBe(false);
    }

    const unknown = getCodeRights("unrecognized");
    expect(unknown.id).toBe("unknown");
    expect(unknown.rightsStatus).toBe("rights-review-pending");
    expect(mayRenderExactCodeDescription("unrecognized")).toBe(false);
    expect(mayUseAutomatedDescriptorLookup("unrecognized")).toBe(false);
  });

  it("records CPT as restricted from the reviewed AMA primary source", () => {
    const cpt = CODE_RIGHTS_REGISTRY.cpt;

    expect(cpt.rightsStatus).toBe("verified-restricted");
    expect(cpt.sourceReviewStatus).toBe("reviewed-primary");
    expect(cpt.maintainer).toBe("American Medical Association");
    expect(cpt.officialSource).toBe(
      "https://www.ama-assn.org/practice-management/cpt/cpt-licensing-frequently-asked-questions-faqs",
    );
    expect(cpt.rightsSummary).toContain("no verified CPT license");
  });

  it("maps every analyzer label to a reviewed registry entry or fail-closed unknown", () => {
    expect(ANALYSIS_CODE_SYSTEM_RIGHTS_IDS).toEqual({
      CPT: "cpt",
      HCPCS: "hcpcs-level-ii",
      "ICD-10-CM": "icd-10-cm",
      NDC: "ndc",
      DRG: "drg",
      revenue: "revenue-codes",
      modifier: "modifiers",
      other: "unknown",
      unclear: "unknown",
    });

    for (const system of Object.keys(ANALYSIS_CODE_SYSTEM_RIGHTS_IDS)) {
      expect(codeDescriptionRightsPermitRendering(getAnalysisCodeRights(system))).toBe(
        false,
      );
    }
    expect(getAnalysisCodeRights("unexpected").id).toBe("unknown");
  });

  it("requires every rendering permission before a future descriptor can appear", () => {
    expect(
      codeDescriptionRightsPermitRendering({
        rightsStatus: "verified-permitted",
        exactDescriptionsAllowed: true,
        descriptorReproductionAllowed: true,
      }),
    ).toBe(true);
    expect(
      codeDescriptionRightsPermitRendering({
        rightsStatus: "verified-permitted",
        exactDescriptionsAllowed: true,
        descriptorReproductionAllowed: false,
      }),
    ).toBe(false);
    expect(
      codeDescriptionRightsPermitRendering({
        rightsStatus: "rights-review-pending",
        exactDescriptionsAllowed: true,
        descriptorReproductionAllowed: true,
      }),
    ).toBe(false);
  });

  it("keeps all other rights explicitly pending", () => {
    for (const entry of CODE_RIGHTS_ENTRIES.filter(
      (candidate) =>
        candidate.id !== "cpt" && candidate.id !== "hcpcs-level-i",
    )) {
      expect(entry.rightsStatus, entry.id).toBe("rights-review-pending");
      expect(entry.sourceReviewStatus, entry.id).toBe(
        "primary-review-pending",
      );
    }
  });

  it("removes rights-unverified exact code-description examples", () => {
    for (const prohibitedExample of [
      "99213",
      "J3490",
      "E11.9",
      "0FT44ZZ",
      "MS-DRG 470",
      "Modifier 50",
      "POS 22",
      "Revenue code 0450",
    ]) {
      expect(codesPage, prohibitedExample).not.toContain(prohibitedExample);
    }

    expect(codesPage).toContain("Exact code-and-description examples");
    expect(codesPage).toContain("Rights status:");
    expect(codesPage).toContain("Official source:");
    expect(codesPage).toContain("not a code");
    expect(codesPage).toContain("coding audit");
  });

  it("documents the fail-closed implementation and future owner gate", () => {
    expect(rightsRegister).toContain("Status: fail closed");
    expect(rightsRegister).toContain("No product-specific Medical Bill Reader CPT license");
    expect(rightsRegister).toContain("verified-permitted");
    expect(rightsRegister).toContain("owner approval for cost and production release");
  });
});
