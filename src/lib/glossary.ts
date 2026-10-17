export const GLOSSARY_REVIEWED_AT = "2026-10-16";

export type GlossarySource = {
  label: string;
  href: string;
};

export type GlossaryTerm = {
  slug: string;
  term: string;
  aliases: readonly string[];
  shortDefinition: string;
  definition: string;
  sources: readonly GlossarySource[];
};

const CMS_TERMS_SOURCE = {
  label: "CMS: Health insurance terms you should know",
  href: "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/terms-you-should-know",
} as const;

const CMS_EOB_SOURCE = {
  label: "CMS: How to read an Explanation of Benefits",
  href: "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/read-explanation-benefits",
} as const;

const CMS_INSURANCE_RIGHTS_SOURCE = {
  label: "CMS: Medical bill rights when using insurance",
  href: "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/know-your-rights/insurance",
} as const;

export const GLOSSARY_TERMS = [
  {
    slug: "explanation-of-benefits",
    term: "Explanation of Benefits (EOB)",
    aliases: ["Explanation of Benefits", "EOB"],
    shortDefinition:
      "A health plan's statement showing how it processed a claim; it is not a provider bill.",
    definition: `An Explanation of Benefits, commonly shortened to EOB, is a statement from a health plan describing how it processed one or more claims. It commonly identifies the patient, provider, dates of service, billed charges, the plan's allowed amount, what the plan paid, and the patient-responsibility amount calculated under the plan. Labels and layouts vary, and an EOB may also show adjustment or remark codes that explain a denial or reduction.

An EOB is not a provider bill. Its patient-responsibility field also may not reflect money already paid, a later corrected claim, or every protection that applies. Compare it with the provider's detailed bill and your own records rather than paying from the EOB alone. If the figures do not reconcile, ask the health plan to explain its calculation and ask the provider how payments and adjustments were posted. Follow the appeal instructions and deadline on your own notice when disputing the plan's claim decision.`,
    sources: [CMS_EOB_SOURCE, CMS_TERMS_SOURCE],
  },
  {
    slug: "allowed-amount",
    term: "Allowed amount",
    aliases: ["allowed amount", "allowable amount", "negotiated rate"],
    shortDefinition:
      "The amount a health plan uses as the payment basis for a covered service under its rules.",
    definition: `The allowed amount is the figure a health plan treats as eligible when calculating benefits for a covered service. A plan may use labels such as eligible expense, payment allowance, or negotiated rate. It is not necessarily the provider's original charge, the amount the plan pays, or the amount the patient ultimately owes. Deductible, copayment, coinsurance, network status, prior payments, and applicable billing protections can all affect the result.

On an EOB, compare the allowed amount with the billed charge, plan payment, adjustments, and patient-responsibility columns. For an in-network claim, the provider's contract often limits how much of the difference can be billed to the patient, but the exact rule depends on the service and plan. Out-of-network claims can work differently, and federal or state protections may apply in certain situations. Ask the plan which contract or benefit rule produced the amount, and ask the provider to explain any bill that does not match the processed claim.`,
    sources: [CMS_TERMS_SOURCE, CMS_EOB_SOURCE],
  },
  {
    slug: "chargemaster",
    term: "Chargemaster",
    aliases: ["chargemaster", "charge master"],
    shortDefinition:
      "A hospital's internal list of gross charges for items and services, not a prediction of what a particular patient will owe.",
    definition: `A chargemaster is a hospital's internal list of gross charges for individual items and services. It can include room charges, supplies, medications, tests, procedures, and other billable entries. A chargemaster amount is a starting list price, not a reliable prediction of the amount an insurer will allow, a hospital will accept, or a particular patient will owe. Contracts, discounts, benefit rules, financial assistance, and the details of an encounter can produce very different figures.

Federal hospital price-transparency rules now require most hospitals to publish more than a traditional chargemaster. Their machine-readable files generally include categories such as gross charges, discounted cash prices, payer-specific negotiated charges, and de-identified minimum and maximum negotiated charges. Use the category that matches the question you are asking and confirm the hospital, setting, code, and included services. A single line can omit related professional or facility charges, so request a personalized estimate and verify the result with the hospital and health plan before relying on it.`,
    sources: [
      {
        label: "CMS: Hospital price transparency requirements",
        href: "https://www.cms.gov/priorities/key-initiatives/hospital-price-transparency/hospitals",
      },
      {
        label: "CMS: Hospital Price Transparency Fact Sheet",
        href: "https://www.cms.gov/newsroom/fact-sheets/hospital-price-transparency-fact-sheet",
      },
    ],
  },
  {
    slug: "deductible",
    term: "Deductible",
    aliases: ["deductible"],
    shortDefinition:
      "An amount a member may need to pay for covered services before the plan begins paying for services subject to that deductible.",
    definition: `A deductible is an amount a health-plan member may need to pay during a coverage period, often a plan year, before the plan begins paying for covered services that are subject to the deductible. A plan can have an overall deductible, separate deductibles for particular benefits, or both. Some services may be covered before the deductible is met, and family coverage may have individual and family thresholds. The plan document controls these details.

An EOB may show how much of a processed claim was assigned to the deductible and how much remains. That entry is part of the plan's calculation; compare it with prior EOBs and the plan portal if the running total seems wrong. Meeting a deductible does not mean every later service is free. Copayments, coinsurance, noncovered care, premiums, and amounts that do not count toward the out-of-pocket maximum may remain. Ask the plan whether the service was covered, which deductible applied, and whether the provider was in network.`,
    sources: [CMS_TERMS_SOURCE],
  },
  {
    slug: "copay",
    term: "Copay",
    aliases: ["copay", "copayment"],
    shortDefinition:
      "A fixed cost-sharing amount a plan assigns to a covered visit, service, or item under specified conditions.",
    definition: `A copay, or copayment, is a fixed amount a health plan may require a member to pay for a covered visit, service, prescription, or other item. The amount can vary by benefit category, network tier, place of service, or drug tier. Although copays are often collected at the time of care, the final claim can be processed differently if the service was not covered, the provider was out of network, or another plan rule applied.

Do not assume every amount collected at check-in is the final copay. Compare the receipt with the EOB and provider bill after the claim is processed. Some plans apply a service to the deductible instead of, or before, a copay; others cover certain preventive services without cost sharing when requirements are met. The plan's Summary of Benefits and Coverage and full plan document are the best places to check. If the bill lists both a copay and another patient amount, ask the plan and provider to explain how the payment was credited.`,
    sources: [CMS_TERMS_SOURCE],
  },
  {
    slug: "coinsurance",
    term: "Coinsurance",
    aliases: ["coinsurance"],
    shortDefinition:
      "Percentage-based cost sharing that is generally calculated from a plan's allowed amount for a covered service.",
    definition: `Coinsurance is percentage-based cost sharing for a covered service. It is generally calculated from the health plan's allowed amount, not automatically from the provider's original charge. In a synthetic example, if a plan allowed $200 and assigned 20% coinsurance after any applicable deductible, the calculated coinsurance would be $40. Real claims can include multiple lines, separate facility and professional services, or other benefit rules, so the EOB controls the plan's calculation.

Coinsurance commonly applies after an applicable deductible has been met, but plan designs differ. The percentage can change with network status, service category, or tier, and an out-of-network provider may also seek an additional balance when billing is permitted. Check the EOB for the allowed amount and the portion assigned to coinsurance, then compare those figures with the provider bill. Ask the plan which benefit and network rule it used if the percentage or calculation is unclear. A displayed percentage alone does not establish the final legal amount owed.`,
    sources: [CMS_TERMS_SOURCE],
  },
  {
    slug: "out-of-pocket-maximum",
    term: "Out-of-pocket maximum",
    aliases: ["out-of-pocket maximum", "out-of-pocket max", "out-of-pocket limit", "OOP max"],
    shortDefinition:
      "A plan-year limit on eligible member cost sharing for covered services under the plan's rules.",
    definition: `An out-of-pocket maximum, also called an out-of-pocket limit, is the most a member could pay during a coverage period for eligible cost sharing on covered services under the plan's rules. After the applicable limit is met, the plan generally pays the allowed amount for additional covered services for the rest of that period. Individual and family limits can interact, and network tiers may have separate limits.

Not every payment counts toward the maximum. Premiums, balance-billed amounts, noncovered services, and some out-of-network spending are commonly excluded; a plan may identify other exclusions. A provider's bill also may not know the plan's current accumulation total. Review the EOB and plan portal, keep receipts, and ask the plan to correct an amount that should have been credited. Reaching the displayed limit does not make every service covered: coverage rules, network rules, and authorization requirements can still apply. Use the plan document and current EOBs rather than a generic definition to determine how the limit works for a specific claim.`,
    sources: [CMS_TERMS_SOURCE],
  },
  {
    slug: "prior-authorization",
    term: "Prior authorization",
    aliases: ["prior authorization", "preauthorization", "prior approval", "precertification"],
    shortDefinition:
      "A health plan's advance review that may be required before certain services, prescriptions, or supplies will be considered for coverage.",
    definition: `Prior authorization is a health plan's advance review process for certain services, treatments, prescriptions, equipment, or supplies. The plan may require a clinician or facility to submit clinical and administrative information before the item or service is provided. The plan then decides whether its stated coverage criteria are met. Other names include preauthorization, prior approval, and precertification.

An authorization is not a guarantee that the plan will pay the claim. Eligibility, network status, coding, benefit limits, changes in the service, and other claim rules can still affect coverage and patient responsibility. Before scheduled care, ask both the provider and plan whether authorization is required, who is submitting it, what exact service and dates it covers, and whether written confirmation is available. Keep the reference number and decision notice. If a claim is denied for missing or mismatched authorization, read the denial reason and appeal instructions promptly; emergency-care rules and appeal rights can differ, so rely on the plan's current notice and applicable law.`,
    sources: [
      {
        label: "HealthCare.gov: Preauthorization glossary",
        href: "https://www.healthcare.gov/glossary/preauthorization/",
      },
      {
        label: "HealthCare.gov: Prior authorization glossary",
        href: "https://www.healthcare.gov/glossary/prior-authorization/",
      },
    ],
  },
  {
    slug: "balance-billing",
    term: "Balance billing",
    aliases: ["balance billing", "balance bill", "balance-billed", "balance billed"],
    shortDefinition:
      "A provider's attempt to bill a patient for a difference not paid by the health plan, subject to contracts and applicable protections.",
    definition: `Balance billing occurs when a provider seeks payment from a patient for a difference between the provider's charge and the amount the health plan recognizes or pays. It is most often associated with out-of-network care. The presence of a difference on an EOB does not by itself establish that the provider may legally collect it; network contracts, plan terms, federal protections, and state law can limit balance billing in particular situations.

If a balance appears, compare the EOB and provider bill line by line. Confirm the provider's network status for the service date, the plan's allowed amount, payments already made, and the reason code. Federal No Surprises Act protections generally restrict certain out-of-network bills for emergency care, air ambulance services, and some non-emergency services at in-network facilities, but exceptions and notice-and-consent rules exist. Ground ambulance charges are not covered by those federal protections as of this review, though state rules may help. Contact the plan and provider before paying an unexplained difference.`,
    sources: [CMS_TERMS_SOURCE, CMS_INSURANCE_RIGHTS_SOURCE],
  },
  {
    slug: "surprise-billing",
    term: "Surprise billing",
    aliases: ["surprise billing", "surprise bill", "No Surprises Act"],
    shortDefinition:
      "Unexpected out-of-network billing that may be restricted by federal or state protections in specified situations.",
    definition: `Surprise billing usually refers to an unexpected out-of-network bill, such as one arising from emergency care or from an out-of-network clinician involved in care at an in-network facility. For care on or after January 1, 2022, the federal No Surprises Act limits patient charges in many emergency situations, for covered air ambulance services, and for certain non-emergency services furnished by out-of-network clinicians at in-network facilities. The protections do not apply to every plan, provider, service, or bill.

Federal protections generally do not cover ground ambulance services as of this review, although state law may provide separate safeguards. Some non-emergency protections can also involve notice-and-consent rules. If a bill looks like a surprise bill, do not assume the label resolves the case. Compare the EOB, network information, facility, provider type, and service date. Ask the plan to reprocess a protected claim when appropriate. The federal No Surprises Help Desk is 1-800-985-3059, and a state insurance department may explain additional state protections.`,
    sources: [CMS_INSURANCE_RIGHTS_SOURCE, CMS_TERMS_SOURCE],
  },
  {
    slug: "good-faith-estimate",
    term: "Good Faith Estimate",
    aliases: ["Good Faith Estimate", "good-faith estimate", "GFE"],
    shortDefinition:
      "A written estimate of expected charges generally provided to uninsured or self-pay people before scheduled care or upon request.",
    definition: `A Good Faith Estimate is a written estimate of expected charges for scheduled health care provided to a person who is uninsured or who is not using insurance for that care. Under federal rules, a provider or facility generally must give an estimate after the person schedules an item or service and must also provide one upon request. The estimate should help identify expected services and charges, but unforeseen or separately billed care can make the final bill different.

As reviewed October 16, 2026, a patient may be eligible for the federal patient-provider dispute process when an initial bill from a listed provider or facility is at least $400 above that provider's estimate and the other eligibility rules are met. CMS states that the initial bill generally must be within the past 120 calendar days and that filing requires a $25 administrative fee. Those details can change, so use the current CMS eligibility tool and instructions. Keep the estimate and bill, compare providers separately, and ask about missing estimates or unexplained differences promptly.`,
    sources: [
      {
        label: "CMS: Providers' Good Faith Estimate responsibilities",
        href: "https://www.cms.gov/initiatives/no-surprise-billing/overview/policies-resources/providers-payment-resolution-patients",
      },
      {
        label: "CMS: Patient-provider bill dispute eligibility",
        href: "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/dispute-bill",
      },
    ],
  },
  {
    slug: "itemized-bill",
    term: "Itemized bill",
    aliases: ["itemized bill", "detailed bill", "itemized statement"],
    shortDefinition:
      "A provider statement that separates billed items or services instead of showing only a summary total.",
    definition: `An itemized bill is a provider statement that separates the costs being billed instead of showing only a summary balance. Depending on the provider and setting, it may list service dates, descriptions, billing codes, quantities, charges, payments, and adjustments. It is different from an EOB: the provider issues the bill, while the health plan issues the EOB to explain claim processing.

CMS advises people reviewing a medical bill to ask the provider's billing department for a detailed list of the cost of each item or service. That practical guidance should not be overstated as one universal federal right to every preferred format in every billing situation. Access rights, required detail, fees, and timing can depend on the records requested, the provider, the payer, and applicable federal or state law. When the detailed bill arrives, compare it with the EOB and your records. Ask about unfamiliar dates, quantities, descriptions, or duplicate-looking lines without assuming they prove an error. Request corrections through the provider and plan processes that apply.`,
    sources: [
      {
        label: "CMS: Check your medical bill for errors",
        href: "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/check-your-bill-errors",
      },
      CMS_EOB_SOURCE,
    ],
  },
] as const satisfies readonly GlossaryTerm[];

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY_TERMS.find((entry) => entry.slug === slug);
}
