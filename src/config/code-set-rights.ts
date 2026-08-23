// Fail closed until a primary-source and product-specific rights review permits use.
export const CODE_RIGHTS_REVIEW_DATE = "2026-08-23";

export type CodeRightsStatus =
  | "verified-restricted"
  | "rights-review-pending"
  | "verified-permitted";

export type SourceReviewStatus = "reviewed-primary" | "primary-review-pending";

export type CodeSystemId =
  | "cpt"
  | "hcpcs-level-i"
  | "hcpcs-level-ii"
  | "icd-10-cm"
  | "icd-10-pcs"
  | "ndc"
  | "drg"
  | "revenue-codes"
  | "modifiers"
  | "place-of-service"
  | "adjustment-remark-codes";

export type CodeRightsEntry = {
  id: CodeSystemId;
  name: string;
  maintainer: string;
  rightsOwner: string;
  officialSource: string;
  officialSourceLabel: string;
  sourceReviewStatus: SourceReviewStatus;
  rightsStatus: CodeRightsStatus;
  rightsSummary: string;
  publicExplanationAllowed: boolean;
  exactCodeExampleAllowed: boolean;
  exactDescriptionsAllowed: boolean;
  descriptorReproductionAllowed: boolean;
  aiGeneratedDescriptorAllowed: boolean;
  automatedDescriptorLookupAllowed: boolean;
  lookupIntegrationAllowed: boolean;
  lastReviewedDate: string;
  requiredLegalOrLicensingAction: string;
};

export type UnknownCodeRightsEntry = Omit<CodeRightsEntry, "id"> & {
  id: "unknown";
};

export type ResolvedCodeRightsEntry = CodeRightsEntry | UnknownCodeRightsEntry;

export type CodeDescriptionRights = Pick<
  ResolvedCodeRightsEntry,
  "rightsStatus" | "exactDescriptionsAllowed" | "descriptorReproductionAllowed"
>;

