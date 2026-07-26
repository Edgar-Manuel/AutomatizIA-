import { describe, expect, it } from "vitest";
import { z } from "zod";
import { AGENT_FORMS, getAgentForm } from "@/agents/_forms";
import { getAgent, listAgentSlugs } from "@/agents/_registry";

// The AgentRunner renders whatever the form spec declares and submits it to
// runAgent, so a drift between form specs and input schemas means a broken
// agent page. These tests pin the two together.

// Zod v4 types ZodObject.shape entries as core $ZodType (no safeParse); at
// runtime they are full schemas, so narrow them explicitly.
function accepts(schema: unknown, value: unknown): boolean {
  return (schema as z.ZodType).safeParse(value).success;
}

describe("Agent form specs", () => {
  it("every registered agent has a form spec, and vice versa", () => {
    const slugs = listAgentSlugs().sort();
    expect(Object.keys(AGENT_FORMS).sort()).toEqual(slugs);
    for (const slug of slugs) {
      expect(getAgentForm(slug)).not.toBeNull();
    }
  });

  it("every form field maps to a key in the agent's input schema", () => {
    for (const slug of listAgentSlugs()) {
      const agent = getAgent(slug);
      const form = getAgentForm(slug);
      if (!agent || !form) throw new Error(`missing agent or form for ${slug}`);

      const schema = agent.inputSchema;
      expect(schema instanceof z.ZodObject, `input schema of ${slug} must be an object`).toBe(true);
      const shape = (schema as z.ZodObject<z.ZodRawShape>).shape;

      for (const field of form.fields) {
        expect(
          Object.keys(shape),
          `field "${field.name}" of ${slug} is not in its input schema`,
        ).toContain(field.name);
      }
    }
  });

  it("optional form fields are optional in the schema too", () => {
    for (const slug of listAgentSlugs()) {
      const agent = getAgent(slug);
      const form = getAgentForm(slug);
      if (!agent || !form) throw new Error(`missing agent or form for ${slug}`);
      const shape = (agent.inputSchema as z.ZodObject<z.ZodRawShape>).shape;

      for (const field of form.fields) {
        if (!field.required) {
          // The runner strips empty strings to undefined before submitting.
          expect(
            accepts(shape[field.name], undefined),
            `optional field "${field.name}" of ${slug} must accept undefined`,
          ).toBe(true);
        }
      }
    }
  });

  it("select options and default values are accepted by the schema", () => {
    for (const slug of listAgentSlugs()) {
      const agent = getAgent(slug);
      const form = getAgentForm(slug);
      if (!agent || !form) throw new Error(`missing agent or form for ${slug}`);
      const shape = (agent.inputSchema as z.ZodObject<z.ZodRawShape>).shape;

      for (const field of form.fields) {
        const fieldSchema = shape[field.name];
        if (!fieldSchema) continue;

        if (field.type === "select") {
          expect(
            field.options?.length ?? 0,
            `select "${field.name}" of ${slug} has no options`,
          ).toBeGreaterThan(0);
          for (const opt of field.options ?? []) {
            expect(
              accepts(fieldSchema, opt.value),
              `option "${opt.value}" of ${slug}.${field.name} rejected by schema`,
            ).toBe(true);
          }
        }

        if (field.defaultValue !== undefined) {
          expect(
            accepts(fieldSchema, field.defaultValue),
            `default of ${slug}.${field.name} rejected by schema`,
          ).toBe(true);
        }
      }
    }
  });

  it("every form declares result copy and a sensible skeleton count", () => {
    for (const slug of listAgentSlugs()) {
      const form = getAgentForm(slug);
      expect(form?.resultNote.length ?? 0).toBeGreaterThan(10);
      expect(form?.expectedVariants ?? 0).toBeGreaterThanOrEqual(1);
      expect(form?.expectedVariants ?? 99).toBeLessThanOrEqual(8);
    }
  });
});
