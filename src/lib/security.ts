import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const REJECTED_ENTITLEMENT_SECRETS = new Set([
  "use_at_least_32_random_characters",
  "your_entitlement_secret_here",
  "replace_with_at_least_32_random_characters",
  "test-secret-with-at-least-thirty-two-characters",
]);

export function securitySecret(): string {
  const secret = process.env.ENTITLEMENT_SECRET;
  const normalized = secret?.trim().toLowerCase();
  const obviousPlaceholder =
    !normalized ||
    REJECTED_ENTITLEMENT_SECRETS.has(normalized) ||
    /^(?:change-?me|example|placeholder|sample)(?:[-_ ].*)?$/.test(
      normalized,
    ) ||
    /^(.)\1{31,}$/.test(normalized);

  if (
    !secret ||
    secret !== secret.trim() ||
    secret.length < 32 ||
    obviousPlaceholder
  ) {
    throw new Error("ENTITLEMENT_SECRET is not securely configured");
  }
  return secret;
}

export function opaqueHash(value: string): string {
  return createHmac("sha256", securitySecret()).update(value).digest("hex");
}

export function signValue(value: string): string {
  const signature = createHmac("sha256", securitySecret())
    .update(value)
    .digest("base64url");
  return `${value}.${signature}`;
}

export function verifySignedValue(signed: string): string | null {
  const separator = signed.lastIndexOf(".");
  if (separator < 1) return null;
  const value = signed.slice(0, separator);
  const supplied = Buffer.from(signed.slice(separator + 1), "base64url");
  const expected = createHmac("sha256", securitySecret())
    .update(value)
    .digest();
  return supplied.length === expected.length && timingSafeEqual(supplied, expected)
    ? value
    : null;
}

export function randomToken(): string {
  return randomBytes(32).toString("base64url");
}

export function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

export function clientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

export function safeSecurityLog(event: string): void {
  console.error(`[security] ${event}`);
}
