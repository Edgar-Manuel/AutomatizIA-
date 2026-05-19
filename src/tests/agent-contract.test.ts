import { describe, expect, it } from "vitest";
import type { z } from "zod";
import type { AgentDefinition } from "@/agents/_contract";
import { getAgent, listAgentSlugs } from "@/agents/_registry";
import { googleReviewsResponder } from "@/agents/google-reviews-responder";

const VALID_DEPARTMENTS = [
  "ventas",
  "marketing",
  "atencion_cliente",
  "operaciones",
  "rrhh",
  "finanzas",
];
const VALID_TIERS = ["starter", "business", "scale"];
const VALID_MODELS = ["haiku-4.5", "sonnet-4.6", "opus-4.7"];

function assertContract<I extends z.ZodTypeAny, O extends z.ZodTypeAny>(
  agent: AgentDefinition<I, O>,
) {
  expect(agent.slug).toMatch(/^[a-z0-9-]+$/);
  expect(agent.name.length).toBeGreaterThan(0);
  expect(agent.description.length).toBeGreaterThan(0);
  expect(VALID_DEPARTMENTS).toContain(agent.department);
  expect(VALID_TIERS).toContain(agent.tier);
  expect(VALID_MODELS).toContain(agent.model);
  expect(agent.creditsCost).toBeGreaterThan(0);
  expect(agent.systemPrompt.length).toBeGreaterThan(50);
  expect(typeof agent.execute).toBe("function");
  expect(agent.inputSchema).toBeDefined();
  expect(agent.outputSchema).toBeDefined();
}

describe("Agent contract", () => {
  it("every registered slug resolves to an agent that satisfies the contract", () => {
    const slugs = listAgentSlugs();
    expect(slugs.length).toBeGreaterThan(0);
    for (const slug of slugs) {
      const agent = getAgent(slug);
      expect(agent, `agent ${slug} not found`).not.toBeNull();
      if (agent) assertContract(agent);
    }
  });

  it("google reviews responder validates inputs", () => {
    const ok = googleReviewsResponder.inputSchema.safeParse({
      review: "Llevo años yendo y la atención es excelente",
      rating: 5,
      businessName: "Test SL",
      tone: "cercano-profesional",
    });
    expect(ok.success).toBe(true);

    const tooShort = googleReviewsResponder.inputSchema.safeParse({
      review: "corto",
      rating: 5,
      businessName: "X",
      tone: "cercano-profesional",
    });
    expect(tooShort.success).toBe(false);

    const badRating = googleReviewsResponder.inputSchema.safeParse({
      review: "Esta es una reseña suficientemente larga",
      rating: 9,
      businessName: "Test SL",
      tone: "cercano-profesional",
    });
    expect(badRating.success).toBe(false);
  });

  it("google reviews responder validates outputs", () => {
    const good = googleReviewsResponder.outputSchema.safeParse({
      variants: [
        { label: "Empática", text: "Una respuesta de prueba suficientemente larga." },
        { label: "Resolutiva", text: "Otra respuesta de prueba suficientemente larga." },
        { label: "Breve", text: "Una tercera respuesta también suficientemente larga." },
      ],
    });
    expect(good.success).toBe(true);

    const wrongLength = googleReviewsResponder.outputSchema.safeParse({
      variants: [{ label: "X", text: "Demasiado corto" }],
    });
    expect(wrongLength.success).toBe(false);
  });
});
