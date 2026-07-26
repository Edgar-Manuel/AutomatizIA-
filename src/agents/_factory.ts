import { type ZodTypeAny, z } from "zod";
import type { AgentModel, AgentTier, Department } from "@/db/schema";
import { runJsonAgentCompletion } from "@/lib/anthropic/json-agent";
import type { AnyAgent } from "./_contract";
import type { AgentFormField, AgentFormSpec } from "./_form";

// Catalog agents are pure data: the factory turns a config into a full
// AgentDefinition (zod input schema derived from the form fields, output
// schema derived from the variant list, system prompt assembled from the
// house rules + agent-specific rules) plus its AgentFormSpec.

export type CatalogVariant = {
  label: string;
  /** One-line brief of what this block must contain, injected in the prompt. */
  focus: string;
};

export type CatalogAgentConfig = {
  slug: string;
  name: string;
  description: string;
  department: Department;
  tier: AgentTier;
  creditsCost: number;
  model: AgentModel;
  /** Completes "Eres ..." — e.g. "un SDR senior español que...". No trailing dot. */
  role: string;
  /** Completes "Tu misión: ...". No trailing dot. */
  mission: string;
  rules: string[];
  variants: CatalogVariant[];
  fields: AgentFormField[];
  resultNote: string;
  maxTokens?: number;
  /** Minimum characters per variant text (output schema). */
  minVariantChars?: number;
};

const HOUSE_RULES = [
  "Siempre en español de España, salvo que los datos de entrada estén claramente en otro idioma.",
  "Nunca uses em-dash. Usa coma, punto o paréntesis.",
  "Nunca uses jerga corporativa vacía ni frases hechas de plantilla.",
  "No inventes datos, cifras, nombres ni compromisos que no estén en la información proporcionada.",
];

export function buildSystemPrompt(config: CatalogAgentConfig): string {
  const contractLines = config.variants.map((v, i) => {
    const comma = i < config.variants.length - 1 ? "," : "";
    return `    { "label": "${v.label}", "text": string }${comma}`;
  });

  const variantGuide = config.variants
    .map((v, i) => `${i + 1}. "${v.label}": ${v.focus}`)
    .join("\n");

  return [
    `Eres ${config.role}.`,
    `Tu misión: ${config.mission}.`,
    "",
    "Reglas inviolables:",
    ...HOUSE_RULES.map((r) => `- ${r}`),
    ...config.rules.map((r) => `- ${r}`),
    "",
    "Devuelves SIEMPRE un JSON válido que cumple este esquema, sin texto extra antes o después:",
    "{",
    '  "variants": [',
    ...contractLines,
    "  ]",
    "}",
    "",
    `Los ${config.variants.length} bloques del resultado:`,
    variantGuide,
  ].join("\n");
}

function fieldSchema(field: AgentFormField): ZodTypeAny {
  if (field.type === "stars") {
    return z.coerce.number().int().min(1).max(5);
  }

  if (field.type === "select") {
    const values = (field.options ?? []).map((o) => o.value);
    if (values.length === 0) {
      throw new Error(`select field "${field.name}" has no options`);
    }
    const base = z.enum(values as [string, ...string[]]);
    return field.defaultValue !== undefined ? base.default(String(field.defaultValue)) : base;
  }

  let str = z
    .string()
    .max(
      field.maxLength ?? 2000,
      `"${field.label}" es demasiado largo (máximo ${field.maxLength ?? 2000} caracteres).`,
    );
  if (field.required) {
    str = str.min(
      field.minLength ?? 1,
      field.minLength
        ? `"${field.label}" necesita al menos ${field.minLength} caracteres.`
        : `Rellena el campo "${field.label}".`,
    );
    return str;
  }
  // The runner strips empty strings to undefined, but accept both.
  return str.optional().or(z.literal(""));
}

export function buildUserMessage(
  config: CatalogAgentConfig,
  input: Record<string, unknown>,
): string {
  const lines = config.fields.map((field) => {
    const raw = input[field.name];
    if (field.type === "stars") {
      return `${field.label}: ${raw}/5`;
    }
    if (field.type === "select") {
      const label = field.options?.find((o) => o.value === raw)?.label ?? String(raw ?? "");
      return `${field.label}: ${label}`;
    }
    const value = typeof raw === "string" && raw.trim() !== "" ? raw.trim() : "no indicado";
    return `${field.label}: ${value}`;
  });

  return [
    ...lines,
    "",
    `Devuelve únicamente el JSON con los ${config.variants.length} bloques indicados.`,
  ].join("\n");
}

export function makeCatalogAgent(config: CatalogAgentConfig): {
  agent: AnyAgent;
  form: AgentFormSpec;
} {
  const inputSchema = z.object(
    Object.fromEntries(config.fields.map((f) => [f.name, fieldSchema(f)])),
  );
  const outputSchema = z.object({
    variants: z
      .array(
        z.object({
          label: z.string(),
          text: z.string().min(config.minVariantChars ?? 30),
        }),
      )
      .length(config.variants.length),
  });
  const systemPrompt = buildSystemPrompt(config);

  const agent: AnyAgent = {
    slug: config.slug,
    name: config.name,
    description: config.description,
    department: config.department,
    tier: config.tier,
    creditsCost: config.creditsCost,
    model: config.model,
    inputSchema,
    outputSchema,
    systemPrompt,
    execute(input) {
      return runJsonAgentCompletion({
        model: config.model,
        systemPrompt,
        userMessage: buildUserMessage(config, input as Record<string, unknown>),
        outputSchema,
        maxTokens: config.maxTokens ?? 1800,
      });
    },
  };

  const form: AgentFormSpec = {
    fields: config.fields,
    resultNote: config.resultNote,
    expectedVariants: config.variants.length,
  };

  return { agent, form };
}
