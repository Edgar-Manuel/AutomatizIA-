import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { z } from "zod";
import type { AgentDefinition } from "@/agents/_contract";
import { getAgent, listAgentSlugs } from "@/agents/_registry";
import { coldEmailWriter } from "@/agents/cold-email-writer";
import { googleReviewsResponder } from "@/agents/google-reviews-responder";
import { instagramCopyGenerator } from "@/agents/instagram-copy-generator";

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
  it("registers the full 50-agent catalog", () => {
    const slugs = listAgentSlugs();
    expect(slugs).toEqual(
      expect.arrayContaining([
        "google-reviews-responder",
        "cold-email-writer",
        "instagram-copy-generator",
      ]),
    );
    expect(slugs.length).toBe(50);
    expect(new Set(slugs).size).toBe(50);
  });

  it("matches the department split advertised on the landing", () => {
    const byDept: Record<string, number> = {};
    for (const slug of listAgentSlugs()) {
      const agent = getAgent(slug);
      if (agent) byDept[agent.department] = (byDept[agent.department] ?? 0) + 1;
    }
    expect(byDept).toEqual({
      ventas: 11,
      marketing: 9,
      atencion_cliente: 8,
      operaciones: 7,
      rrhh: 8,
      finanzas: 7,
    });
  });

  it("offers exactly the 20 starter agents promised by the Starter plan", () => {
    const starters = listAgentSlugs().filter((slug) => getAgent(slug)?.tier === "starter");
    expect(starters.length).toBe(20);
  });

  it("every agent is seeded in a supabase migration", () => {
    const dir = join(process.cwd(), "supabase", "migrations");
    const sql = readdirSync(dir)
      .filter((f) => f.endsWith(".sql"))
      .map((f) => readFileSync(join(dir, f), "utf8"))
      .join("\n");
    for (const slug of listAgentSlugs()) {
      expect(sql, `slug ${slug} missing from seed migrations`).toContain(`'${slug}'`);
    }
  });

  it("every registered slug resolves to an agent that satisfies the contract", () => {
    const slugs = listAgentSlugs();
    expect(slugs.length).toBeGreaterThan(0);
    for (const slug of slugs) {
      const agent = getAgent(slug);
      expect(agent, `agent ${slug} not found`).not.toBeNull();
      if (agent) assertContract(agent);
    }
  });

  it("every system prompt pins the JSON contract the runner depends on", () => {
    for (const slug of listAgentSlugs()) {
      const agent = getAgent(slug);
      expect(agent?.systemPrompt).toContain('"variants"');
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

  it("cold email writer validates inputs", () => {
    const ok = coldEmailWriter.inputSchema.safeParse({
      companyName: "TurnosPro",
      product: "Software de gestión de turnos para clínicas dentales.",
      leadCompany: "Clínica Dental Ríos",
      objective: "agendar-reunion",
    });
    expect(ok.success).toBe(true);

    const optionalEmpty = coldEmailWriter.inputSchema.safeParse({
      companyName: "TurnosPro",
      product: "Software de gestión de turnos para clínicas dentales.",
      leadCompany: "Clínica Dental Ríos",
      leadName: "",
      leadContext: "",
      objective: "presentar-demo",
    });
    expect(optionalEmpty.success).toBe(true);

    const missingLead = coldEmailWriter.inputSchema.safeParse({
      companyName: "TurnosPro",
      product: "Software de gestión de turnos para clínicas dentales.",
      objective: "agendar-reunion",
    });
    expect(missingLead.success).toBe(false);

    const badObjective = coldEmailWriter.inputSchema.safeParse({
      companyName: "TurnosPro",
      product: "Software de gestión de turnos para clínicas dentales.",
      leadCompany: "Clínica Dental Ríos",
      objective: "hacer-spam",
    });
    expect(badObjective.success).toBe(false);
  });

  it("cold email writer requires exactly 3 emails in the output", () => {
    const email = `Asunto: huecos de agenda\n\nHola, un cuerpo de email suficientemente largo para el esquema de salida.`;
    const good = coldEmailWriter.outputSchema.safeParse({
      variants: [
        { label: "Email 1 · Primer contacto", text: email },
        { label: "Email 2 · Seguimiento", text: email },
        { label: "Email 3 · Último toque", text: email },
      ],
    });
    expect(good.success).toBe(true);

    const tooFew = coldEmailWriter.outputSchema.safeParse({
      variants: [{ label: "Email 1", text: email }],
    });
    expect(tooFew.success).toBe(false);
  });

  it("instagram copy generator validates inputs", () => {
    const ok = instagramCopyGenerator.inputSchema.safeParse({
      businessName: "La Huerta",
      topic: "Nueva carta de otoño con platos de temporada.",
      objective: "vender",
      tone: "cercano",
    });
    expect(ok.success).toBe(true);

    const shortTopic = instagramCopyGenerator.inputSchema.safeParse({
      businessName: "La Huerta",
      topic: "corto",
      objective: "vender",
      tone: "cercano",
    });
    expect(shortTopic.success).toBe(false);

    const badTone = instagramCopyGenerator.inputSchema.safeParse({
      businessName: "La Huerta",
      topic: "Nueva carta de otoño con platos de temporada.",
      objective: "vender",
      tone: "agresivo",
    });
    expect(badTone.success).toBe(false);
  });

  it("instagram copy generator requires exactly 5 copies in the output", () => {
    const copy = "Un copy de ejemplo con gancho, con longitud suficiente. #hashtag";
    const variants = ["Gancho directo", "Historia", "Pregunta", "Dato o consejo", "Breve"].map(
      (label) => ({ label, text: copy }),
    );
    expect(instagramCopyGenerator.outputSchema.safeParse({ variants }).success).toBe(true);
    expect(
      instagramCopyGenerator.outputSchema.safeParse({ variants: variants.slice(0, 3) }).success,
    ).toBe(false);
  });
});
