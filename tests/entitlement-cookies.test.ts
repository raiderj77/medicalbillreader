import { describe, expect, it } from "vitest";
import {
  PAY_PER_USE_COOKIE_MAX_AGE,
  SUBSCRIPTION_COOKIE_MAX_AGE,
} from "@/lib/entitlement-cookies";

describe("browser-bound entitlement windows", () => {
  it("keeps single-use access available for one day", () => {
    expect(PAY_PER_USE_COOKIE_MAX_AGE).toBe(86_400);
  });

  it("uses the browser maximum-style long-lived subscription window", () => {
    expect(SUBSCRIPTION_COOKIE_MAX_AGE).toBe(34_560_000);
  });
});
