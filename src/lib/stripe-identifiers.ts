export function isStripeId(value: string, prefix: "cs_" | "sub_"): boolean {
  return (
    value.length <= 255 &&
    value.startsWith(prefix) &&
    /^[A-Za-z0-9_]+$/.test(value)
  );
}
