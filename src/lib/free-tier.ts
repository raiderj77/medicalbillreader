const FREE_TIER_KEY = "medical_bill_reader_usage";
const FREE_TIER_LIMIT = 1;

interface UsageData {
  count: number;
  month: string;
}

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function getUsage(): UsageData {
  if (typeof window === "undefined") {
    return { count: 0, month: getCurrentMonth() };
  }

  try {
    const stored = localStorage.getItem(FREE_TIER_KEY);
    if (!stored) {
      return { count: 0, month: getCurrentMonth() };
    }

    const data: UsageData = JSON.parse(stored);
    if (data.month !== getCurrentMonth()) {
      return { count: 0, month: getCurrentMonth() };
    }

    return data;
  } catch {
    return { count: 0, month: getCurrentMonth() };
  }
}

export function canUseFreeTier(): boolean {
  const usage = getUsage();
  return usage.count < FREE_TIER_LIMIT;
}

export function incrementUsage(): void {
  if (typeof window === "undefined") return;

  const usage = getUsage();
  const newUsage: UsageData = {
    count: usage.count + 1,
    month: getCurrentMonth(),
  };

  localStorage.setItem(FREE_TIER_KEY, JSON.stringify(newUsage));
}

export function getRemainingFreeUses(): number {
  const usage = getUsage();
  return Math.max(0, FREE_TIER_LIMIT - usage.count);
}
