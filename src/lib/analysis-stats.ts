type Stats = {
  startedAt: string;
  totalAnalyses: number;
  byFileType: Record<string, number>;
  codeMentions: Record<string, number>;
  issuesFlaggedCount: number;
};

const globalForStats = globalThis as unknown as { __mbrStats?: Stats };

function getStore(): Stats {
  if (!globalForStats.__mbrStats) {
    globalForStats.__mbrStats = {
      startedAt: new Date().toISOString(),
      totalAnalyses: 0,
      byFileType: {},
      codeMentions: {},
      issuesFlaggedCount: 0,
    };
  }
  return globalForStats.__mbrStats;
}

const CODE_PATTERNS: { key: string; regex: RegExp }[] = [
  { key: "CPT", regex: /\bCPT\b/i },
  { key: "HCPCS", regex: /\bHCPCS\b/i },
  { key: "ICD-10", regex: /\bICD[- ]?10\b/i },
  { key: "NDC", regex: /\bNDC\b/i },
  { key: "DRG", regex: /\bDRG\b/i },
  { key: "Modifier", regex: /\bmodifier\b/i },
  { key: "Revenue code", regex: /\brevenue code\b/i },
];

const ISSUES_HEADING = /##\s*[^\n]*Potential Issues to Review/i;
const ISSUES_NONE = /(no (obvious |apparent )?issues|nothing (that )?stands out|did not (find|identify) any|none (identified|found|apparent))/i;

export function recordAnalysis(input: {
  fileType: string;
  resultText: string;
}): void {
  try {
    const s = getStore();
    s.totalAnalyses += 1;
    const ft = (input.fileType || "unknown").toLowerCase();
    s.byFileType[ft] = (s.byFileType[ft] || 0) + 1;

    const text = input.resultText || "";
    for (const { key, regex } of CODE_PATTERNS) {
      if (regex.test(text)) {
        s.codeMentions[key] = (s.codeMentions[key] || 0) + 1;
      }
    }

    const issuesMatch = text.match(ISSUES_HEADING);
    if (issuesMatch) {
      const after = text.slice(issuesMatch.index! + issuesMatch[0].length, issuesMatch.index! + issuesMatch[0].length + 600);
      if (!ISSUES_NONE.test(after) && after.trim().length > 40) {
        s.issuesFlaggedCount += 1;
      }
    }
  } catch {
    // Stats are best-effort. Never break the analyze path.
  }
}

export type StatsSnapshot = {
  startedAt: string;
  totalAnalyses: number;
  byFileType: { fileType: string; count: number; percent: number }[];
  codeMentions: { code: string; count: number; percent: number }[];
  issuesFlaggedCount: number;
  issuesFlaggedPercent: number;
};

export function getStatsSnapshot(): StatsSnapshot {
  const s = getStore();
  const total = s.totalAnalyses;
  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  const byFileType = Object.entries(s.byFileType)
    .map(([fileType, count]) => ({ fileType, count, percent: pct(count) }))
    .sort((a, b) => b.count - a.count);

  const codeMentions = Object.entries(s.codeMentions)
    .map(([code, count]) => ({ code, count, percent: pct(count) }))
    .sort((a, b) => b.count - a.count);

  return {
    startedAt: s.startedAt,
    totalAnalyses: total,
    byFileType,
    codeMentions,
    issuesFlaggedCount: s.issuesFlaggedCount,
    issuesFlaggedPercent: pct(s.issuesFlaggedCount),
  };
}
