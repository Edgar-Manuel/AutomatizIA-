// Client-safe map from agent slug to its declarative form spec.
// Keep this file free of server-only imports (Anthropic client, db):
// server pages read from it and pass the plain data to the AgentRunner.

import type { AgentFormSpec } from "./_form";
import { formSpec as coldEmailWriterForm } from "./cold-email-writer/form";
import { formSpec as googleReviewsResponderForm } from "./google-reviews-responder/form";
import { formSpec as instagramCopyGeneratorForm } from "./instagram-copy-generator/form";

export const AGENT_FORMS: Record<string, AgentFormSpec> = {
  "google-reviews-responder": googleReviewsResponderForm,
  "cold-email-writer": coldEmailWriterForm,
  "instagram-copy-generator": instagramCopyGeneratorForm,
};

export function getAgentForm(slug: string): AgentFormSpec | null {
  return AGENT_FORMS[slug] ?? null;
}
