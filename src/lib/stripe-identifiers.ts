export type StripeIdPrefix =
  | "ch_"
  | "cs_"
  | "in_"
  | "pi_"
  | "price_"
  | "sub_";

export function isStripeId(value: string, prefix: StripeIdPrefix): boolean {
  return (
    value.length <= 255 &&
    value.startsWith(prefix) &&
    /^[A-Za-z0-9_]+$/.test(value)
  );
}
