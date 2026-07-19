import { describe, expect, it } from "vitest";
import { readJsonResponse } from "@/lib/read-json-response";

describe("readJsonResponse", () => {
  it("returns a JSON object when the response is valid JSON", async () => {
    const response = Response.json({ error: "Provider unavailable" }, { status: 502 });
    expect(await readJsonResponse<{ error?: string }>(response)).toEqual({
      error: "Provider unavailable",
    });
  });

  it("does not expose a platform HTML or text error as a JSON parsing failure", async () => {
    const response = new Response("An error occurred with your deployment", {
      status: 504,
      headers: { "content-type": "text/plain" },
    });
    expect(await readJsonResponse<{ error?: string }>(response)).toEqual({});
  });

  it("handles malformed JSON without throwing", async () => {
    const response = new Response("{", {
      status: 502,
      headers: { "content-type": "application/json" },
    });
    expect(await readJsonResponse<{ error?: string }>(response)).toEqual({});
  });
});
