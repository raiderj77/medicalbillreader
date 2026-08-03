import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
} from "node:crypto";
import type { NextRequest } from "next/server";
import { redisCommand } from "./redis";
import {
  opaqueHash,
  randomToken,
  securitySecret,
  signValue,
  verifySignedValue,
} from "./security";
import type { PurchaseType } from "./stripe";
import { isStripeId } from "./stripe-identifiers";

const BROWSER_BINDING_PREFIX = "mbr-browser:v1:";
// Stripe Checkout Sessions remain open for up to 24 hours by default. Keep a
// one-hour confirmation buffer so a payment completed near that boundary can
// still return to the originating browser without losing access.
const CHECKOUT_NONCE_TTL_SECONDS = 60 * 60 * 25;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const HASH_PATTERN = /^[a-f0-9]{64}$/;
const COMPLETE_NONCE_SCRIPT = `local value=redis.call('GET',KEYS[1]) if not value then return 0 end if value==ARGV[1] then redis.call('SET',KEYS[1],ARGV[2],'KEEPTTL') return 1 end if value==ARGV[2] then return 2 end return 0`;

export const BROWSER_BINDING_COOKIE = "mbr_browser_binding";

type StripeAccessKind = "per-use" | "subscription";

type SealedAccessPayload = {
  v: 1;
  stripeId: string;
  expiresAt: number;
};

function accessKey(): Buffer {
  return createHmac("sha256", securitySecret())
    .update("medicalbillreader:stripe-browser-access:v1")
    .digest();
}

function accessAad(kind: StripeAccessKind, browserBinding: string): Buffer {
  return Buffer.from(
    `medicalbillreader:stripe-browser-access:v1:${kind}:${browserBinding}`,
    "utf8",
  );
}

function validBrowserBinding(value: string): boolean {
  return TOKEN_PATTERN.test(value);
}

export function createBrowserBinding(): {
  binding: string;
  cookieValue: string;
} {
  const binding = randomToken();
  return {
    binding,
    cookieValue: browserBindingCookieValue(binding),
  };
}

export function browserBindingCookieValue(browserBinding: string): string {
  if (!validBrowserBinding(browserBinding)) {
    throw new Error("Invalid browser binding");
  }
  return signValue(`${BROWSER_BINDING_PREFIX}${browserBinding}`);
}

export function browserBindingFromRequest(
  request: NextRequest,
): string | null {
  const cookie = request.cookies.get(BROWSER_BINDING_COOKIE)?.value;
  if (!cookie) return null;

  const value = verifySignedValue(cookie);
  if (!value?.startsWith(BROWSER_BINDING_PREFIX)) return null;

  const binding = value.slice(BROWSER_BINDING_PREFIX.length);
  return validBrowserBinding(binding) ? binding : null;
}

export function checkoutNonceHash(nonce: string): string {
  if (!TOKEN_PATTERN.test(nonce)) throw new Error("Invalid checkout nonce");
  return opaqueHash(nonce);
}

export async function createCheckoutNonce(
  browserBinding: string,
  purchaseType: PurchaseType,
): Promise<string> {
  if (!validBrowserBinding(browserBinding)) {
    throw new Error("Invalid browser binding");
  }

  const value = pendingCheckoutNonceValue(browserBinding, purchaseType);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const nonce = randomToken();
    const accepted = await redisCommand<string | null>([
      "SET",
      `mbr:checkout:nonce:${checkoutNonceHash(nonce)}`,
      value,
      "NX",
      "EX",
      CHECKOUT_NONCE_TTL_SECONDS,
    ]);
    if (accepted === "OK") return nonce;
  }

  throw new Error("Could not allocate checkout nonce");
}

export async function discardCheckoutNonce(nonce: string): Promise<void> {
  if (!TOKEN_PATTERN.test(nonce)) return;
  await redisCommand<number>([
    "DEL",
    `mbr:checkout:nonce:${checkoutNonceHash(nonce)}`,
  ]);
}

function pendingCheckoutNonceValue(
  browserBinding: string,
  purchaseType: PurchaseType,
): string {
  return `v1:${opaqueHash(browserBinding)}:${purchaseType}`;
}

function completedCheckoutNonceValue(
  browserBinding: string,
  sessionId: string,
  purchaseType: PurchaseType,
): string {
  return `v1:${opaqueHash(browserBinding)}:completed:${purchaseType}:${opaqueHash(sessionId)}`;
}