const entries = [
  {
    id: "cpt",
    name: "CPT (Current Procedural Terminology)",
    maintainer: "American Medical Association",
    rightsOwner: "American Medical Association",
    officialSource:
      "https://www.ama-assn.org/practice-management/cpt/cpt-licensing-frequently-asked-questions-faqs",
    officialSourceLabel: "AMA CPT licensing FAQ",
    sourceReviewStatus: "reviewed-primary",
    rightsStatus: "verified-restricted",
    rightsSummary:
      "The AMA says electronic products that use, reference, or display CPT content need an appropriate license. This product has no verified CPT license on record.",
    publicExplanationAllowed: true,
    exactCodeExampleAllowed: false,
    exactDescriptionsAllowed: false,
    descriptorReproductionAllowed: false,
    aiGeneratedDescriptorAllowed: false,
    automatedDescriptorLookupAllowed: false,
    lookupIntegrationAllowed: false,
    lastReviewedDate: CODE_RIGHTS_REVIEW_DATE,
    requiredLegalOrLicensingAction:
      "Obtain written, product-specific AMA licensing approval covering public display, development, and AI use before enabling any restricted behavior.",
  },
  {
    id: "hcpcs-level-i",
    name: "HCPCS Level I (CPT)",
    maintainer: "American Medical Association",
    rightsOwner: "American Medical Association",
    officialSource:
      "https://www.ama-assn.org/practice-management/cpt/cpt-licensing-frequently-asked-questions-faqs",
    officialSourceLabel: "AMA CPT licensing FAQ",
    sourceReviewStatus: "reviewed-primary",
    rightsStatus: "verified-restricted",
    rightsSummary:
      "HCPCS Level I is CPT. The same unresolved product-specific CPT license restriction applies.",
    publicExplanationAllowed: true,
    exactCodeExampleAllowed: false,
    exactDescriptionsAllowed: false,
    descriptorReproductionAllowed: false,
    aiGeneratedDescriptorAllowed: false,
    automatedDescriptorLookupAllowed: false,
    lookupIntegrationAllowed: false,
    lastReviewedDate: CODE_RIGHTS_REVIEW_DATE,
    requiredLegalOrLicensingAction:
      "Resolve the product-specific AMA CPT license before any exact Level I example, descriptor, AI explanation, or lookup.",
  },
  {
    id: "hcpcs-level-ii",
    name: "HCPCS Level II",
    maintainer: "Centers for Medicare & Medicaid Services",
    rightsOwner: "Rights owner not yet verified for product reuse",
    officialSource:
      "https://www.cms.gov/medicare/coding-billing/healthcare-common-procedure-system",
    officialSourceLabel: "CMS HCPCS overview",
    sourceReviewStatus: "primary-review-pending",
    rightsStatus: "rights-review-pending",
    rightsSummary:
      "The system-level source is official, but product display and reuse rights have not been reviewed for this implementation.",
    publicExplanationAllowed: true,
    exactCodeExampleAllowed: false,
    exactDescriptionsAllowed: false,
    descriptorReproductionAllowed: false,
    aiGeneratedDescriptorAllowed: false,
    automatedDescriptorLookupAllowed: false,
    lookupIntegrationAllowed: false,
    lastReviewedDate: CODE_RIGHTS_REVIEW_DATE,
    requiredLegalOrLicensingAction:
      "Complete a primary-source rights and product-reuse review before exact examples, descriptions, AI descriptions, or lookup.",
  },
  {
    id: "icd-10-cm",
    name: "ICD-10-CM",
    maintainer: "U.S. federal health agencies",
    rightsOwner: "Rights owner not yet verified for product reuse",
    officialSource:
      "https://www.cms.gov/medicare/coding-billing/icd-10-codes",
    officialSourceLabel: "CMS ICD-10 overview",
    sourceReviewStatus: "primary-review-pending",
    rightsStatus: "rights-review-pending",
    rightsSummary:
      "The system-level source is official, but current product display and reuse rights have not been documented.",
    publicExplanationAllowed: true,
    exactCodeExampleAllowed: false,
    exactDescriptionsAllowed: false,
    descriptorReproductionAllowed: false,
    aiGeneratedDescriptorAllowed: false,
    automatedDescriptorLookupAllowed: false,
    lookupIntegrationAllowed: false,
    lastReviewedDate: CODE_RIGHTS_REVIEW_DATE,
    requiredLegalOrLicensingAction:
      "Document current ownership, license terms, attribution, and permitted public/AI/lookup uses before enabling them.",
  },
  {
    id: "icd-10-pcs",
    name: "ICD-10-PCS",
    maintainer: "Centers for Medicare & Medicaid Services",
    rightsOwner: "Rights owner not yet verified for product reuse",
    officialSource:
      "https://www.cms.gov/medicare/coding-billing/icd-10-codes",
    officialSourceLabel: "CMS ICD-10 overview",
    sourceReviewStatus: "primary-review-pending",
    rightsStatus: "rights-review-pending",
    rightsSummary:
      "The system-level source is official, but current product display and reuse rights have not been documented.",
    publicExplanationAllowed: true,
    exactCodeExampleAllowed: false,
    exactDescriptionsAllowed: false,
    descriptorReproductionAllowed: false,
    aiGeneratedDescriptorAllowed: false,
    automatedDescriptorLookupAllowed: false,
    lookupIntegrationAllowed: false,
    lastReviewedDate: CODE_RIGHTS_REVIEW_DATE,
    requiredLegalOrLicensingAction:
      "Document current ownership, license terms, attribution, and permitted public/AI/lookup uses before enabling them.",
  },
  {
    id: "ndc",
    name: "NDC (National Drug Code)",
    maintainer: "U.S. Food and Drug Administration",
    rightsOwner: "Rights owner not yet verified for product reuse",
    officialSource:
      "https://www.fda.gov/drugs/electronic-drug-registration-and-listing-system-edrls/national-drug-code-format",
    officialSourceLabel: "FDA NDC format",
    sourceReviewStatus: "primary-review-pending",
    rightsStatus: "rights-review-pending",
    rightsSummary:
      "The format source is official, but product reuse rights for exact drug descriptions have not been reviewed.",
    publicExplanationAllowed: true,
    exactCodeExampleAllowed: false,
    exactDescriptionsAllowed: false,
    descriptorReproductionAllowed: false,
    aiGeneratedDescriptorAllowed: false,
    automatedDescriptorLookupAllowed: false,
    lookupIntegrationAllowed: false,
    lastReviewedDate: CODE_RIGHTS_REVIEW_DATE,
    requiredLegalOrLicensingAction:
      "Review FDA source terms and any linked drug-data rights before exact product examples, descriptions, AI descriptions, or lookup.",
  },
  {
    id: "drg",
    name: "DRG and MS-DRG",
    maintainer: "Centers for Medicare & Medicaid Services",
    rightsOwner: "Rights owner not yet verified for product reuse",
    officialSource:
      "https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps/ms-drg-classifications-and-software",
    officialSourceLabel: "CMS MS-DRG resources",
    sourceReviewStatus: "primary-review-pending",
    rightsStatus: "rights-review-pending",
    rightsSummary:
      "The system-level source is official, but current product display and reuse rights have not been documented.",
    publicExplanationAllowed: true,
    exactCodeExampleAllowed: false,
    exactDescriptionsAllowed: false,
    descriptorReproductionAllowed: false,
    aiGeneratedDescriptorAllowed: false,
    automatedDescriptorLookupAllowed: false,
    lookupIntegrationAllowed: false,
    lastReviewedDate: CODE_RIGHTS_REVIEW_DATE,
    requiredLegalOrLicensingAction:
      "Document current ownership and permitted public/AI/lookup use before exact group examples or descriptions.",
  },
  {
    id: "revenue-codes",
    name: "Revenue codes",
    maintainer: "National Uniform Billing Committee",
    rightsOwner: "National Uniform Billing Committee; exact rights scope pending",
    officialSource: "https://www.nubc.org/",
    officialSourceLabel: "NUBC overview",
    sourceReviewStatus: "primary-review-pending",
    rightsStatus: "rights-review-pending",
    rightsSummary:
      "The official publisher is identified, but product display and reuse rights have not been reviewed.",
    publicExplanationAllowed: true,
    exactCodeExampleAllowed: false,
    exactDescriptionsAllowed: false,
    descriptorReproductionAllowed: false,
    aiGeneratedDescriptorAllowed: false,
    automatedDescriptorLookupAllowed: false,
    lookupIntegrationAllowed: false,
    lastReviewedDate: CODE_RIGHTS_REVIEW_DATE,
    requiredLegalOrLicensingAction:
      "Obtain and review current NUBC licensing terms for this product before exact examples, descriptions, AI descriptions, or lookup.",
  },
  {
    id: "modifiers",
    name: "Procedure-code modifiers",
    maintainer: "Code-set maintainers and CMS",
    rightsOwner: "Depends on the underlying code set; unresolved",
    officialSource:
      "https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-faq-library",
    officialSourceLabel: "CMS NCCI FAQ library",
    sourceReviewStatus: "primary-review-pending",
    rightsStatus: "rights-review-pending",
    rightsSummary:
      "Modifier ownership and reuse can depend on the underlying code set. Exact descriptions remain disabled until reviewed.",
    publicExplanationAllowed: true,
    exactCodeExampleAllowed: false,
    exactDescriptionsAllowed: false,
    descriptorReproductionAllowed: false,
    aiGeneratedDescriptorAllowed: false,
    automatedDescriptorLookupAllowed: false,
    lookupIntegrationAllowed: false,
    lastReviewedDate: CODE_RIGHTS_REVIEW_DATE,
    requiredLegalOrLicensingAction:
      "Resolve the rights of each underlying modifier/code set before exact examples, descriptions, AI descriptions, or lookup.",
  },
  {
    id: "place-of-service",
    name: "Place of Service codes",
    maintainer: "Centers for Medicare & Medicaid Services",
    rightsOwner: "Rights owner not yet verified for product reuse",
    officialSource:
      "https://www.cms.gov/medicare/coding-billing/place-of-service-codes/code-sets",
    officialSourceLabel: "CMS Place of Service code set",
    sourceReviewStatus: "primary-review-pending",
    rightsStatus: "rights-review-pending",
    rightsSummary:
      "The system-level source is official, but current product display and reuse rights have not been documented.",
    publicExplanationAllowed: true,
    exactCodeExampleAllowed: false,
    exactDescriptionsAllowed: false,
    descriptorReproductionAllowed: false,
    aiGeneratedDescriptorAllowed: false,
    automatedDescriptorLookupAllowed: false,
    lookupIntegrationAllowed: false,
    lastReviewedDate: CODE_RIGHTS_REVIEW_DATE,
    requiredLegalOrLicensingAction:
      "Document current ownership, attribution, and permitted product uses before exact examples, descriptions, AI descriptions, or lookup.",
  },
  {
    id: "adjustment-remark-codes",
    name: "Claim adjustment and remittance remark codes",
    maintainer: "X12",
    rightsOwner: "X12; exact rights scope pending",
    officialSource: "https://x12.org/codes",
    officialSourceLabel: "X12 code lists",
    sourceReviewStatus: "primary-review-pending",
    rightsStatus: "rights-review-pending",
    rightsSummary:
      "The official standards source is identified, but product display and reuse rights for CARC and RARC descriptions have not been reviewed.",
    publicExplanationAllowed: true,
    exactCodeExampleAllowed: false,
    exactDescriptionsAllowed: false,
    descriptorReproductionAllowed: false,
    aiGeneratedDescriptorAllowed: false,
    automatedDescriptorLookupAllowed: false,
    lookupIntegrationAllowed: false,
    lastReviewedDate: CODE_RIGHTS_REVIEW_DATE,
    requiredLegalOrLicensingAction:
      "Review and obtain any required X12 license for exact examples, descriptions, AI descriptions, bulk reproduction, or lookup.",
  },
] as const satisfies readonly CodeRightsEntry[];

