import type { AgentDefinition } from "@/agents/_contract";
import { runJsonAgentCompletion } from "@/lib/anthropic/json-agent";
import { SYSTEM_PROMPT } from "./prompt";
import {
  inputSchema,
  outputSchema,
  type ReviewInput,
  type ReviewOutput,
  TONE_LABELS,
} from "./schemas";

function buildUserMessage(input: ReviewInput): string {
  return [
    `Negocio: ${input.businessName}`,
    `Tono solicitado: ${TONE_LABELS[input.tone]}`,
    `Valoración: ${input.rating}/5`,
    input.reviewerName ? `Cliente: ${input.reviewerName}` : "Cliente: anónimo",
    "",
    "Reseña original:",
    `"""${input.review}"""`,
    "",
    "Devuelve únicamente el JSON con las 3 variantes (Empática, Resolutiva, Breve).",
  ].join("\n");
}

export const googleReviewsResponder: AgentDefinition<typeof inputSchema, typeof outputSchema> = {
  slug: "google-reviews-responder",
  name: "Generador de respuestas a reseñas Google",
  description: "Responde a reseñas con el tono de tu negocio en 6 segundos.",
  department: "atencion_cliente",
  tier: "business",
  creditsCost: 2,
  model: "sonnet-4.6",
  inputSchema,
  outputSchema,
  systemPrompt: SYSTEM_PROMPT,

  async execute(input, _ctx): Promise<ReviewOutput> {
    return runJsonAgentCompletion({
      model: "sonnet-4.6",
      systemPrompt: SYSTEM_PROMPT,
      userMessage: buildUserMessage(input),
      outputSchema,
      maxTokens: 1500,
    });
  },
};
