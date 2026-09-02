import { describe, expect, it } from "vitest";
import { agentModel } from "@/db/schema";
import {
  computeCostUsdMicros,
  EMPTY_USAGE,
  formatUsdMicros,
  MODEL_PRICING,
  totalTokens,
} from "@/lib/anthropic/pricing";

describe("MODEL_PRICING", () => {
  it("covers every model the schema allows", () => {
    for (const model of agentModel.enumValues) {
      expect(MODEL_PRICING[model]).toBeDefined();
    }
    expect(Object.keys(MODEL_PRICING)).toHaveLength(agentModel.enumValues.length);
  });

  it("prices cache writes at 1.25x and cache reads at 0.1x the input rate", () => {
    for (const rate of Object.values(MODEL_PRICING)) {
      expect(rate.cacheWrite).toBeCloseTo(rate.input * 1.25, 6);
      expect(rate.cacheRead).toBeCloseTo(rate.input * 0.1, 6);
    }
  });

  it("keeps output more expensive than input on every model", () => {
    for (const rate of Object.values(MODEL_PRICING)) {
      expect(rate.output).toBeGreaterThan(rate.input);
    }
  });
});

describe("computeCostUsdMicros", () => {
  it("is zero for an execution that never called the model", () => {
    expect(computeCostUsdMicros("sonnet-4.6", EMPTY_USAGE)).toBe(0);
  });

  it("bills a plain sonnet call at list price", () => {
    // 2000 input at $3/MTok = $0.006, 1500 output at $15/MTok = $0.0225.
    const cost = computeCostUsdMicros("sonnet-4.6", {
      inputTokens: 2000,
      outputTokens: 1500,
      cacheReadTokens: 0,
      cacheWriteTokens: 0,
    });
    expect(cost).toBe(28_500);
    expect(formatUsdMicros(cost)).toBe("$0.0285");
  });

  it("charges cached reads at a tenth of fresh input", () => {
    const usage = {
      inputTokens: 0,
      outputTokens: 0,
      cacheReadTokens: 10_000,
      cacheWriteTokens: 0,
    };
    const fresh = computeCostUsdMicros("sonnet-4.6", {
      ...usage,
      inputTokens: 10_000,
      cacheReadTokens: 0,
    });
    expect(computeCostUsdMicros("sonnet-4.6", usage) * 10).toBe(fresh);
  });

  it("charges the cache write premium", () => {
    const write = computeCostUsdMicros("sonnet-4.6", {
      inputTokens: 0,
      outputTokens: 0,
      cacheReadTokens: 0,
      cacheWriteTokens: 4000,
    });
    expect(write).toBe(15_000); // 4000 * 3.75
  });

  it("scales with the model tier", () => {
    const usage = {
      inputTokens: 1000,
      outputTokens: 1000,
      cacheReadTokens: 0,
      cacheWriteTokens: 0,
    };
    const haiku = computeCostUsdMicros("haiku-4.5", usage);
    const sonnet = computeCostUsdMicros("sonnet-4.6", usage);
    const opus = computeCostUsdMicros("opus-4.7", usage);
    expect(haiku).toBeLessThan(sonnet);
    expect(sonnet).toBeLessThan(opus);
    expect(haiku).toBe(6000);
    expect(opus).toBe(30_000);
  });

  it("returns whole micro dollars so nothing fractional is persisted", () => {
    const cost = computeCostUsdMicros("sonnet-4.6", {
      inputTokens: 1,
      outputTokens: 1,
      cacheReadTokens: 7,
      cacheWriteTokens: 3,
    });
    expect(Number.isInteger(cost)).toBe(true);
  });
});

describe("totalTokens", () => {
  it("adds every billed bucket", () => {
    expect(
      totalTokens({
        inputTokens: 1,
        outputTokens: 2,
        cacheReadTokens: 4,
        cacheWriteTokens: 8,
      }),
    ).toBe(15);
  });
});