export const CODE_RIGHTS_REGISTRY: Readonly<
  Record<CodeSystemId, CodeRightsEntry>
> = Object.freeze(
  Object.fromEntries(entries.map((entry) => [entry.id, Object.freeze(entry)])) as
    Record<CodeSystemId, CodeRightsEntry>,
);

export const CODE_RIGHTS_ENTRIES: readonly CodeRightsEntry[] = entries;

const UNKNOWN_RIGHTS: Readonly<UnknownCodeRightsEntry> = Object.freeze({
  id: "unknown",
  name: "Unrecognized code system",
  maintainer: "Unknown",
  rightsOwner: "Unknown",
  officialSource: "",
  officialSourceLabel: "No verified source",
  sourceReviewStatus: "primary-review-pending",
  rightsStatus: "rights-review-pending",
  rightsSummary:
    "No rights review exists for this code system. Exact descriptions and automated lookup remain disabled.",
  publicExplanationAllowed: false,
  exactCodeExampleAllowed: false,
  exactDescriptionsAllowed: false,
  descriptorReproductionAllowed: false,
  aiGeneratedDescriptorAllowed: false,
  automatedDescriptorLookupAllowed: false,
  lookupIntegrationAllowed: false,
  lastReviewedDate: CODE_RIGHTS_REVIEW_DATE,
  requiredLegalOrLicensingAction:
    "Identify the system and complete product-specific primary-source rights review before use.",
});

