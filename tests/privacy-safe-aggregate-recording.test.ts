import { beforeEach, describe, expect, it, vi } from "vitest";

const store = vi.hoisted(() => ({ command: vi.fn().mockResolvedValue(1) }));
vi.mock("@/lib/redis", () => ({ redisCommand: store.command }));

import { recordPrivacySafeDailyEvent } from "@/lib/privacy-safe-aggregates";

describe("privacy-safe daily aggregate writer", () => {
  beforeEach(() => store.command.mockClear());

  it("does nothing while the feature is disabled", async () => {
    expect(
      await recordPrivacySafeDailyEvent(
        false,
        "claude-sonnet-4-6",
        {
          type: "single_document_success",
          credit: "paid",
          inputTokens: 100,
          outputTokens: 20,
        },
        new Date("2026-08-23T23:59:59Z"),
      ),
    ).toBe(false);
    expect(store.command).not.toHaveBeenCalled();
  });

  it("writes only a UTC day, reviewed model, fixed counters, totals, cost, and TTL", async () => {
    expect(
      await recordPrivacySafeDailyEvent(
        true,
        "claude-sonnet-4-6",
        {
          type: "single_document_success",
          credit: "free",
          inputTokens: 100,
          outputTokens: 20,
        },
        new Date("2026-08-23T23:59:59Z"),
      ),
    ).toBe(true);
    const command = store.command.mock.calls[0][0] as Array<string | number>;
    expect(command[0]).toBe("EVAL");
    expect(command[3]).toBe("mbr:aggregate:v1:2026-08-23:claude-sonnet-4-6");
    expect(command.slice(4)).toEqual([
      "2026-08-23",
      "claude-sonnet-4-6",
      1,
      0,
      0,
      0,
      100,
      20,
      0.0006,
      0,
      1,
      34_560_000,
    ]);
    expect(JSON.stringify(command)).not.toMatch(
      /exactTimestamp|filename|reportText|providerName|insurerName|cookieValue|entitlementId|stripeId|emailAddress|ipAddress/i,
    );
  });
});
