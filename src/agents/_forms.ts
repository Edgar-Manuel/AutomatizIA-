// Map from agent slug to its declarative form spec. Server pages read from
// here and pass the plain data to the client AgentRunner as props, so this
// module must stay free of Anthropic/db imports.

import type { AgentFormSpec } from "./_form";
import { CATALOG } from "./catalog";
import { formSpec as coldEmailWriterForm } from "./cold-email-writer/form";
import { formSpec as googleReviewsResponderForm } from "./google-reviews-responder/form";
import { formSpec as instagramCopyGeneratorForm } from "./instagram-copy-generator/form";

export const AGENT_FORMS: Record<string, AgentFormSpec> = {
  "google-reviews-responder": googleReviewsResponderForm,
  "cold-email-writer": coldEmailWriterForm,
  "instagram-copy-generator": instagramCopyGeneratorForm,
};

for (const config of CATALOG) {
  AGENT_FORMS[config.slug] = {
    fields: config.fields,
    resultNote: config.resultNote,
    expectedVariants: config.variants.length,
  };
}

export function getAgentForm(slug: string): AgentFormSpec | null {
  return AGENT_FORMS[slug] ?? null;
}
