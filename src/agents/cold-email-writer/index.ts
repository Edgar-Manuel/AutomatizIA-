import type { AgentDefinition } from "@/agents/_contract";
import { runJsonAgentCompletion } from "@/lib/anthropic/json-agent";
import { SYSTEM_PROMPT } from "./prompt";
import {
  type ColdEmailInput,
  type ColdEmailOutput,
  inputSchema,
  OBJECTIVE_LABELS,
  outputSchema,
} from "./schemas";

function buildUserMessage(input: ColdEmailInput): string {
  return [
    `Empresa remitente: ${input.companyName}`,
    `Qué vende: ${input.product}`,
    `Empresa del lead: ${input.leadCompany}`,
    input.leadName ? `Nombre del lead: ${input.leadName}` : "Nombre del lead: desconocido",
    input.leadContext
      ? `Contexto sobre el lead: ${input.leadContext}`
      : "Contexto sobre el lead: ninguno",
    `Objetivo de la secuencia: ${OBJECTIVE_LABELS[input.objective]}`,
    "",
    "Devuelve únicamente el JSON con la secuencia de 3 emails.",
  ].join("\n");
}

export const coldEmailWriter: AgentDefinition<typeof inputSchema, typeof outputSchema> = {
  slug: "cold-email-writer",
  name: "Redactor de emails de prospección en frío",
  description: "Escribe secuencias de 3 emails personalizados por lead.",
  department: "ventas",
  tier: "starter",
  creditsCost: 1,
  model: "sonnet-4.6",
  inputSchema,
  outputSchema,
  systemPrompt: SYSTEM_PROMPT,

  async execute(input, _ctx): Promise<ColdEmailOutput> {
    return runJsonAgentCompletion({
      model: "sonnet-4.6",
      systemPrompt: SYSTEM_PROMPT,
      userMessage: buildUserMessage(input),
      outputSchema,
      maxTokens: 1800,
    });
  },
};
