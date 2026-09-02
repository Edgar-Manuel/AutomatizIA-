import type { AgentModel } from "@/db/schema";

/**
 * Token usage of one execution, already normalised to our own field names.
 * The four buckets are billed at different rates, so they stay separate all
 * the way to the database.
 */
export type TokenUsage = {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
};

export const EMPTY_USAGE: TokenUsage = {
  inputTokens: 0,
  outputTokens: 0,
  cacheReadTokens: 0,
  cacheWriteTokens: 0,
};

export type ModelRate = {
  /** USD per million input tokens. */
  input: number;
  /** USD per million output tokens. */
  output: number;
  /** USD per million tokens written to the cache (1.25x input). */
  cacheWrite: number;
  /** USD per million tokens served from the cache (0.1x input). */
  cacheRead: number;
};

/**
 * Anthropic first-party list prices, USD per million tokens.
 * Cache multipliers are the standard 5 minute TTL ones: writes cost 1.25x
 * the input rate, reads 0.1x.
 */
export const MODEL_PRICING: Record<AgentModel, ModelRate> = {
  "haiku-4.5": { input: 1, output: 5, cacheWrite: 1.25, cacheRead: 0.1 },
  "sonnet-4.6": { input: 3, output: 15, cacheWrite: 3.75, cacheRead: 0.3 },
  "opus-4.7": { input: 5, output: 25, cacheWrite: 6.25, cacheRead: 0.5 },
};

/**
 * Cost of an execution in micro dollars (1e-6 USD), stored as an integer so
 * no float rounding ever reaches the database.
 *
 * Rates are quoted per million tokens and micro dollars are a millionth of a
 * dollar, so the two factors of 1e6 cancel: a token count multiplied by its
 * per-million rate already gives micro dollars.
 */
export function computeCostUsdMicros(model: AgentModel, usage: TokenUsage): number {
  const rate = MODEL_PRICING[model];
  const micros =
    usage.inputTokens * rate.input +
    usage.outputTokens * rate.output +
    usage.cacheReadTokens * rate.cacheRead +
    usage.cacheWriteTokens * rate.cacheWrite;
  return Math.round(micros);
}

/** Human readable euros-style string for logs and dashboards, e.g. "$0.0285". */
export function formatUsdMicros(micros: number): string {
  return `$${(micros / 1_000_000).toFixed(4)}`;
}

export function totalTokens(usage: TokenUsage): number {
  return usage.inputTokens + usage.outputTokens + usage.cacheReadTokens + usage.cacheWriteTokens;
}
