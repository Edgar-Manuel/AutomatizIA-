import type { AgentDefinition } from "@/agents/_contract";
import { runJsonAgentCompletion } from "@/lib/anthropic/json-agent";
import { SYSTEM_PROMPT } from "./prompt";
import {
  type InstagramCopyInput,
  type InstagramCopyOutput,
  inputSchema,
  OBJECTIVE_LABELS,
  outputSchema,
  TONE_LABELS,
} from "./schemas";

function buildUserMessage(input: InstagramCopyInput): string {
  return [
    `Negocio: ${input.businessName}`,
    `Tema del post: ${input.topic}`,
    `Objetivo: ${OBJECTIVE_LABELS[input.objective]}`,
    `Tono: ${TONE_LABELS[input.tone]}`,
    input.extraInfo ? `Detalles extra: ${input.extraInfo}` : "Detalles extra: ninguno",
    "",
    "Devuelve únicamente el JSON con las 5 variantes.",
  ].join("\n");
}

export const instagramCopyGenerator: AgentDefinition<typeof inputSchema, typeof outputSchema> = {
  slug: "instagram-copy-generator",
  name: "Generador de copys para Instagram",
  description: "5 variantes con hashtags y CTA según tu calendario editorial.",
  department: "marketing",
  tier: "starter",
  creditsCost: 1,
  model: "sonnet-4.6",
  inputSchema,
  outputSchema,
  systemPrompt: SYSTEM_PROMPT,

  async execute(input, _ctx): Promise<InstagramCopyOutput> {
    return runJsonAgentCompletion({
      model: "sonnet-4.6",
      systemPrompt: SYSTEM_PROMPT,
      userMessage: buildUserMessage(input),
      outputSchema,
      maxTokens: 1800,
    });
  },
};
