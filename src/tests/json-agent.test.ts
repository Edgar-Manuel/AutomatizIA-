import { describe, expect, it } from "vitest";
import { extractJson } from "@/lib/anthropic/json-agent";

describe("extractJson", () => {
  it("parses a clean JSON object", () => {
    expect(extractJson('{"variants": []}')).toEqual({ variants: [] });
  });

  it("ignores prose around the JSON", () => {
    const text =
      'Claro, aquí tienes:\n{"variants": [{"label": "A", "text": "b"}]}\nEspero que sirva.';
    expect(extractJson(text)).toEqual({ variants: [{ label: "A", text: "b" }] });
  });

  it("handles markdown code fences", () => {
    const text = '```json\n{"variants": []}\n```';
    expect(extractJson(text)).toEqual({ variants: [] });
  });

  it("keeps nested braces intact", () => {
    const text = 'prefix {"a": {"b": "c"}} suffix';
    expect(extractJson(text)).toEqual({ a: { b: "c" } });
  });

  it("throws when there is no JSON object", () => {
    expect(() => extractJson("No puedo ayudarte con eso.")).toThrow("model_returned_no_json");
  });

  it("throws on malformed JSON", () => {
    expect(() => extractJson('{"variants": [')).toThrow();
  });
});
