import { afterEach, describe, expect, it } from "vitest";
import { securitySecret } from "@/lib/security";

const VALID_TEST_SECRET =
  "4f9f498bc2f23a7dd8971817377672bd83bde9d14d526c46";

describe("security secret validation", () => {
  afterEach(() => {
    process.env.ENTITLEMENT_SECRET = VALID_TEST_SECRET;
  });

  it.each([
    undefined,
    "short",
    "use_at_least_32_random_characters",
    "your_entitlement_secret_here",
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  ])("rejects missing, weak, or public placeholder secrets", (secret) => {
    if (secret === undefined) delete process.env.ENTITLEMENT_SECRET;
    else process.env.ENTITLEMENT_SECRET = secret;

    expect(() => securitySecret()).toThrow(
      "ENTITLEMENT_SECRET is not securely configured",
    );
  });

  it("accepts a sufficiently long non-placeholder secret", () => {
    process.env.ENTITLEMENT_SECRET = VALID_TEST_SECRET;
    expect(securitySecret()).toBe(VALID_TEST_SECRET);
  });
});
