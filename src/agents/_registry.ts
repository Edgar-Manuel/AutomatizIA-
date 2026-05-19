import type { AnyAgent } from "./_contract";
import { googleReviewsResponder } from "./google-reviews-responder";

const registry: Record<string, AnyAgent> = {
  [googleReviewsResponder.slug]: googleReviewsResponder,
};

export function getAgent(slug: string): AnyAgent | null {
  return registry[slug] ?? null;
}

export function listAgentSlugs(): string[] {
  return Object.keys(registry);
}
