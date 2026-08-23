export type ProductFeatureFlags = Readonly<{
  singleAnalysis: boolean;
  newSubscriptions: boolean;
  existingSubscriptionSupport: boolean;
  billEobComparison: boolean;
  localComparisonWorksheet: boolean;
  localImageRedaction: boolean;
  privacySafeAggregates: boolean;
  fixedResultFeedback: boolean;
}>;

export type ProductConfig = Readonly<{
  productionOrigin: "https://medicalbillreader.com";
  displayPrices: Readonly<{
    singleAnalysis: "$4.99";
    billEobComparison: "$9.99";
  }>;
  freeAnalysis: Readonly<{
    limit: 1;
    scope: "browser";
    period: "UTC calendar month";
  }>;
  features: ProductFeatureFlags;
  anthropicModel: string;
  reviewDates: Readonly<{
    modelPricing: string;
    privacy: string;
    codeSetRights: string;
    methodology: string;
  }>;
}>;

type ProductEnvironment = Readonly<Record<string, string | undefined>>;

const featureDefaults: ProductFeatureFlags = Object.freeze({
  singleAnalysis: true,
  newSubscriptions: false,
  existingSubscriptionSupport: true,
  billEobComparison: false,
  localComparisonWorksheet: true,
  localImageRedaction: false,
  privacySafeAggregates: false,
  fixedResultFeedback: false,
});

/** Audited defaults. Environment overrides are applied by getProductConfig. */
export const productConfig: ProductConfig = Object.freeze({
  productionOrigin: "https://medicalbillreader.com",
  displayPrices: Object.freeze({
    singleAnalysis: "$4.99",
    billEobComparison: "$9.99",
  }),
  freeAnalysis: Object.freeze({
    limit: 1,
    scope: "browser",
    period: "UTC calendar month",
  }),
  features: featureDefaults,
  anthropicModel: "claude-sonnet-4-6",
  reviewDates: Object.freeze({
    modelPricing: "2026-08-23",
    privacy: "2026-08-23",
    codeSetRights: "2026-08-23",
    methodology: "2026-08-23",
  }),
});

export function parseBooleanFlag(
  name: string,
  rawValue: string | undefined,
  defaultValue: boolean,
): boolean {
  if (rawValue === undefined || rawValue.trim() === "") return defaultValue;
  if (rawValue === "true") return true;
  if (rawValue === "false") return false;
  throw new Error(`${name} must be exactly "true" or "false".`);
}

export function anthropicModel(env: ProductEnvironment = process.env): string {
  const configuredModel = env.ANTHROPIC_MODEL?.trim();
  return configuredModel || productConfig.anthropicModel;
}

export function getProductConfig(
  env: ProductEnvironment = process.env,
): ProductConfig {
  return Object.freeze({
    ...productConfig,
    features: Object.freeze({
      singleAnalysis: parseBooleanFlag(
        "ENABLE_SINGLE_ANALYSIS",
        env.ENABLE_SINGLE_ANALYSIS,
        featureDefaults.singleAnalysis,
      ),
      newSubscriptions: parseBooleanFlag(
        "ENABLE_NEW_SUBSCRIPTIONS",
        env.ENABLE_NEW_SUBSCRIPTIONS,
        featureDefaults.newSubscriptions,
      ),
      existingSubscriptionSupport: parseBooleanFlag(
        "ENABLE_EXISTING_SUBSCRIPTION_SUPPORT",
        env.ENABLE_EXISTING_SUBSCRIPTION_SUPPORT,
        featureDefaults.existingSubscriptionSupport,
      ),
      billEobComparison: parseBooleanFlag(
        "ENABLE_BILL_EOB_COMPARISON",
        env.ENABLE_BILL_EOB_COMPARISON,
        featureDefaults.billEobComparison,
      ),
      localComparisonWorksheet: parseBooleanFlag(
        "ENABLE_LOCAL_COMPARISON_WORKSHEET",
        env.ENABLE_LOCAL_COMPARISON_WORKSHEET,
        featureDefaults.localComparisonWorksheet,
      ),
      localImageRedaction: parseBooleanFlag(
        "ENABLE_LOCAL_IMAGE_REDACTION",
        env.ENABLE_LOCAL_IMAGE_REDACTION,
        featureDefaults.localImageRedaction,
      ),
      privacySafeAggregates: parseBooleanFlag(
        "ENABLE_PRIVACY_SAFE_AGGREGATES",
        env.ENABLE_PRIVACY_SAFE_AGGREGATES,
        featureDefaults.privacySafeAggregates,
      ),
      fixedResultFeedback: parseBooleanFlag(
        "ENABLE_FIXED_RESULT_FEEDBACK",
        env.ENABLE_FIXED_RESULT_FEEDBACK,
        featureDefaults.fixedResultFeedback,
      ),
    }),
    anthropicModel: anthropicModel(env),
  });
}
