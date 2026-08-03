import { beforeEach, describe, expect, it, vi } from "vitest";
import { redisCommand, StoreUnavailableError } from "@/lib/redis";

describe("security store transport normalization", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.UPSTASH_REDIS_REST_URL = "https://redis.example.test";
    process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";
  });

  it("returns a valid store result", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ result: "OK" }), { status: 200 }),
    );

    await expect(redisCommand<string>(["PING"])).resolves.toBe("OK");
  });

  it.each([
    ["network failure", () => Promise.reject(new TypeError("fetch failed"))],
    ["invalid JSON", () => Promise.resolve(new Response("not json"))],
  ])("normalizes %s as StoreUnavailableError", async (_case, response) => {
    vi.spyOn(globalThis, "fetch").mockImplementation(response);

    await expect(redisCommand<string>(["GET", "key"])).rejects.toBeInstanceOf(
      StoreUnavailableError,
    );
  });
});
