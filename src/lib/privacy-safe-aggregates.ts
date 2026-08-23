import { estimateModelCostUsd } from "@/config/model-pricing";
import { redisCommand } from "@/lib/redis";

const AGGREGATE_TTL_SECONDS = 60 * 60 * 24 * 400;
const INCREMENT_DAILY_AGGREGATE = `redis.call('HSETNX',KEYS[1],'dateBucket',ARGV[1]) redis.call('HSETNX',KEYS[1],'modelId',ARGV[2]) redis.call('HINCRBY',KEYS[1],'singleDocumentSuccessCount',ARGV[3]) redis.call('HINCRBY',KEYS[1],'comparisonSuccessCount',ARGV[4]) redis.call('HINCRBY',KEYS[1],'providerFailureCount',ARGV[5]) redis.call('HINCRBY',KEYS[1],'validationFailureCount',ARGV[6]) redis.call('HINCRBY',KEYS[1],'inputTokenTotal',ARGV[7]) redis.call('HINCRBY',KEYS[1],'outputTokenTotal',ARGV[8]) redis.call('HINCRBYFLOAT',KEYS[1],'estimatedModelCostUsd',ARGV[9]) redis.call('HINCRBY',KEYS[1],'paidCreditSuccessCount',ARGV[10]) redis.call('HINCRBY',KEYS[1],'freeCreditSuccessCount',ARGV[11]) redis.call('EXPIRE',KEYS[1],ARGV[12]) return 1`;

export const DAILY_AGGREGATE_KEYS = [
  "dateBucket",
  "modelId",
  "singleDocumentSuccessCount",
  "comparisonSuccessCount",
  "providerFailureCount",
  "validationFailureCount",
  "inputTokenTotal",
  "outputTokenTotal",
  "estimatedModelCostUsd",
  "paidCreditSuccessCount",
  "freeCreditSuccessCount",
] as const;

export interface PrivacySafeDailyAggregate {
  dateBucket: string;
  modelId: string;
  singleDocumentSuccessCount: number;
  comparisonSuccessCount: number;
  providerFailureCount: number;
  validationFailureCount: number;
  inputTokenTotal: number;
  outputTokenTotal: number;
  estimatedModelCostUsd: number;
  paidCreditSuccessCount: number;
  freeCreditSuccessCount: number;
}

export type PrivacySafeAggregateEvent =
  | Readonly<{
      type: "single_document_success";
      credit: "paid" | "free";
      inputTokens: number;
      outputTokens: number;
    }>
  | Readonly<{
      type: "comparison_success";
      credit: "paid";
      inputTokens: number;
      outputTokens: number;
    }>
  | Readonly<{ type: "provider_failure" | "validation_failure" }>;

export function createEmptyDailyAggregate(
  dateBucket: string,
  modelId: string,
): PrivacySafeDailyAggregate {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateBucket)) {
    throw new Error("Aggregate date must be a UTC day bucket");
  }
  if (!/^[a-z0-9._-]{1,80}$/i.test(modelId)) {
    throw new Error("Aggregate model ID is invalid");
  }
  return {
    dateBucket,
    modelId,
    singleDocumentSuccessCount: 0,
    comparisonSuccessCount: 0,
    providerFailureCount: 0,
    validationFailureCount: 0,
    inputTokenTotal: 0,
    outputTokenTotal: 0,
    estimatedModelCostUsd: 0,
    paidCreditSuccessCount: 0,
    freeCreditSuccessCount: 0,
  };
}

export function addAnonymousUsage(
  aggregate: PrivacySafeDailyAggregate,
  inputTokens: number,
  outputTokens: number,
): PrivacySafeDailyAggregate {
  const cost = estimateModelCostUsd(aggregate.modelId, inputTokens, outputTokens);
  if (cost === null) throw new Error("Model usage cannot be safely aggregated");
  return {
    ...aggregate,
    inputTokenTotal: aggregate.inputTokenTotal + inputTokens,
    outputTokenTotal: aggregate.outputTokenTotal + outputTokens,
    estimatedModelCostUsd: aggregate.estimatedModelCostUsd + cost,
  };
}

export function isPrivacySafeDailyAggregate(
  value: unknown,
): value is PrivacySafeDailyAggregate {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  if (
    Object.keys(record).length !== DAILY_AGGREGATE_KEYS.length ||
    Object.keys(record).some(
      (key) => !(DAILY_AGGREGATE_KEYS as readonly string[]).includes(key),
    )
  ) {
    return false;
  }
  if (
    typeof record.dateBucket !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(record.dateBucket) ||
    typeof record.modelId !== "string" ||
    !/^[a-z0-9._-]{1,80}$/i.test(record.modelId)
  ) {
    return false;
  }
  return DAILY_AGGREGATE_KEYS.slice(2).every(
    (key) =>
      typeof record[key] === "number" &&
      Number.isFinite(record[key]) &&
      (key === "estimatedModelCostUsd" || Number.isSafeInteger(record[key])) &&
      record[key] >= 0,
  );
}

/**
 * Writes one anonymous UTC-day/model bucket. Callers can pass only a fixed event
 * union; there is no field for request time, IP, cookie, entitlement, document,
 * report, provider, code, amount, filename, or free text.
 */
export async function recordPrivacySafeDailyEvent(
  enabled: boolean,
  modelId: string,
  event: PrivacySafeAggregateEvent,
  now = new Date(),
): Promise<boolean> {
  if (!enabled) return false;
  const dateBucket = now.toISOString().slice(0, 10);
  const aggregate = createEmptyDailyAggregate(dateBucket, modelId);

  if (event.type === "single_document_success" || event.type === "comparison_success") {
    const withUsage = addAnonymousUsage(
      aggregate,
      event.inputTokens,
      event.outputTokens,
    );
    aggregate.inputTokenTotal = withUsage.inputTokenTotal;
    aggregate.outputTokenTotal = withUsage.outputTokenTotal;
    aggregate.estimatedModelCostUsd = withUsage.estimatedModelCostUsd;
    if (event.type === "single_document_success")
      aggregate.singleDocumentSuccessCount = 1;
    else aggregate.comparisonSuccessCount = 1;
    if (event.credit === "paid") aggregate.paidCreditSuccessCount = 1;
    else aggregate.freeCreditSuccessCount = 1;
  } else if (event.type === "provider_failure") {
    aggregate.providerFailureCount = 1;
  } else {
    aggregate.validationFailureCount = 1;
  }

  const key = `mbr:aggregate:v1:${dateBucket}:${modelId}`;
  await redisCommand<number>([
    "EVAL",
    INCREMENT_DAILY_AGGREGATE,
    1,
    key,
    aggregate.dateBucket,
    aggregate.modelId,
    aggregate.singleDocumentSuccessCount,
    aggregate.comparisonSuccessCount,
    aggregate.providerFailureCount,
    aggregate.validationFailureCount,
    aggregate.inputTokenTotal,
    aggregate.outputTokenTotal,
    aggregate.estimatedModelCostUsd,
    aggregate.paidCreditSuccessCount,
    aggregate.freeCreditSuccessCount,
    AGGREGATE_TTL_SECONDS,
  ]);
  return true;
}
