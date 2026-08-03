import { readJsonResponse } from "./read-json-response";

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export type AnalysisRequestPayload = {
  image: string;
  fileType: string;
  processingAcknowledged: boolean;
};

type AnalysisResponseData = {
  error?: string;
  result?: string;
};

type AnalysisAccessResult = {
  response: Response;
  data: Partial<AnalysisResponseData>;
  freeAccessError?: string;
};

const DEFAULT_FREE_ACCESS_ERROR = "Free analysis access is unavailable.";

async function issueFreeAccess(fetcher: FetchLike): Promise<string | undefined> {
  try {
    const response = await fetcher("/api/entitlement/free", { method: "POST" });
    if (response.ok) return undefined;

    const data = await readJsonResponse<{ error?: string }>(response);
    return data.error || DEFAULT_FREE_ACCESS_ERROR;
  } catch {
    return DEFAULT_FREE_ACCESS_ERROR;
  }
}

async function requestAnalysis(
  fetcher: FetchLike,
  payload: AnalysisRequestPayload,
): Promise<Omit<AnalysisAccessResult, "freeAccessError">> {
  const response = await fetcher("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await readJsonResponse<AnalysisResponseData>(response);
  return { response, data };
}

/**
 * Keeps free-tier issuance from blocking a valid paid entitlement. A readable
 * paid-access cookie is only a UX hint; the analyze route remains the sole
 * authority and verifies the HttpOnly Stripe identifiers on every request.
 */
export async function requestAnalysisWithAccessFallback(
  fetcher: FetchLike,
  payload: AnalysisRequestPayload,
  hasPaidAccessHint: boolean,
): Promise<AnalysisAccessResult> {
  let freeAccessError: string | undefined;

  // Most free and returning pay-per-use visitors do not have a readable paid
  // hint. Issue free access opportunistically, but continue to the authoritative
  // analyze route if issuance is rate-limited or temporarily unavailable.
  if (!hasPaidAccessHint) {
    freeAccessError = await issueFreeAccess(fetcher);
  }

  let analysis = await requestAnalysis(fetcher, payload);

  // A subscription hint can outlive the subscription. If server verification
  // rejects it, issue free access and retry once so an eligible former
  // subscriber is not incorrectly forced to purchase another analysis.
  if (analysis.response.status === 401 && hasPaidAccessHint) {
    freeAccessError = await issueFreeAccess(fetcher);
    if (!freeAccessError) {
      analysis = await requestAnalysis(fetcher, payload);
    }
  }

  return { ...analysis, freeAccessError };
}
