import { safeSecurityLog } from "./security";
export const ANALYSIS_MODEL = "claude-sonnet-4-6";
export const MAX_OUTPUT_TOKENS = 2000;
export const MAX_PDF_PAGES = 10;
export const MAX_IMAGES = 10;
export const MAX_PDF_TEXT_CHARACTERS = 120_000;
export const MAX_IMAGE_DIMENSION = 1024;
export const INPUT_USD_PER_MILLION = 3;
export const OUTPUT_USD_PER_MILLION = 15;
// Planning only, NOT a token or cost ceiling. Anthropic describes typically
// 1500–3000 TEXT tokens/PDF page, plus image tokens. A short bill may cost
// ~$0.02–0.05; a heavy bill ~$0.10–0.15 or more, including up to $0.03 output.
// Dense/atypical PDFs can exceed this. chars/4 is a heuristic, not measurement.
// A 1024-square photo is estimated at 1369 visual tokens (37 x 37
// patches of 28 pixels per the current vision docs); resizing
// bounds photo dimensions, preserves aspect ratio, strips metadata, but can
// reduce tiny-text legibility. PDF page images are processed by Anthropic.
// Sources checked 2026-10-16: platform.claude.com/docs/en/{about-claude/pricing,
// build-with-claude/pdf-support,build-with-claude/vision}. No extended thinking.
export const PLANNING_TEXT_TOKENS_PER_PDF_PAGE = 3000;
export function costAlertThreshold(): number {
  const configured = Number(process.env.COST_ALERT_THRESHOLD_USD ?? "1.00");
  return Number.isFinite(configured) && configured > 0 ? configured : 1;
}
export function recordAnalysisUsage(response: unknown): void {
  const obj = response && typeof response === "object" ? response as Record<string, unknown> : null;
  const u = obj?.usage && typeof obj.usage === "object" ? obj.usage as Record<string, unknown> : null;
  const valid = (n: unknown): n is number => Number.isSafeInteger(n) && Number(n) >= 0;
  if (!u || !valid(u.input_tokens) || !valid(u.output_tokens)) {
    safeSecurityLog('analysis_usage_unavailable'); return;
  }
  const cacheRead = u.cache_read_input_tokens ?? 0;
  const cacheWrite = u.cache_creation_input_tokens ?? 0;
  if (!valid(cacheRead) || !valid(cacheWrite) || (obj?.model !== undefined && obj.model !== ANALYSIS_MODEL)) {
    safeSecurityLog('analysis_usage_pricing_unknown'); return;
  }
  // No cache controls are requested. If unexpected cache writes appear, do
  // not silently underprice their unknown TTL or claim a measured dollar cost.
  const usd = cacheWrite === 0 ? (u.input_tokens * INPUT_USD_PER_MILLION + cacheRead * INPUT_USD_PER_MILLION * 0.1 + u.output_tokens * OUTPUT_USD_PER_MILLION) / 1_000_000 : null;
  const base = { model: ANALYSIS_MODEL, input_tokens: u.input_tokens, output_tokens: u.output_tokens, cache_read_input_tokens: cacheRead, cache_creation_input_tokens: cacheWrite, computed_usd: usd };
  safeSecurityLog(JSON.stringify({ event: "analysis_usage", ...base }));
  if (usd === null) safeSecurityLog('analysis_usage_pricing_unknown');
  else if (usd > costAlertThreshold()) safeSecurityLog(JSON.stringify({ event: "analysis_cost_anomaly", severity: "high", ...base }));
}
