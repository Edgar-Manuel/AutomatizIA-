import { AsyncLocalStorage } from "node:async_hooks";
import { EMPTY_USAGE, type TokenUsage } from "./pricing";

/**
 * Token usage is collected out of band instead of being threaded through
 * every agent's execute() signature. An agent may make more than one model
 * call, and all 50 catalog agents share a single generated execute(), so an
 * ambient accumulator keeps the agent contract untouched while still adding
 * up every call made inside one execution.
 */
type Accumulator = TokenUsage;

const storage = new AsyncLocalStorage<Accumulator>();

/**
 * Shape of the usage block the Anthropic SDK returns. Declared structurally
 * so this module does not depend on the SDK's response types.
 */
export type AnthropicUsage = {
  input_tokens?: number | null;
  output_tokens?: number | null;
  cache_read_input_tokens?: number | null;
  cache_creation_input_tokens?: number | null;
};

/**
 * Adds one model call to the active scope. A no-op when called outside a
 * scope, so agents stay runnable from scripts and tests with no setup.
 */
export function recordUsage(usage: AnthropicUsage): void {
  const acc = storage.getStore();
  if (!acc) return;
  acc.inputTokens += usage.input_tokens ?? 0;
  acc.outputTokens += usage.output_tokens ?? 0;
  acc.cacheReadTokens += usage.cache_read_input_tokens ?? 0;
  acc.cacheWriteTokens += usage.cache_creation_input_tokens ?? 0;
}

export type UsageScope = {
  /** Runs fn with this scope active, so nested recordUsage calls land here. */
  run<T>(fn: () => Promise<T>): Promise<T>;
  /**
   * Usage accumulated so far. Readable after run() rejects too, which is what
   * lets a failed execution still report the tokens it burned.
   */
  usage(): TokenUsage;
};

export function createUsageScope(): UsageScope {
  const acc: Accumulator = { ...EMPTY_USAGE };
  return {
    run: (fn) => storage.run(acc, fn),
    usage: () => ({ ...acc }),
  };
}
