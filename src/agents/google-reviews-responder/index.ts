import type { AgentDefinition } from "@/agents/_contract";
import { anthropic, resolveModel } from "@/lib/anthropic/client";
import { translateAnthropicError } from "@/lib/errors";
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

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("model_returned_no_json");
  }
  return JSON.parse(trimmed.slice(start, end + 1));
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
    const client = anthropic();
    const modelId = resolveModel("sonnet-4.6");

    try {
      const response = await client.messages.create({
        model: modelId,
        max_tokens: 1500,
        system: [
          {
            type: "text",
            text: SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [
          {
            role: "user",
            content: buildUserMessage(input),
          },
        ],
      });

      const textBlock = response.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new Error("model_returned_no_text");
      }
      const parsed = extractJson(textBlock.text);
      return outputSchema.parse(parsed);
    } catch (err) {
      throw translateAnthropicError(err);
    }
  },
};
