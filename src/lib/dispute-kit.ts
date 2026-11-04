function section(analysisText: string, heading: string): string {
  const lines = analysisText.split(/\r?\n/);
  const start = lines.indexOf(`## ${heading}`);
  if (start < 0) return "";
  const end = lines.findIndex((line, index) => index > start && line.startsWith("## "));
  return lines.slice(start + 1, end < 0 ? undefined : end).join("\n");
}

export function extractVerifyItems(analysisText: string): string[] {
  const contents = section(analysisText, "Items To Verify");
  if (/no document-supported discrepancy/i.test(contents)) return [];
  return contents.split("\n").filter((line) => line.startsWith("- ")).map((line) => line.slice(2));
}

export function extractProviderName(analysisText: string): string | null {
  const contents = section(analysisText, "What This Document Appears To Be");
  const patterns = [
    /from\s+([A-Z][A-Za-z0-9&.\x27-]+(?:\s+(?:[A-Z][A-Za-z0-9&.\x27-]+|of|the|for)){0,5}?)\s+(?:for|dated|covering|with|shows|lists)\b/,
    /issued by\s+([A-Z][A-Za-z0-9&.\x27-]+(?:\s+[A-Z][A-Za-z0-9&.\x27-]+){0,5})/,
  ];
  for (const pattern of patterns) {
    const candidate = contents.match(pattern)?.[1]?.replace(/(?:\s+(?:for|the))+$/i, "").trim();
    if (candidate && candidate.length >= 3 && candidate.length <= 60 && !/[$\r\n]/.test(candidate)) return candidate;
  }
  return null;
}

const disclaimer = "This letter was prepared with an educational tool and is not billing, medical, or legal advice. Verify every detail against your bill before sending.";

export function buildDisputeLetter(analysisText: string): string {
  const provider = extractProviderName(analysisText);
  const items = extractVerifyItems(analysisText);
  const request = items.length
    ? `Please verify the following items from my bill:\n\n${items.map((item, index) => `${index + 1}. ${item}`).join("\n")}\n\nPlease explain each item, correct any item you cannot support, send a corrected bill if anything changes, and confirm the outcome in writing. I request that my account not be sent to collections while this review is open.`
    : "A review of the document did not identify a specific document-supported discrepancy. Please send an itemized statement and a written explanation of how the amount due was calculated so I can verify it.";
  return `[Your full name]
[Your street address]
[City, State ZIP]
[Your phone number]
[Date]

To: Billing Department${provider ? `, ${provider}` : ""}
[Provider billing address]

Re: Request for review of my bill
Account number: [account number from your bill]
Date(s) of service: [dates from your bill]

I received my bill and reviewed it. I am asking your billing office to verify the items below and send an itemized statement if one has not been provided.

${request}

Thank you for reviewing this request. Please contact me at:
[Your full name]
[Your street address]
[City, State ZIP]
[Your phone number]

Sincerely,
[Your signature and printed name]

${disclaimer}`;
}

export function buildPhoneScript(analysisText: string): string {
  const items = extractVerifyItems(analysisText);
  return `Before you call
Have the bill, the letter, and a pen ready. Note the date, the representative name, and any reference number.

Opening
Hello, my name is [your name], and my account number is [account number]. I am asking for a review of specific items on my bill, or an itemized statement to help me verify it.

Your items
${items.length ? items.map((item) => `- ${item}`).join("\n") : "Please send an itemized statement and explain how the amount due was calculated so I can verify it."}

Questions to ask
- Please send an itemized statement.
- Can you explain this line?
- If it cannot be supported, what is the correction process?
- Please note the account as under review.
- Please confirm any change in writing.

Closing
Thank you. Let me repeat the reference number: [reference number]. What happens next, and when should I follow up?

This script is for educational purposes and is not billing, medical, or legal advice. Verify every detail against your bill.`;
}

export function buildDisputeChecklist(): string[] {
  return [
    "Keep the original bill and EOB together.",
    "Compare the bill against the EOB line by line.",
    "Fill in every bracketed blank in the letter from your bill.",
    "Send the letter and keep a dated copy.",
    "Write down the mailing date or confirmation.",
    "Calendar a follow-up in 30 days.",
    "Log every call with the date, name, and reference number.",
    "Ask for any correction in writing.",
    "Check a corrected bill line by line when it arrives.",
    "If unresolved, use the appeal instructions on your insurer notice, ask the provider about financial assistance, and consider a qualified billing advocate or attorney for large amounts.",
  ];
}
