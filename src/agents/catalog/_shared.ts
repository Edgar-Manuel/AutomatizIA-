import type { AgentFormField } from "@/agents/_form";

// Building blocks reused across catalog configs. Pure data: catalog files
// must stay importable without pulling in the Anthropic client.

export const TONE_FIELD: AgentFormField = {
  name: "tone",
  label: "Tono",
  type: "select",
  required: true,
  defaultValue: "cercano-profesional",
  options: [
    { value: "cercano-profesional", label: "Cercano y profesional" },
    { value: "formal", label: "Formal" },
    { value: "directo", label: "Directo al grano" },
  ],
};

export const BUSINESS_NAME_FIELD: AgentFormField = {
  name: "businessName",
  label: "Nombre de tu negocio",
  type: "text",
  required: true,
  maxLength: 80,
  placeholder: "Clínica Dental Ríos",
};

export const SECTOR_FIELD: AgentFormField = {
  name: "sector",
  label: "Sector (opcional)",
  type: "text",
  maxLength: 80,
  placeholder: "Hostelería, clínica, taller...",
};
