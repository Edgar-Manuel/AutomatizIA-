import { describe, expect, it } from "vitest";
import { EMPTY_USAGE } from "@/lib/anthropic/pricing";
import { createUsageScope, recordUsage } from "@/lib/anthropic/usage";

const response = (input: number, output: number, read = 0, write = 0) => ({
  input_tokens: input,
  output_tokens: output,
  cache_read_input_tokens: read,
  cache_creation_input_tokens: write,
});

describe("usage scope", () => {
  it("collects a single model call", async () => {
    const scope = createUsageScope();
    await scope.run(async () => {
      recordUsage(response(100, 50, 10, 5));
    });
    expect(scope.usage()).toEqual({
      inputTokens: 100,
      outputTokens: 50,
      cacheReadTokens: 10,
      cacheWriteTokens: 5,
    });
  });

  it("adds up an agent that calls the model more than once", async () => {
    const scope = createUsageScope();
    await scope.run(async () => {
      recordUsage(response(100, 50));
      await Promise.resolve();
      recordUsage(response(200, 25));
    });
    expect(scope.usage().inputTokens).toBe(300);
    expect(scope.usage().outputTokens).toBe(75);
  });

  it("survives across await boundaries", async () => {
    const scope = createUsageScope();
    await scope.run(async () => {
      await new Promise((r) => setTimeout(r, 1));
      recordUsage(response(42, 7));
    });
    expect(scope.usage().inputTokens).toBe(42);
  });

  it("keeps the tokens burned before a failure", async () => {
    const scope = createUsageScope();
    await expect(
      scope.run(async () => {
        recordUsage(response(500, 300));
        throw new Error("model_output_schema_mismatch");
      }),
    ).rejects.toThrow("model_output_schema_mismatch");

    // The model answered and billed us even though the run failed.
    expect(scope.usage()).toEqual({
      inputTokens: 500,
      outputTokens: 300,
      cacheReadTokens: 0,
      cacheWriteTokens: 0,
    });
  });

  it("isolates concurrent executions from each other", async () => {
    const a = createUsageScope();
    const b = createUsageScope();
    await Promise.all([
      a.run(async () => {
        await new Promise((r) => setTimeout(r, 2));
        recordUsage(response(10, 10));
      }),
      b.run(async () => {
        recordUsage(response(999, 999));
      }),
    ]);
    expect(a.usage().inputTokens).toBe(10);
    expect(b.usage().inputTokens).toBe(999);
  });

  it("treats missing usage fields as zero", async () => {
    const scope = createUsageScope();
    await scope.run(async () => {
      recordUsage({ input_tokens: 5 });
      recordUsage({ output_tokens: null });
    });
    expect(scope.usage()).toEqual({ ...EMPTY_USAGE, inputTokens: 5 });
  });

  it("does nothing when an agent runs outside a scope", () => {
    expect(() => recordUsage(response(10, 10))).not.toThrow();
  });

  it("starts empty", () => {
    expect(createUsageScope().usage()).toEqual(EMPTY_USAGE);
  });
});
