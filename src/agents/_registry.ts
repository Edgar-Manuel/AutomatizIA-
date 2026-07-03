import type { AnyAgent } from "./_contract";
import { coldEmailWriter } from "./cold-email-writer";
import { googleReviewsResponder } from "./google-reviews-responder";
import { instagramCopyGenerator } from "./instagram-copy-generator";

const registry: Record<string, AnyAgent> = {
  [googleReviewsResponder.slug]: googleReviewsResponder,
  [coldEmailWriter.slug]: coldEmailWriter,
  [instagramCopyGenerator.slug]: instagramCopyGenerator,
};

export function getAgent(slug: string): AnyAgent | null {
  return registry[slug] ?? null;
}

export function listAgentSlugs(): string[] {
  return Object.keys(registry);
}