export async function completeCheckoutNonce(
  nonce: string,
  browserBinding: string,
  sessionId: string,
  purchaseType: PurchaseType,
): Promise<boolean> {
  if (
    !TOKEN_PATTERN.test(nonce) ||
    !validBrowserBinding(browserBinding) ||
    !isStripeId(sessionId, "cs_")
  ) {
    return false;
  }

  const pendingValue = pendingCheckoutNonceValue(
    browserBinding,
    purchaseType,
  );
  const completedValue = completedCheckoutNonceValue(
    browserBinding,
    sessionId,
    purchaseType,
  );
  const result = await redisCommand<number>([
    "EVAL",
    COMPLETE_NONCE_SCRIPT,
    1,
    `mbr:checkout:nonce:${checkoutNonceHash(nonce)}`,
    pendingValue,
    completedValue,
  ]);
  return result === 1 || result === 2;
}

export async function checkoutNoncePurchaseType(
  nonce: string,
  browserBinding: string,
  sessionId: string,
): Promise<PurchaseType | null> {
  if (
    !TOKEN_PATTERN.test(nonce) ||
    !validBrowserBinding(browserBinding) ||
    !isStripeId(sessionId, "cs_")
  ) {
    return null;
  }

  const value = await redisCommand<string | null>([
    "GET",
    `mbr:checkout:nonce:${checkoutNonceHash(nonce)}`,
  ]);
  if (typeof value !== "string") return null;

  for (const purchaseType of ["per-use", "subscription"] as const) {
    if (
      value === pendingCheckoutNonceValue(browserBinding, purchaseType) ||
      value ===
        completedCheckoutNonceValue(browserBinding, sessionId, purchaseType)
    ) {
      return purchaseType;
    }
  }
  return null;
}

export function sealStripeAccess(
  kind: StripeAccessKind,
  stripeId: string,
  browserBinding: string,
  maxAgeSeconds: number,
): string {
  const expectedPrefix = kind === "per-use" ? "cs_" : "sub_";
  if (
    !isStripeId(stripeId, expectedPrefix) ||
    !validBrowserBinding(browserBinding) ||
    !Number.isSafeInteger(maxAgeSeconds) ||
    maxAgeSeconds <= 0
  ) {
    throw new Error("Invalid Stripe browser access payload");
  }

  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", accessKey(), iv);
  cipher.setAAD(accessAad(kind, browserBinding));
  const payload: SealedAccessPayload = {
    v: 1,
    stripeId,
    expiresAt: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [iv, ciphertext, tag].map((part) => part.toString("base64url")).join(".");
}

export function openStripeAccess(
  token: string,
  kind: StripeAccessKind,
  browserBinding: string,
): string | null {
  if (!validBrowserBinding(browserBinding) || token.length > 1_024) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const [ivPart, ciphertextPart, tagPart] = parts;
    const iv = Buffer.from(ivPart, "base64url");
    const ciphertext = Buffer.from(ciphertextPart, "base64url");
    const tag = Buffer.from(tagPart, "base64url");
    if (
      iv.toString("base64url") !== ivPart ||
      ciphertext.toString("base64url") !== ciphertextPart ||
      tag.toString("base64url") !== tagPart ||
      iv.length !== 12 ||
      tag.length !== 16 ||
      ciphertext.length === 0
    ) {
      return null;
    }

    const decipher = createDecipheriv("aes-256-gcm", accessKey(), iv);
    decipher.setAAD(accessAad(kind, browserBinding));
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]).toString("utf8");
    const payload = JSON.parse(plaintext) as Partial<SealedAccessPayload>;
    const expectedPrefix = kind === "per-use" ? "cs_" : "sub_";

    if (
      payload.v !== 1 ||
      typeof payload.stripeId !== "string" ||
      !isStripeId(payload.stripeId, expectedPrefix) ||
      typeof payload.expiresAt !== "number" ||
      !Number.isSafeInteger(payload.expiresAt) ||
      payload.expiresAt <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return payload.stripeId;
  } catch {
    return null;
  }
}

export function validCheckoutNonceHash(value: string): boolean {
  return HASH_PATTERN.test(value);
}

export function validCheckoutNonce(value: string): boolean {
  return TOKEN_PATTERN.test(value);
}
