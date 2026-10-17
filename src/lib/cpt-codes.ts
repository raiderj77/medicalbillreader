export const CPT_REVIEWED_AT = "2026-10-16";

export type CptSource = {
  label: string;
  href: string;
};

export type CptCodeEntry = {
  code: string;
  title: string;
  plainEnglishMeaning: string;
  typicalSetting: string;
  comparisonSteps: readonly string[];
  questionsToAsk: readonly string[];
  sources: readonly CptSource[];
};

export const CPT_CODES = [
  {
    code: "99213",
    title: "What Does CPT 99213 Mean? A Plain-English Guide (2026)",
    plainEnglishMeaning:
      "CPT 99213 is one level within the evaluation-and-management family used for care involving a patient who already has an established relationship with the reporting practice. In plain language, it commonly represents a lower-complexity return encounter in a clinic or comparable ambulatory setting. The exact reporting requirements are controlled by the current CPT code set and related guidelines, not by this summary. A code on a bill shows what was reported; it does not prove what occurred, whether the documentation supported the code, whether the claim is covered, or what the patient legally owes.",
    typicalSetting:
      "This code commonly appears on a professional claim for a return evaluation-and-management encounter in a clinic or comparable ambulatory setting. It may be reported by a physician or another qualified health care professional when the current CPT requirements are met. Facility charges, tests, medicines, procedures, and other clinicians can appear as separate lines, so the code should not be treated as a complete description of the encounter. Place of service, modifiers, payer rules, documentation, and whether a separate facility bill exists can all affect claim processing.",
    comparisonSteps: [
      "Start with the EOB's allowed amount and patient-responsibility fields. Those figures reflect the health plan's processing of this particular claim and are usually more relevant than the provider's original charge.",
      "Confirm the service date, clinician, place of service, network status, and any modifiers. A comparison that ignores those details may compare unlike claims.",
      "If Medicare is the relevant benchmark, use the current CMS Physician Fee Schedule Look-Up Tool and select the applicable year and locality. Medicare payment information is not a universal commercial-market fair price.",
      "For hospital-owned outpatient settings, check the hospital's consumer price tool or machine-readable file and ask whether the displayed amount includes both professional and facility components.",
      "Ask the provider and health plan to explain a mismatch in writing. Do not rely on a national average to decide that a specific charge is correct, incorrect, fair, or legally collectible.",
    ],
    questionsToAsk: [
      "Was this line reported for the clinician's professional service, a facility service, or both?",
      "Which network contract, fee schedule, or benefit rule produced the allowed amount?",
      "Were any modifiers or place-of-service rules applied to this line?",
      "Does the account already include my copay or another payment made at the visit?",
      "Where can I review the current official code definition and the claim's adjustment or remark codes?",
    ],
    sources: [
      {
        label: "AMA: CPT 99213 educational overview",
        href: "https://www.ama-assn.org/practice-management/cpt/cpt-code-99213-established-patient-office-visit-20-29-minutes",
      },
      {
        label: "AMA: CPT evaluation-and-management resources",
        href: "https://www.ama-assn.org/practice-management/cpt/cpt-evaluation-and-management",
      },
      {
        label: "AMA: CPT licensing frequently asked questions",
        href: "https://www.ama-assn.org/practice-management/cpt/cpt-licensing-frequently-asked-questions-faqs",
      },
      {
        label: "CMS: Physician Fee Schedule Look-Up Tool overview",
        href: "https://www.cms.gov/medicare/physician-fee-schedule/search/overview",
      },
      {
        label: "CMS: Hospital price transparency requirements",
        href: "https://www.cms.gov/priorities/key-initiatives/hospital-price-transparency/hospitals",
      },
    ],
  },
] as const satisfies readonly CptCodeEntry[];

export function getCptCode(code: string): CptCodeEntry | undefined {
  return CPT_CODES.find((entry) => entry.code === code);
}
