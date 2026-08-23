import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  SensitiveRequestError,
  validateSensitiveJsonRequest,
} from "@/lib/sensitive-request";

const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

function sensitiveRequest(
  url = "https://medicalbillreader.com/api/analyze",
  headers: Record<string, string> = {},
) {
  return new Request(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      host: "medicalbillreader.com",
      origin: "https://medicalbillreader.com",
      ...headers,
    },
    body: "{}",
  });
}

describe("sensitive JSON request boundary", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://medicalbillreader.com";
  });

  afterEach(() => {
    if (originalSiteUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
  });

  it.each(["application/json", "application/json; charset=utf-8", "APPLICATION/JSON;CHARSET=UTF-8"])(
    "accepts exact same-origin JSON with content type %s",
    (contentType) => {
      expect(() =>
        validateSensitiveJsonRequest(
          sensitiveRequest(undefined, { "content-type": contentType }),
        ),
      ).not.toThrow();
    },
  );

  it.each([
    ["missing origin", { origin: "" }, 403],
    ["foreign origin", { origin: "https://attacker.example" }, 403],
    ["null origin", { origin: "null" }, 403],
    ["missing host", { host: "" }, 403],
    ["forged host", { host: "attacker.example" }, 403],
    ["form body", { "content-type": "application/x-www-form-urlencoded" }, 415],
    ["JSON profile", { "content-type": "application/json; profile=unsafe" }, 415],
  ])("rejects %s", (_label, headers, status) => {
    try {
      validateSensitiveJsonRequest(
        sensitiveRequest(undefined, headers as Record<string, string>),
      );
      throw new Error("expected rejection");
    } catch (error) {
      expect(error).toBeInstanceOf(SensitiveRequestError);
      expect((error as SensitiveRequestError).status).toBe(status);
    }
  });

  it("requires the request URL itself to use the configured origin", () => {
    expect(() =>
      validateSensitiveJsonRequest(
        sensitiveRequest("https://attacker.example/api/analyze"),
      ),
    ).toThrow(SensitiveRequestError);
  });

  it("supports an explicitly configured local origin without broadening it", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
    expect(() =>
      validateSensitiveJsonRequest(
        sensitiveRequest("http://localhost:3000/api/analyze", {
          host: "localhost:3000",
          origin: "http://localhost:3000",
        }),
      ),
    ).not.toThrow();
  });
});
