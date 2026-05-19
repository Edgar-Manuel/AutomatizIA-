import Anthropic from "@anthropic-ai/sdk";
import type { AgentModel } from "@/db/schema";

const MODEL_ID: Record<AgentModel, string> = {
  "haiku-4.5": "claude-haiku-4-5-20251001",
  "sonnet-4.6": "claude-sonnet-4-6",
  "opus-4.7": "claude-opus-4-7",
};

export function resolveModel(model: AgentModel): string {
  return MODEL_ID[model];
}

let cached: Anthropic | null = null;

export function anthropic(): Anthropic {
  if (cached) return cached;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set. Add it to .env.local.");
  }
  cached = new Anthropic({ apiKey });
  return cached;
}
