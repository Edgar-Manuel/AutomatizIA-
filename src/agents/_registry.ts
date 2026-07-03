import type { AnyAgent } from "./_contract";
import { makeCatalogAgent } from "./_factory";
import { CATALOG } from "./catalog";
import { coldEmailWriter } from "./cold-email-writer";
import { googleReviewsResponder } from "./google-reviews-responder";
import { instagramCopyGenerator } from "./instagram-copy-generator";

const registry: Record<string, AnyAgent> = {
  [googleReviewsResponder.slug]: googleReviewsResponder,
  [coldEmailWriter.slug]: coldEmailWriter,
  [instagramCopyGenerator.slug]: instagramCopyGenerator,
};

for (const config of CATALOG) {
  if (registry[config.slug]) {
    throw new Error(`duplicate agent slug: ${config.slug}`);
  }
  registry[config.slug] = makeCatalogAgent(config).agent;
}

export function getAgent(slug: string): AnyAgent | null {
  return registry[slug] ?? null;
}

export function listAgentSlugs(): string[] {
  return Object.keys(registry);
}
