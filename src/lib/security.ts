import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
export function securitySecret(): string { const secret = process.env.ENTITLEMENT_SECRET; if (!secret || secret.length < 32) throw new Error("ENTITLEMENT_SECRET is not configured"); return secret; }
export function opaqueHash(value: string): string { return createHmac("sha256", securitySecret()).update(value).digest("hex"); }
export function signValue(value: string): string { const signature = createHmac("sha256", securitySecret()).update(value).digest("base64url"); return `${value}.${signature}`; }
export function verifySignedValue(signed: string): string | null { const separator = signed.lastIndexOf("."); if (separator < 1) return null; const value = signed.slice(0, separator); const supplied = Buffer.from(signed.slice(separator + 1), "base64url"); const expected = createHmac("sha256", securitySecret()).update(value).digest(); return supplied.length === expected.length && timingSafeEqual(supplied, expected) ? value : null; }
export function randomToken(): string { return randomBytes(32).toString("base64url"); }
export function currentMonth(): string { return new Date().toISOString().slice(0, 7); }
export function clientIp(headers: Headers): string { return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown"; }
export function safeSecurityLog(event: string): void { console.error(`[security] ${event}`); }