export function getCodeRights(system: string): Readonly<ResolvedCodeRightsEntry> {
  return CODE_RIGHTS_REGISTRY[system as CodeSystemId] ?? UNKNOWN_RIGHTS;
}

/**
 * The analyzer uses a deliberately smaller set of labels than the rights
 * register. A plain `HCPCS` label maps to Level II because CPT/Level I has its
 * own explicit analyzer label. Ambiguous labels remain unknown and fail closed.
 */
export const ANALYSIS_CODE_SYSTEM_RIGHTS_IDS = Object.freeze({
  CPT: "cpt",
  HCPCS: "hcpcs-level-ii",
  "ICD-10-CM": "icd-10-cm",
  NDC: "ndc",
  DRG: "drg",
  revenue: "revenue-codes",
  modifier: "modifiers",
  other: "unknown",
  unclear: "unknown",
} as const);

export type AnalysisCodeSystem = keyof typeof ANALYSIS_CODE_SYSTEM_RIGHTS_IDS;

export function getAnalysisCodeRights(
  system: string,
): Readonly<ResolvedCodeRightsEntry> {
  const id = ANALYSIS_CODE_SYSTEM_RIGHTS_IDS[system as AnalysisCodeSystem];
  return id === undefined || id === "unknown" ? UNKNOWN_RIGHTS : getCodeRights(id);
}

export function codeDescriptionRightsPermitRendering(
  rights: CodeDescriptionRights,
): boolean {
  return (
    rights.rightsStatus === "verified-permitted" &&
    rights.exactDescriptionsAllowed === true &&
    rights.descriptorReproductionAllowed === true
  );
}

export function mayRenderExactCodeDescription(system: string): boolean {
  return codeDescriptionRightsPermitRendering(getCodeRights(system));
}

export function mayUseAutomatedDescriptorLookup(system: string): boolean {
  const rights = getCodeRights(system);
  return (
    rights.rightsStatus === "verified-permitted" &&
    rights.automatedDescriptorLookupAllowed === true
  );
}
